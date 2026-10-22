import { depsFor, route } from '../../../src/server/pages';
import { proxyStrike } from '../../../src/server/proxy';
import { readSessionToken } from '../../../src/server/session';

/**
 * `/api/strike/v2/...` → `https://api.strikefinance.org/v2/...`, signed with the held key.
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
      path: `/v2/${segments.join('/')}${url.search}`,
      body,
    },
  );

  return new Response(result.body, {
    status: result.status,
    headers: { 'content-type': result.contentType, 'cache-control': 'no-store' },
  });
});
