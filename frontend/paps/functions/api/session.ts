import { forgetSession, sessionInfo } from '../../src/server/connect';
import { depsFor, json, route } from '../../src/server/pages';
import { clearedSessionCookie, readSessionToken } from '../../src/server/session';

/** Who the cookie belongs to, and when it expires. Never a key, never a public key of the wallet. */
export const onRequestGet = route(async (ctx) => {
  const deps = depsFor(ctx.env);
  const info = await sessionInfo(deps, readSessionToken(ctx.request));
  if (!info) return json(401, { error: 'no_session' });
  return json(200, { ...info, custody: 'paps' });
});

/** Forget the session: the sealed record goes, the cookie goes. Strike still holds the wallet. */
export const onRequestDelete = route(async (ctx) => {
  const deps = depsFor(ctx.env);
  await forgetSession(deps, readSessionToken(ctx.request));
  return json(200, { ok: true }, { 'set-cookie': clearedSessionCookie() });
});
