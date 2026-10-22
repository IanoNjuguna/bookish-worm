import { signedHeaders } from './sign';
import { HttpError, type Env, type StrikeAccount } from './types';

/**
 * The signed half of Strike's API.
 *
 * Note the split that costs an afternoon: public market data lives under `/price/v2`,
 * while everything signed lives under `/v2` on the bare origin. `signedCall` therefore
 * takes a path that already starts with `/v2` and never prepends `/price`.
 */

export const ORIGIN: Record<Env, string> = {
  mainnet: 'https://api.strikefinance.org',
  testnet: 'https://api-v2-testnet.strikefinance.org',
};

export const originFor = (env: string | undefined): string =>
  ORIGIN[env === 'testnet' ? 'testnet' : 'mainnet'];

export type StrikeTransport = {
  origin: string;
  /** Injected in tests; production uses the global fetch. */
  doFetch?: typeof fetch;
};

const transport = (t: StrikeTransport): typeof fetch => t.doFetch ?? fetch;

export async function requestSignature(
  t: StrikeTransport,
  args: { address: string; publicKeyHex: string; code: string; feeShareBps: number },
): Promise<{ nonce: string; message_to_sign: string }> {
  const res = await transport(t)(`${t.origin}/auth/builder/request-signature`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      address: args.address,
      chain: 'cardano',
      code: args.code,
      fee_share_bps: args.feeShareBps,
      public_key: args.publicKeyHex,
    }),
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new HttpError(res.status, 'challenge_failed', String(body.error ?? 'builder challenge failed'));
  }
  if (typeof body.nonce !== 'string' || typeof body.message_to_sign !== 'string') {
    // A challenge without both halves cannot be completed; better to fail here than to
    // hand the user a wallet prompt for a message we cannot verify afterwards.
    throw new HttpError(502, 'challenge_malformed');
  }
  return { nonce: body.nonce, message_to_sign: body.message_to_sign };
}

export async function verifyBuilder(
  t: StrikeTransport,
  args: { address: string; nonce: string; walletSignature: string },
): Promise<StrikeAccount> {
  const res = await transport(t)(`${t.origin}/auth/builder/verify-signature`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      address: args.address,
      chain: 'cardano',
      nonce: args.nonce,
      wallet_signature: args.walletSignature,
    }),
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new HttpError(res.status === 401 ? 401 : 502, 'verify_failed', String(body.error ?? 'builder verify failed'));
  }
  if (typeof body.account_id !== 'string' || typeof body.api_wallet_id === 'undefined') {
    throw new HttpError(502, 'verify_malformed');
  }
  return body as unknown as StrikeAccount;
}

/** Signs one call with the held key. The body string is sent byte for byte. */
export async function signedCall(
  t: StrikeTransport,
  args: { privateKeyHex: string; method: string; path: string; body?: string },
): Promise<Response> {
  const headers = await signedHeaders({
    privateKeyHex: args.privateKeyHex,
    method: args.method,
    path: args.path,
    body: args.body,
  });
  return transport(t)(`${t.origin}${args.path}`, {
    method: args.method,
    headers: {
      ...headers,
      accept: 'application/json',
      ...(args.body ? { 'content-type': 'application/json' } : {}),
    },
    ...(args.body ? { body: args.body } : {}),
  });
}
