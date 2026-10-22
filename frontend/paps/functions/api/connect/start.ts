import { startConnect } from '../../../src/server/connect';
import { clientIp, depsFor, json, readJson, route } from '../../../src/server/pages';

/**
 * Step one of builder connect.
 *
 * The browser sends only its wallet address. The keypair is minted here, the venue
 * challenge is fetched here, and the response carries the message to sign plus an opaque
 * handle. No private key, and not even the venue nonce, leaves the server.
 */
export const onRequestPost = route(async (ctx) => {
  const deps = depsFor(ctx.env);
  const body = await readJson<{ address?: string }>(ctx.request);
  if (!body.address) return json(400, { error: 'address_required' });

  const started = await startConnect(deps, { address: body.address, ip: clientIp(ctx.request) });
  return json(200, {
    token: started.token,
    message_to_sign: started.message_to_sign,
    publicKeyHex: started.publicKeyHex,
    expiresInMs: started.expiresInMs,
  });
});
