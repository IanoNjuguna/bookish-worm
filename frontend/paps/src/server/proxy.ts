import { openKey, toHex } from './crypto';
import { sessionHash } from './session';
import { signedCall, type StrikeTransport } from './strike';
import { HttpError, type Store } from './types';

/**
 * The signing proxy.
 *
 * Two rules make this safe to expose: the path allowlist keeps the held key from being
 * pointed at endpoints paps has no business calling, and the per-request expiry check
 * means a revoked or expired API wallet stops working here rather than failing loudly at
 * the venue after somebody has typed a size.
 */

const ALLOWED = [
  '/v2/account',
  '/v2/positions',
  '/v2/openOrders',
  '/v2/order',
  '/v2/history',
  '/v2/leverage',
  '/v2/marginMode',
  '/v2/fee-tiers',
  '/v2/deposit',
];

const normalise = (path: string): string => path.split('?')[0].replace(/\/+$/, '');

export function isAllowedPath(path: string): boolean {
  const target = normalise(path);
  return ALLOWED.some((prefix) => target === prefix || target.startsWith(`${prefix}/`));
}

export type ProxyDeps = {
  store: Store;
  master: Uint8Array;
  strike: StrikeTransport;
  now?: () => number;
};

export type ProxyResult = { status: number; body: string; contentType: string };

/**
 * The one place a session becomes the key that signs for it.
 *
 * Every signed call paps makes goes through here, so the three answers a dead session can
 * get — no cookie, unknown hash, expired API wallet — are decided once rather than
 * re-litigated per endpoint and drifting apart.
 */
export async function signingKey(deps: ProxyDeps, sessionToken: string | null): Promise<string> {
  if (!sessionToken) throw new HttpError(401, 'no_session');
  const record = await deps.store.getAccount(await sessionHash(sessionToken));
  if (!record) throw new HttpError(401, 'no_session');

  const now = deps.now?.() ?? Date.now();
  // expiresAt of 0 means the venue never told us, which is not the same as expired.
  if (record.expiresAt && record.expiresAt <= now) throw new HttpError(401, 'reconnect');
  return toHex(await openKey(deps.master, record.sealedKey));
}

export async function proxyStrike(
  deps: ProxyDeps,
  args: { sessionToken: string | null; method: string; path: string; body?: string },
): Promise<ProxyResult> {
  const privateKeyHex = await signingKey(deps, args.sessionToken);
  if (!isAllowedPath(args.path)) throw new HttpError(403, 'path_not_allowed');

  const res = await signedCall(deps.strike, {
    privateKeyHex,
    method: args.method,
    path: args.path,
    body: args.body,
  });

  return {
    status: res.status,
    body: await res.text(),
    contentType: res.headers.get('content-type') ?? 'application/json',
  };
}
