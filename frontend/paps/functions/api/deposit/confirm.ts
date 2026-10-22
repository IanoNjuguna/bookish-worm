import { confirmDeposit } from '../../../src/server/deposit';
import { depsFor, json, readJson, route } from '../../../src/server/pages';
import { readSessionToken } from '../../../src/server/session';
import { HttpError } from '../../../src/server/types';

/**
 * The signed transaction has been submitted; Strike should look for it.
 *
 * Strike answers `pending` no matter what, so this is not where a deposit becomes money.
 * The credit is the balance moving, and a client that wants proof polls the account and the
 * transaction history rather than trusting this response.
 */
export const onRequestPost = route(async (ctx) => {
  const sessionToken = readSessionToken(ctx.request);
  if (!sessionToken) throw new HttpError(401, 'no_session');

  const body = await readJson<{ requestId?: unknown; txHash?: unknown }>(ctx.request);
  if (typeof body.requestId !== 'string') throw new HttpError(400, 'request_id_required');
  if (typeof body.txHash !== 'string') throw new HttpError(400, 'tx_hash_required');

  const confirmed = await confirmDeposit(depsFor(ctx.env), {
    sessionToken,
    requestId: body.requestId,
    txHash: body.txHash,
  });

  return json(200, confirmed);
});
