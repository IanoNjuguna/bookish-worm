/**
 * The three deposit calls, and nothing else.
 *
 * Every one of them needs the paps session cookie, which is `Path=/api` and HttpOnly, created by
 * the strike builder connect. `credentials: 'same-origin'` is what carries it: without it the
 * Worker answers 401 `no_session` on a correctly signed in browser, which reads as a dead
 * session rather than a missing header.
 *
 * No address, no amount and no cbor is invented here. Each body is exactly what the handler in
 * `functions/api/deposit/` reads, and the quote's `depositAddress` and `unsignedTx` are passed
 * along untouched.
 */

import type { BuiltDeposit, DepositConfirmation, DepositQuote, DepositStep } from './types';
import { DepositError } from './types';

type ErrorPayload = { error?: unknown; message?: unknown };

async function post<T>(
  step: DepositStep,
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = (await res.json().catch(() => ({}))) as ErrorPayload & Record<string, unknown>;
  if (!res.ok) {
    const code = typeof payload.error === 'string' ? payload.error : 'http_error';
    const message = typeof payload.message === 'string' ? payload.message : '';
    throw new DepositError(step, res.status, code, message);
  }
  return payload as T;
}

/** Step one. `lovelace` is a string because that is what the venue is quoted in. */
export const requestQuote = (lovelace: string): Promise<DepositQuote> =>
  post<DepositQuote>('quote', '/api/deposit/quote', { lovelace });

/** Step two. The utxos are the wallet's own, hex as CIP-30 reported them, unfiltered. */
export const requestBuild = (args: {
  requestId: string;
  userAddress: string;
  utxos: string[];
  quoteExpiresAt: number;
}): Promise<BuiltDeposit> =>
  post<BuiltDeposit>('build', '/api/deposit/build-tx', {
    requestId: args.requestId,
    userAddress: args.userAddress,
    utxos: args.utxos,
    quoteExpiresAt: args.quoteExpiresAt,
  });

/** Step three. The transaction exists on chain by now; this only tells the venue its hash. */
export const requestConfirm = (args: {
  requestId: string;
  txHash: string;
}): Promise<DepositConfirmation> =>
  post<DepositConfirmation>('confirm', '/api/deposit/confirm', {
    requestId: args.requestId,
    txHash: args.txHash,
  });
