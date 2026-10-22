import type { ConnectDeps } from './connect';
import { masterKey } from './crypto';
import { d1RateLimitStore, d1Store } from './keystore';
import { limitsFrom } from './rateLimit';
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

/**
 * Who to count a request against.
 *
 * Cloudflare sets `CF-Connecting-IP` on every request that reaches a Pages Function, and a
 * client cannot remove it. The fallback exists for `wrangler pages dev` and for tests;
 * callers that get nothing are counted together, which errs towards stricter rather than
 * towards a limit that silently does not apply.
 */
export function clientIp(request: Request): string {
  const direct = request.headers.get('cf-connecting-ip')?.trim();
  if (direct) return direct;
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || 'unknown';
}

export function depsFor(env: ServerEnv): ConnectDeps {
  if (!env.DB) throw new HttpError(500, 'not_configured', 'D1 binding DB is missing');
  return {
    store: d1Store(env.DB),
    limiter: d1RateLimitStore(env.DB),
    limits: limitsFrom(env),
    master: masterKey(env.MASTER_KEY),
    strike: { origin: originFor(env.STRIKE_ENV) },
    builderCode: env.BUILDER_CODE ?? 'paps',
    feeShareBps: Number(env.FEE_SHARE_BPS ?? 0),
  };
}

/**
 * One error funnel. A handler may throw; only `HttpError` reaches the client, because an
 * arbitrary exception can carry a request body, a header or a stack that names a key.
 *
 * A 429 also carries `retry-after` and the same number in the body, so the client can show
 * a stated cooldown instead of guessing and backing off into a loop.
 */
export const route =
  (fn: (ctx: PagesContext) => Promise<Response>) =>
  async (ctx: PagesContext): Promise<Response> => {
    try {
      return await fn(ctx);
    } catch (e) {
      if (e instanceof HttpError) {
        const wait = e.retryAfterSeconds;
        return json(
          e.status,
          {
            error: e.code,
            message: e.message,
            ...(wait === undefined ? {} : { retryAfterSeconds: wait }),
          },
          wait === undefined ? {} : { 'retry-after': String(wait) },
        );
      }
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
