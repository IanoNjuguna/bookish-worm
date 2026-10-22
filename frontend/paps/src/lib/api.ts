/**
 * Strike Finance public market data.
 *
 * The documented base URL omits the `/price` prefix, and `/v2/...` returns
 * "404 page not found" on both environments. The real routes are `/price/v2/...`.
 * Everything here was checked against the live API, not just the docs.
 */

export type Env = 'mainnet' | 'testnet';

const ORIGINS: Record<Env, { rest: string; ws: string }> = {
  mainnet: { rest: 'https://api.strikefinance.org', ws: 'wss://api.strikefinance.org' },
  testnet: {
    rest: 'https://api-v2-testnet.strikefinance.org',
    ws: 'wss://api-v2-testnet.strikefinance.org',
  },
};

export const env: Env = (import.meta.env.VITE_STRIKE_ENV as Env) ?? 'mainnet';

/** The bare API origin: fee tiers and the user-data proxy live at the root, not under `/price`. */
export const ORIGIN = ORIGINS[env].rest;

export const REST = `${ORIGINS[env].rest}/price/v2`;
export const WS = `${ORIGINS[env].ws}/ws/price`;

export class ApiError extends Error {
  constructor(
    readonly path: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(`${path} → HTTP ${status} ${body.slice(0, 120)}`);
  }
}

export async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${REST}${path}`, { signal, headers: { accept: 'application/json' } });
  if (!res.ok) throw new ApiError(path, res.status, await res.text());
  return (await res.json()) as T;
}

/**
 * Strike caches /depth for 5 seconds and says so in `X-Cache`. A cached snapshot is
 * older than the deltas already buffered from the socket, and anchoring to it drops
 * every update in between, which shows up as a crossed book. So: take snapshots only
 * when the header says MISS.
 */
export async function fetchDepthSnapshot<T>(path: string, tries = 14, gapMs = 260): Promise<T> {
  for (let i = 0; i < tries; i += 1) {
    const res = await fetch(`${REST}${path}`, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new ApiError(path, res.status, await res.text());
    const cache = (res.headers.get('x-cache') ?? '').toUpperCase();
    const body = (await res.json()) as T;
    if (cache !== 'HIT' || i === tries - 1) return body;
    await new Promise((r) => setTimeout(r, gapMs));
  }
  throw new ApiError(path, 0, 'no fresh snapshot');
}
