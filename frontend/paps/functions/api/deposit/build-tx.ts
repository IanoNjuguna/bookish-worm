import { buildDepositTx } from '../../../src/server/deposit';
import { depsFor, json, readJson, route } from '../../../src/server/pages';
import { readSessionToken } from '../../../src/server/session';
import { HttpError } from '../../../src/server/types';

/**
 * The unsigned transaction, for the user's wallet to partial-sign.
 *
 * Nothing here signs: the CBOR goes to the browser exactly as Strike built it, and the
 * destination inside it is Strike's, so paps cannot redirect the coins. The UTxOs are the
 * wallet's own, hex as CIP-30 reported them.
 */
export const onRequestPost = route(async (ctx) => {
  const sessionToken = readSessionToken(ctx.request);
  if (!sessionToken) throw new HttpError(401, 'no_session');

  const body = await readJson<{
    requestId?: unknown;
    userAddress?: unknown;
    utxos?: unknown;
    quoteExpiresAt?: unknown;
  }>(ctx.request);

  if (typeof body.requestId !== 'string') throw new HttpError(400, 'request_id_required');
  if (typeof body.userAddress !== 'string') throw new HttpError(400, 'user_address_required');
  if (!Array.isArray(body.utxos) || body.utxos.some((utxo) => typeof utxo !== 'string')) {
    throw new HttpError(400, 'utxos_required');
  }

  const built = await buildDepositTx(depsFor(ctx.env), {
    sessionToken,
    requestId: body.requestId,
    userAddress: body.userAddress,
    utxos: body.utxos.filter((utxo): utxo is string => typeof utxo === 'string'),
    quoteExpiresAt: typeof body.quoteExpiresAt === 'number' ? body.quoteExpiresAt : 0,
  });

  return json(200, built);
});
