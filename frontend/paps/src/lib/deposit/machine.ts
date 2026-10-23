/**
 * The deposit as a state machine, because the order of the four calls is the whole risk.
 *
 *     quote → build → sign → submit → confirm
 *
 * Every rule a screen could otherwise get wrong lives here, as a pure function, so the tests
 * can drive it without a browser and without a venue:
 *
 * - Nothing is signed that did not come from a quote. `canSign` needs `quote !== null`.
 * - An expired quote is a re-quote, not a signature. The countdown is advisory: the venue has
 *   the final say and answers `quote_expired` itself.
 * - Once a transaction hash exists, `canSign` is false forever. The only action left is sending
 *   that same hash again, because a second signature after a submit is how one deposit becomes
 *   two transactions.
 * - A failure that invalidates the quote (`quote_expired`, `account_mismatch`, `reconnect`, a
 *   refused amount) drops it, so the screen cannot offer to sign something the venue will not
 *   accept. Every other failure keeps it, so a locked wallet is a retry rather than a restart.
 */

import type { DepositQuote, DepositStep } from './types';
import { DepositError } from './types';

export type DepositStage =
  | 'idle'
  | 'quoting'
  | 'quoted'
  | 'building'
  | 'signing'
  | 'submitting'
  | 'confirming'
  | 'pending'
  | 'error';

/** The stages that mean "a call or a wallet prompt is open right now". */
export type WorkingStage = 'building' | 'signing' | 'submitting' | 'confirming';

const WORKING: readonly DepositStage[] = ['building', 'signing', 'submitting', 'confirming'];

export type FailureKind =
  /* the venue's, by name */
  | 'reconnect'
  | 'account_mismatch'
  | 'already_submitted'
  | 'quote_expired'
  | 'utxos_required'
  | 'utxos_invalid'
  | 'invalid_amount'
  | 'amount_precision'
  | 'amount_rejected'
  | 'rate_limited'
  /* the wallet's, before any http call */
  | 'utxos_locked'
  | 'wallet_unsupported'
  | 'wallet_missing'
  | 'wallet_refused'
  /* a submit the wallet did not confirm it made */
  | 'submit_unreported'
  /* a hash we hold and the venue does not */
  | 'confirm_unreported'
  /* anything else the venue answered */
  | 'venue';

export type DepositFailure = {
  kind: FailureKind;
  /** Which of the three calls was open when it failed. Decides what the retry is. */
  at: DepositStep;
  /** The venue's or the wallet's words, verbatim. Empty when there were none. */
  detail: string;
};

export type DepositState = {
  stage: DepositStage;
  /** Strike's quote. The source of the deposit address and the request id, never re-derived. */
  quote: DepositQuote | null;
  /** Set once the wallet has submitted. Its existence forbids a second signature. */
  txHash: string | null;
  failure: DepositFailure | null;
};

export const IDLE_DEPOSIT: DepositState = {
  stage: 'idle',
  quote: null,
  txHash: null,
  failure: null,
};

/**
 * A quote that has died at the venue cannot be signed, and one that belongs to another account
 * cannot either. Dropping it is what turns those answers into "start again" instead of a retry
 * that fails the same way.
 *
 * A quote is never dropped once a hash exists, whatever the failure: at that point it is no
 * longer an offer, it is the receipt's `requestId`, and re-sending the hash needs it. Nothing can
 * be signed from it anyway, because every gate that leads to a signature requires no hash.
 */
const DROPS_QUOTE: ReadonlySet<FailureKind> = new Set<FailureKind>([
  'quote_expired',
  'account_mismatch',
  'reconnect',
  'amount_rejected',
  'invalid_amount',
  'amount_precision',
]);

const isWorking = (stage: DepositStage): stage is WorkingStage => WORKING.includes(stage);

export const busy = (state: DepositState): boolean =>
  state.stage === 'quoting' || isWorking(state.stage);

/* ── transitions ───────────────────────────────────────────────────────────── */

export const quoting = (): DepositState => ({ ...IDLE_DEPOSIT, stage: 'quoting' });

export const quoted = (quote: DepositQuote): DepositState => ({
  stage: 'quoted',
  quote,
  txHash: null,
  failure: null,
});

/** build, sign and submit all keep the quote and clear the last failure as they begin. */
export const working = (state: DepositState, stage: WorkingStage): DepositState => ({
  ...state,
  stage,
  failure: null,
});

/** The hash is the receipt. Worth keeping even when the confirm call afterwards fails. */
export const confirmed = (state: DepositState, txHash: string): DepositState => ({
  stage: 'pending',
  quote: state.quote,
  txHash,
  failure: null,
});

export const failed = (state: DepositState, failure: DepositFailure): DepositState => ({
  stage: 'error',
  quote: state.txHash !== null || !DROPS_QUOTE.has(failure.kind) ? state.quote : null,
  txHash: state.txHash,
  failure,
});

export const reset = (): DepositState => IDLE_DEPOSIT;

/* ── what the screen may offer ─────────────────────────────────────────────── */

/** Unix ms when the quote dies, or null when the venue did not say. 0 means unknown. */
export const quoteExpiresAt = (quote: DepositQuote | null): number | null =>
  quote && quote.expiresAt > 0 ? quote.expiresAt : null;

/** Milliseconds left on the quote, or null when there is no stated expiry. */
export function quoteRemaining(quote: DepositQuote | null, now: number): number | null {
  const endsAt = quoteExpiresAt(quote);
  return endsAt === null ? null : Math.max(0, endsAt - now);
}

export const quoteExpired = (quote: DepositQuote | null, now: number): boolean => {
  const left = quoteRemaining(quote, now);
  return left === 0;
};

/** A new quote is allowed whenever nothing is in flight and nothing has been submitted. */
export const canQuote = (state: DepositState): boolean =>
  !busy(state) && state.txHash === null;

/**
 * Signing needs a live quote, no hash yet, and nothing else in flight. The expiry check is
 * here so a dead quote shows a re-quote instead of failing at build, where it would read as
 * a failure rather than an answer.
 */
export const canSign = (state: DepositState, now: number): boolean =>
  state.quote !== null && state.txHash === null && !busy(state) && !quoteExpired(state.quote, now);

/**
 * The one retry that is safe after a hash exists: send the same hash to the venue again.
 * Never a second signature, and never a second build.
 */
export const canRetryConfirm = (state: DepositState): boolean =>
  state.txHash !== null && state.stage === 'error' && state.failure?.at === 'confirm';

/** True while a signed transaction may or may not exist: no new deposit from here. */
export const holdsHash = (state: DepositState): boolean => state.txHash !== null;

/* ── errors into states ────────────────────────────────────────────────────── */

/**
 * The server's error names, which are the full list in `src/server/deposit.ts`, plus the
 * handler's own `no_session` and the Worker's 429. Named, not guessed from the status: a 400
 * is four different things and only one of them is an expiry.
 */
export function failureFromCode(
  status: number,
  code: string,
  detail: string,
  at: DepositStep,
): DepositFailure {
  const kind: FailureKind =
    status === 401 || code === 'reconnect' || code === 'no_session'
      ? 'reconnect'
      : status === 403 || code === 'account_mismatch'
        ? 'account_mismatch'
        : status === 409 || code === 'already_submitted'
          ? 'already_submitted'
          : status === 429
            ? 'rate_limited'
            : code === 'quote_expired'
              ? 'quote_expired'
              : code === 'utxos_required'
                ? 'utxos_required'
                : code === 'utxos_invalid'
                  ? 'utxos_invalid'
                  : code === 'amount_precision'
                    ? 'amount_precision'
                    : code === 'amount_rejected'
                      ? 'amount_rejected'
                      : code === 'invalid_amount'
                        ? 'invalid_amount'
                        : 'venue';

  return { kind, at, detail };
}

/**
 * Anything thrown by the three calls, as a state.
 *
 * A reject from `submitTx` is not a `DepositError`, so it lands on the ones below: a thrown
 * wallet call at submit means the transaction may exist and the wallet did not say, and a
 * thrown fetch after a hash exists means the venue does not have it yet. Both are receipts to
 * read, not crashes.
 */
export function failureFromError(error: unknown, at: DepositStep): DepositFailure {
  if (error instanceof DepositError) {
    return failureFromCode(error.status, error.code, error.detail, error.step);
  }
  const detail = error instanceof Error ? error.message : '';
  if (at === 'confirm') return { kind: 'confirm_unreported', at, detail };
  return { kind: 'venue', at, detail };
}
