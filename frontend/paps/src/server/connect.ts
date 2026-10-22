import * as ed from '@noble/ed25519';
import { sealKey, toHex } from './crypto';
import { randomHex } from './crypto';
import { enforce, ipBucket, type Limits } from './rateLimit';
import { sessionHash } from './session';
import { requestSignature, verifyBuilder, type StrikeTransport } from './strike';
import { HttpError, type RateLimitStore, type Store } from './types';

/**
 * Builder connect, with the key never leaving the server.
 *
 * The browser used to mint the keypair and keep the private half in localStorage. It now
 * asks the server to start a challenge, signs only the consent message, and receives an
 * account plus an expiry. Whatever can trade the account stays here, sealed.
 *
 * Pending challenges are single use and short lived: a nonce is worth 5 minutes at Strike
 * and a signature over it is worth exactly one account, so replaying the token must fail.
 *
 * Both steps are counted per client IP. This is the unauthenticated half of the service —
 * anyone can ask paps to mint a keypair and ask Strike for a challenge — so it is the half
 * an attacker can actually drive, and the ceiling is what stops one address from filling
 * the pending table or getting the builder code throttled at the venue.
 */

export const PENDING_TTL_MS = 5 * 60_000;

export type ConnectDeps = {
  store: Store;
  /** Counters live in D1 in production; see `keystore.ts`. */
  limiter: RateLimitStore;
  limits: Limits;
  master: Uint8Array;
  strike: StrikeTransport;
  builderCode: string;
  feeShareBps: number;
  now?: () => number;
};

export type StartedConnect = {
  /** Opaque handle for finish; not the venue nonce, which stays server-side. */
  token: string;
  message_to_sign: string;
  publicKeyHex: string;
  expiresInMs: number;
};

export type ConnectedAccount = {
  sessionToken: string;
  accountId: string;
  apiWalletId: string;
  publicKeyHex: string;
  feeShareBps: number;
  /** Unix ms, or 0 when the venue did not return an expiry. */
  expiresAt: number;
};

/**
 * One bucket per address for the whole flow: start and finish are two calls, not two
 * limits. A request with no address to count falls into a shared bucket, which is
 * stricter than skipping the check.
 */
const countConnect = (deps: ConnectDeps, ip: string | undefined, now: number): Promise<void> =>
  enforce({
    store: deps.limiter,
    key: ipBucket(ip ?? 'unknown'),
    spec: deps.limits.connect,
    now,
  });

export async function startConnect(
  deps: ConnectDeps,
  args: { address: string; ip?: string },
): Promise<StartedConnect> {
  const now = deps.now?.() ?? Date.now();
  await countConnect(deps, args.ip, now);

  const privateKey = ed.utils.randomPrivateKey();
  const publicKeyHex = toHex(ed.getPublicKey(privateKey));

  const challenge = await requestSignature(deps.strike, {
    address: args.address,
    publicKeyHex,
    code: deps.builderCode,
    feeShareBps: deps.feeShareBps,
  });

  const token = randomHex(32);
  await deps.store.putPending(token, {
    nonce: challenge.nonce,
    address: args.address,
    publicKeyHex,
    sealedKey: await sealKey(deps.master, privateKey),
    expiresAt: now + PENDING_TTL_MS,
  });

  return {
    token,
    message_to_sign: challenge.message_to_sign,
    publicKeyHex,
    expiresInMs: PENDING_TTL_MS,
  };
}

export async function finishConnect(
  deps: ConnectDeps,
  args: { token: string; walletSignature: string; ip?: string },
): Promise<ConnectedAccount> {
  const now = deps.now?.() ?? Date.now();
  await countConnect(deps, args.ip, now);

  const pending = await deps.store.takePending(args.token);
  if (!pending) throw new HttpError(400, 'challenge_expired');

  const account = await verifyBuilder(deps.strike, {
    address: pending.address,
    nonce: pending.nonce,
    walletSignature: args.walletSignature,
  });

  // The venue binds the public key it was given. If what comes back differs from the key
  // we sealed, the stored key is not the key that can trade this account, and storing it
  // anyway would produce an account that looks connected and signs nothing.
  if (
    account.api_wallet_public_key &&
    account.api_wallet_public_key.toLowerCase() !== pending.publicKeyHex.toLowerCase()
  ) {
    throw new HttpError(502, 'key_mismatch');
  }

  const expiresAt = Date.parse(account.api_wallet_expired_at ?? '');
  const sessionToken = randomHex(32);
  await deps.store.putAccount(await sessionHash(sessionToken), {
    accountId: account.account_id,
    address: pending.address,
    apiWalletId: String(account.api_wallet_id),
    publicKeyHex: pending.publicKeyHex,
    sealedKey: pending.sealedKey,
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : 0,
  });

  return {
    sessionToken,
    accountId: account.account_id,
    apiWalletId: String(account.api_wallet_id),
    publicKeyHex: pending.publicKeyHex,
    feeShareBps: account.fee_share_bps ?? deps.feeShareBps,
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : 0,
  };
}

/** What `/api/session` answers with: identity and expiry, never a key. */
export async function sessionInfo(deps: ConnectDeps, sessionToken: string | null) {
  if (!sessionToken) return null;
  const record = await deps.store.getAccount(await sessionHash(sessionToken));
  if (!record) return null;
  return {
    accountId: record.accountId,
    address: record.address,
    publicKeyHex: record.publicKeyHex,
    expiresAt: record.expiresAt,
  };
}

export async function forgetSession(deps: ConnectDeps, sessionToken: string | null): Promise<void> {
  if (!sessionToken) return;
  await deps.store.deleteAccount(await sessionHash(sessionToken));
}
