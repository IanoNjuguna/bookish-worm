import type { ConnectDeps } from './connect';
import { masterKey } from './crypto';
import { d1Store } from './keystore';
import { originFor } from './strike';
import { HttpError, type ServerEnv } from './types';

/**
 * Glue between Cloudflare Pages Functions and the testable server layer.
 *
 * Nothing in `src/server` imports a Workers global, so every handler can be driven from a
 * unit test with a Request, a store and a fake fetch. These helpers are the only place
 * that knows about `context`.
 */

export type PagesContext<E = ServerEnv> = {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
};

export const json = (
  status: number,
  body: unknown,
  extra: Record<string, string> = {},
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra },
  });

export function depsFor(env: ServerEnv): ConnectDeps {
  if (!env.DB) throw new HttpError(500, 'not_configured', 'D1 binding DB is missing');
  return {
    store: d1Store(env.DB),
    master: masterKey(env.MASTER_KEY),
    strike: { origin: originFor(env.STRIKE_ENV) },
    builderCode: env.BUILDER_CODE ?? 'paps',
    feeShareBps: Number(env.FEE_SHARE_BPS ?? 0),
  };
}

/**
 * One error funnel. A handler may throw; only `HttpError` reaches the client, because an
 * arbitrary exception can carry a request body, a header or a stack that names a key.
 */
export const route =
  (fn: (ctx: PagesContext) => Promise<Response>) =>
  async (ctx: PagesContext): Promise<Response> => {
    try {
      return await fn(ctx);
    } catch (e) {
      if (e instanceof HttpError) return json(e.status, { error: e.code, message: e.message });
      console.error('paps server error', e);
      return json(500, { error: 'server_error' });
    }
  };

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new HttpError(400, 'invalid_json');
  }
}

/**
 * Public proxy URL → venue path.
 *
 * The client calls `/api/strike/positions?symbol=ADA-USD`, i.e. without the venue's `/v2`
 * prefix, because every route this proxy serves is under `/v2` and repeating it in our own
 * URLs is a footgun: `/api/strike/v2/positions` would forward as `/v2/v2/positions`, which
 * the allowlist then refuses with a 403 that looks like an auth problem.
 */
export const upstreamPath = (segments: string[], search: string): string =>
  `/v2/${segments.filter(Boolean).join('/')}${search}`;
