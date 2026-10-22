import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import type { Identity } from './types';

/**
 * Strike builder connect.
 *
 * Verified live on mainnet: POST /auth/builder/request-signature with the `paps` code
 * returns the consent message. Two things the docs get wrong and we learned by probing:
 * the route is /auth/… not under /price, and the field is `fee_share_bps`, not
 * `max_fee_bps` (that one is rejected as an unknown field).
 *
 * The last step is a wallet signature. That part cannot be exercised without a real
 * CIP-30 wallet in the browser, so it is written to the spec and marked as such.
 */

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

// The builder route sits outside the /price/v2 prefix every other endpoint uses.
const ORIGIN: Record<'mainnet' | 'testnet', string> = {
  mainnet: 'https://api.strikefinance.org',
  testnet: 'https://api-v2-testnet.strikefinance.org',
};

const ENV = (import.meta.env.VITE_STRIKE_ENV as 'mainnet' | 'testnet') ?? 'mainnet';

/** 0 bps by design: paps never sends an order, so it never takes a fee. */
export const FEE_SHARE_BPS = 0;
export const BUILDER_CODE = (import.meta.env.VITE_BUILDER_CODE as string | undefined) ?? 'paps';
/** The origin the consent message is signed for, when we need to compose one. */
export const signatureDomain = (): string =>
  typeof window === 'undefined' ? 'paps' : window.location.host;

export type Challenge = { nonce: string; message_to_sign: string };

export type BuilderAccount = {
  account_id: string;
  nickname?: string;
  builder_code: string;
  fee_share_bps: number;
  api_wallet_id: string;
  api_wallet_public_key: string;
};

export const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

/** Keypair lives client-side; only the public half is ever sent. */
export function newApiWallet(): { publicKeyHex: string; privateKey: Uint8Array } {
  const privateKey = ed.utils.randomPrivateKey();
  const publicKeyHex = toHex(ed.getPublicKey(privateKey));
  return { publicKeyHex, privateKey };
}

export async function requestChallenge(args: {
  address: string;
  publicKeyHex: string;
}): Promise<Challenge> {
  const res = await fetch(`${ORIGIN[ENV]}/auth/builder/request-signature`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      address: args.address,
      chain: 'cardano',
      code: BUILDER_CODE,
      fee_share_bps: FEE_SHARE_BPS,
      public_key: args.publicKeyHex,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error ?? `builder challenge failed (${res.status})`);
  return body as Challenge;
}

export async function verifySignature(args: {
  address: string;
  nonce: string;
  walletSignature: string;
}): Promise<BuilderAccount> {
  const res = await fetch(`${ORIGIN[ENV]}/auth/builder/verify-signature`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      address: args.address,
      chain: 'cardano',
      nonce: args.nonce,
      wallet_signature: args.walletSignature,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error ?? `builder verify failed (${res.status})`);
  return body as BuilderAccount;
}

const KEY_STORE = 'paps.apikey.';

export const storeApiKey = (address: string, privateKey: Uint8Array): void => {
  try {
    localStorage.setItem(KEY_STORE + address, toHex(privateKey));
  } catch {
    /* nothing to do: the key just will not survive a reload */
  }
};

export const loadApiKey = (address: string): Uint8Array | null => {
  try {
    const hex = localStorage.getItem(KEY_STORE + address);
    return hex ? Uint8Array.from(hex.match(/.{2}/g)!.map((b) => parseInt(b, 16))) : null;
  } catch {
    return null;
  }
};

/**
 * The whole flow: enable the wallet, mint an API keypair locally, get the challenge,
 * sign it, exchange the signature for an account, keep the private half on the device.
 */
export type Signer = {
  address: string;
  wallet: string;
  provider: 'cip30' | 'utxos';
  /** Signs the consent message and returns the signature hex. */
  signMessage: (message: string) => Promise<string>;
};

/**
 * The flow, independent of which wallet produced the signature: mint a keypair locally,
 * get the consent challenge, sign it, exchange it for an account, keep the private half.
 */
export async function connectBuilderWith(signer: Signer): Promise<BuilderIdentity> {
  const { publicKeyHex, privateKey } = newApiWallet();
  const challenge = await requestChallenge({ address: signer.address, publicKeyHex });
  const signature = await signer.signMessage(challenge.message_to_sign);

  const account = await verifySignature({
    address: signer.address,
    nonce: challenge.nonce,
    walletSignature: signature,
  });

  storeApiKey(signer.address, privateKey);

  return {
    provider: signer.provider,
    address: signer.address,
    wallet: signer.wallet,
    accountId: account.account_id,
    apiWalletId: account.api_wallet_id,
    publicKeyHex,
    feeShareBps: account.fee_share_bps,
  };
}

export async function connectBuilder(walletId: string): Promise<BuilderIdentity> {
  const api = window.cardano?.[walletId];
  if (!api) throw new Error(`${walletId} is not installed`);

  const handle = await api.enable();
  if (!handle.signData) throw new Error(`${api.name ?? walletId} cannot sign messages`);

  const address = await handle.getChangeAddress();

  return connectBuilderWith({
    address,
    wallet: api.name ?? walletId,
    provider: 'cip30',
    signMessage: async (message) => {
      const payloadHex = toHex(new TextEncoder().encode(message));
      const { signature } = await handle.signData!(address, payloadHex);
      return signature;
    },
  });
}

export type BuilderIdentity = Identity & {
  accountId: string;
  apiWalletId: string;
  publicKeyHex: string;
  feeShareBps: number;
};
