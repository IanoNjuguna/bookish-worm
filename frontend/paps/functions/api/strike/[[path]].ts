import { depsFor, route, upstreamPath } from '../../../src/server/pages';
import { proxyStrike } from '../../../src/server/proxy';
import { readSessionToken } from '../../../src/server/session';

/**
 * `/api/strike/positions?symbol=ADA-USD` → `https://api.strikefinance.org/v2/positions?symbol=ADA-USD`,
 * signed with the held key. Our own URLs drop the venue's `/v2` prefix so it cannot be
 * doubled into `/v2/v2/...`.
 *
 * The query string is part of what gets signed, so it is forwarded exactly as received
 * rather than rebuilt from params.
 */
export const onRequest = route(async (ctx) => {
  const deps = depsFor(ctx.env);
  const rest = ctx.params.path;
  const segments = Array.isArray(rest) ? rest : [rest ?? ''];
  const url = new URL(ctx.request.url);
  const method = ctx.request.method.toUpperCase();
  const body = method === 'GET' || method === 'HEAD' ? undefined : await ctx.request.text();

  const result = await proxyStrike(
    { store: deps.store, master: deps.master, strike: deps.strike },
    {
      sessionToken: readSessionToken(ctx.request),
      method,
      path: upstreamPath(segments, url.search),
      body,
    },
  );

  return new Response(result.body, {
    status: result.status,
    headers: { 'content-type': result.contentType, 'cache-control': 'no-store' },
  });
});
