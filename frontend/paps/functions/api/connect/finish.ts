import { finishConnect } from '../../../src/server/connect';
import { clientIp, depsFor, json, readJson, route } from '../../../src/server/pages';
import { sessionCookie } from '../../../src/server/session';

/**
 * Step two: exchange the wallet signature for an account.
 *
 * The session token goes into an HttpOnly cookie, so the browser can call the proxy but
 * cannot read the handle that owns the sealed key.
 */
export const onRequestPost = route(async (ctx) => {
  const deps = depsFor(ctx.env);
  const body = await readJson<{ token?: string; signature?: string }>(ctx.request);
  if (!body.token || !body.signature) return json(400, { error: 'token_and_signature_required' });

  const account = await finishConnect(deps, {
    token: body.token,
    walletSignature: body.signature,
    ip: clientIp(ctx.request),
  });
  return json(
    200,
    {
      accountId: account.accountId,
      apiWalletId: account.apiWalletId,
      publicKeyHex: account.publicKeyHex,
      feeShareBps: account.feeShareBps,
      expiresAt: account.expiresAt,
      custody: 'paps',
    },
    { 'set-cookie': sessionCookie(account.sessionToken) },
  );
});
