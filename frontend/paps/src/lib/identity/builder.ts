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

export async function connectBuilder(walletId: string): Promise<BuilderIdentity> {
  const api = window.cardano?.[walletId];
  if (!api) throw new Error(`${walletId} is not installed`);

  const handle = await api.enable();
  if (!handle.signData) throw new Error(`${api.name ?? walletId} cannot sign messages`);

  const address = await handle.getChangeAddress();

  const started = await post<{ token: string; message_to_sign: string }>('/api/connect/start', {
    address,
  });

  // CIP-8 signs bytes; Strike's message is the text the user reads in the wallet prompt.
  const payloadHex = toHex(new TextEncoder().encode(started.message_to_sign));
  const { signature } = await handle.signData(address, payloadHex);

  const done = await post<{
    accountId: string;
    apiWalletId: string;
    publicKeyHex: string;
    feeShareBps: number;
    expiresAt: number;
  }>('/api/connect/finish', { token: started.token, signature });

  return {
    provider: 'cip30',
    address,
    wallet: api.name ?? walletId,
    accountId: done.accountId,
    apiWalletId: done.apiWalletId,
    publicKeyHex: done.publicKeyHex,
    feeShareBps: done.feeShareBps,
    expiresAt: done.expiresAt,
  };
}

/** True when the API wallet behind a session has expired and connect has to run again. */
export const needsReconnect = (identity: Identity | null): boolean =>
  Boolean(identity?.expiresAt && identity.expiresAt <= Date.now());
