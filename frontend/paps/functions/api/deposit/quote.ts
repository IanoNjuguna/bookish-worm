import { quoteDeposit } from '../../../src/server/deposit';
import { depsFor, json, readJson, route } from '../../../src/server/pages';
import { readSessionToken } from '../../../src/server/session';
import { HttpError } from '../../../src/server/types';

/**
 * What a deposit costs, and where it goes.
 *
 * The lovelace amount is the client's to choose, the quote is Strike's to price, and the
 * key that asks for it never leaves the server. The answer carries the address the coins
 * must reach and an expiry the client counts down to.
 */
export const onRequestPost = route(async (ctx) => {
  // Before the store or the venue is touched: a missing cookie is an answer, not an outage.
  const sessionToken = readSessionToken(ctx.request);
  if (!sessionToken) throw new HttpError(401, 'no_session');

  const body = await readJson<{ lovelace?: unknown }>(ctx.request);
  if (typeof body.lovelace !== 'string') throw new HttpError(400, 'lovelace_required');

  const quote = await quoteDeposit(depsFor(ctx.env), { sessionToken, lovelace: body.lovelace });
  return json(200, quote);
});
