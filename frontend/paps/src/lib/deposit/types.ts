/**
 * What the deposit endpoints answer, as types the screen consumes.
 *
 * These are the server's own types, imported type-only: the request and response shapes are
 * already written down and tested in `src/server/deposit.ts`, and a second copy here is a copy
 * that drifts. `import type` is erased at build time, so nothing from `src/server` (or the key
 * handling under it) reaches the bundle.
 */

import type {
  BuiltDeposit,
  DepositConfirmation,
  DepositQuote,
} from '../../server/deposit';

export type { BuiltDeposit, DepositConfirmation, DepositQuote };

/** The three calls, in the order they have to happen. */
export type DepositStep = 'quote' | 'build' | 'confirm';

/**
 * A refusal from one of the three endpoints, or from the Worker in front of them.
 *
 * `code` is the server's error name (`quote_expired`, `account_mismatch`, …) whenever it sent
 * one, because those are what a screen answers rather than crashes on.
 */
export class DepositError extends Error {
  constructor(
    readonly step: DepositStep,
    readonly status: number,
    readonly code: string,
    /** The venue's or the Worker's words, verbatim. Empty when it said nothing usable. */
    readonly detail = '',
  ) {
    super(detail || `deposit ${step} failed (${status} ${code})`);
    this.name = 'DepositError';
  }
}
