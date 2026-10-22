import type { Identity } from './types';

/**
 * Strike builder connect, with paps holding the key.
 *
 * The server mints the API wallet keypair, keeps the sealed private half and answers with
 * an HttpOnly session cookie. This browser's only job is to have the wallet sign Strike's
 * consent message, which is the part that proves a human controls the address.
 *
 * Nothing here stores a key any more, and nothing here treats the session as permanent:
 * Strike revokes the previous API wallet on every reconnect, so `expiresAt` is kept and a
 * 401 `reconnect` from the proxy means run this flow again.
 */

export type BuilderIdentity = Identity & {
  accountId: string;
  apiWalletId: string;
  publicKeyHex: string;
  feeShareBps: number;
  /** Unix ms, or 0 when the venue did not return one. */
  expiresAt: number;
};

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  const payload = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(String(payload.message ?? payload.error ?? `${path} failed (${res.status})`));
  }
  return payload as T;
}

/**
 * The flow, independent of which wallet produced the signature.
 *
 * The keypair is minted by the server and never reaches this file: we ask for a challenge,
 * have the wallet sign Strike's consent message, and trade the signature for a session.
 */
export type Signer = {
  address: string;
  wallet: string;
  provider: 'cip30' | 'utxos';
  /** Signs the consent message and returns the signature hex. */
  signMessage: (message: string) => Promise<string>;
};

export async function connectBuilderWith(signer: Signer): Promise<BuilderIdentity> {
  const started = await post<{ token: string; message_to_sign: string }>('/api/connect/start', {
    address: signer.address,
  });

  const signature = await signer.signMessage(started.message_to_sign);

  const done = await post<{
    accountId: string;
    apiWalletId: string;
    publicKeyHex: string;
    feeShareBps: number;
    expiresAt: number;
  }>('/api/connect/finish', { token: started.token, signature });

  return {
    provider: signer.provider,
    address: signer.address,
    wallet: signer.wallet,
    accountId: done.accountId,
    apiWalletId: done.apiWalletId,
    publicKeyHex: done.publicKeyHex,
    feeShareBps: done.feeShareBps,
    expiresAt: done.expiresAt,
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

/** True when the API wallet behind a session has expired and connect has to run again. */
export const needsReconnect = (identity: Identity | null): boolean =>
  Boolean(identity?.expiresAt && identity.expiresAt <= Date.now());
