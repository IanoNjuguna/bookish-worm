import { describe, expect, it } from 'vitest';
import { failureCopy } from './copy';
import {
  IDLE_DEPOSIT,
  busy,
  canQuote,
  canRetryConfirm,
  canSign,
  confirmed,
  failed,
  failureFromCode,
  failureFromError,
  quoted,
  quoteExpired,
  quoteRemaining,
  quoting,
  reset,
  working,
  type DepositFailure,
  type FailureKind,
} from './machine';
import type { DepositQuote } from './types';
import { DepositError } from './types';

const NOW = 1_700_000_000_000;

const quote = (patch: Partial<DepositQuote> = {}): DepositQuote => ({
  requestId: 'req-1',
  depositAddress: 'addr1_vault_strike',
  lovelace: '12500000',
  usdValue: 12.34,
  exchangeRate: '0.4123',
  confirmationsRequired: 15,
  expiresAt: NOW + 600_000,
  signature: 'quote-signature',
  ...patch,
});

const HASH = 'ab'.repeat(32);

describe('the deposit step machine', () => {
  it('starts idle with nothing to sign and nothing to sign with', () => {
    expect(IDLE_DEPOSIT.stage).toBe('idle');
    expect(canSign(IDLE_DEPOSIT, NOW)).toBe(false);
    expect(canQuote(IDLE_DEPOSIT)).toBe(true);
    expect(busy(IDLE_DEPOSIT)).toBe(false);
  });

  it('refuses a second quote while one is in flight', () => {
    expect(canQuote(quoting())).toBe(false);
    expect(busy(quoting())).toBe(true);
    expect(canQuote(quoted(quote()))).toBe(true);
  });

  it('lets the quote be signed, and never before it exists', () => {
    expect(canSign(quoted(quote()), NOW)).toBe(true);
    expect(canSign(working(quoted(quote()), 'building'), NOW)).toBe(false);
  });

  it('reads an expired quote as a re-quote, not a signature', () => {
    const dead = quoted(quote({ expiresAt: NOW - 1 }));

    expect(quoteExpired(dead.quote, NOW)).toBe(true);
    expect(quoteRemaining(dead.quote, NOW)).toBe(0);
    expect(canSign(dead, NOW)).toBe(false);
    // Still a quote in hand, so the screen offers a fresh one rather than a new amount.
    expect(canQuote(dead)).toBe(true);
  });

  it('treats a quote with no stated expiry as usable, because the venue has the final say', () => {
    const open = quoted(quote({ expiresAt: 0 }));
    expect(quoteRemaining(open.quote, NOW)).toBeNull();
    expect(quoteExpired(open.quote, NOW)).toBe(false);
    expect(canSign(open, NOW)).toBe(true);
  });

  it('counts the quote down', () => {
    const live = quoted(quote({ expiresAt: NOW + 4_500 }));
    expect(quoteRemaining(live.quote, NOW)).toBe(4_500);
    expect(quoteRemaining(live.quote, NOW + 4_000)).toBe(500);
  });

  it('drops the quote when the venue says it died, so the only action is a fresh one', () => {
    const state = failed(quoted(quote()), failureFromCode(400, 'quote_expired', 'expired', 'build'));

    expect(state.stage).toBe('error');
    expect(state.quote).toBeNull();
    expect(canSign(state, NOW)).toBe(false);
    expect(canQuote(state)).toBe(true);
    expect(failureCopy(state.failure!).body).toContain('nothing was signed');
  });

  it('drops the quote on a 403 and points at a new session', () => {
    const state = failed(quoted(quote()), failureFromCode(403, 'account_mismatch', '', 'build'));

    expect(state.failure?.kind).toBe('account_mismatch');
    expect(state.quote).toBeNull();
    const copy = failureCopy(state.failure!);
    expect(copy.body).toContain('reconnect the session');
    expect(copy.title).toContain('not the address you signed in with');
  });

  it('keeps the quote when the wallet is locked, so the retry is a signature', () => {
    const state = failed(quoted(quote()), { kind: 'utxos_locked', at: 'build', detail: '' });

    expect(state.quote).not.toBeNull();
    expect(canSign(state, NOW)).toBe(true);
    expect(canQuote(state)).toBe(true);
    expect(failureCopy(state.failure!).body).toContain('unlock');
  });

  it('keeps the hash when the confirm call fails, and forbids a second signature', () => {
    const sent = working(confirmed(quoted(quote()), HASH), 'confirming');
    const unrecorded = failed(sent, failureFromError(new TypeError('network down'), 'confirm'));

    expect(unrecorded.stage).toBe('error');
    expect(unrecorded.txHash).toBe(HASH);
    expect(unrecorded.failure?.kind).toBe('confirm_unreported');
    expect(unrecorded.failure?.at).toBe('confirm');

    // The two things that must not be offered from here: signing again, and a new deposit.
    expect(canSign(unrecorded, NOW)).toBe(false);
    expect(canQuote(unrecorded)).toBe(false);
    expect(canRetryConfirm(unrecorded)).toBe(true);
  });

  it('holds the hash through a reconnect too, so the transfer is never lost', () => {
    const sent = confirmed(quoted(quote()), HASH);
    const expiredSession = failed(sent, failureFromCode(401, 'reconnect', '', 'confirm'));

    expect(expiredSession.txHash).toBe(HASH);
    // The quote survives as the receipt's requestId: re-sending the hash is impossible without it.
    expect(expiredSession.quote?.requestId).toBe('req-1');
    expect(canSign(expiredSession, NOW)).toBe(false);
    expect(canRetryConfirm(expiredSession)).toBe(true);
  });

  it('stops offering the hash again once the venue has it', () => {
    const retried = confirmed(
      { ...working(IDLE_DEPOSIT, 'confirming'), quote: quote(), txHash: HASH },
      HASH,
    );
    expect(retried.stage).toBe('pending');
    expect(retried.failure).toBeNull();
    expect(canRetryConfirm(retried)).toBe(false);
    expect(canSign(retried, NOW)).toBe(false);
    expect(canQuote(retried)).toBe(false);
  });

  it('clears everything on an explicit reset, which is the only way to deposit twice', () => {
    const done = confirmed(quoted(quote()), HASH);
    expect(reset()).toEqual(IDLE_DEPOSIT);
    expect(canQuote(done)).toBe(false);
    expect(canQuote(reset())).toBe(true);
  });
});

describe('the venue error codes, by name', () => {
  const cases: Array<[number, string, FailureKind]> = [
    [401, 'reconnect', 'reconnect'],
    [401, 'no_session', 'reconnect'],
    [403, 'account_mismatch', 'account_mismatch'],
    [409, 'already_submitted', 'already_submitted'],
    [400, 'quote_expired', 'quote_expired'],
    [400, 'utxos_required', 'utxos_required'],
    [400, 'utxos_invalid', 'utxos_invalid'],
    [400, 'invalid_amount', 'invalid_amount'],
    [400, 'amount_precision', 'amount_precision'],
    [400, 'amount_rejected', 'amount_rejected'],
    [429, 'rate_limited', 'rate_limited'],
    [502, 'deposit_failed', 'venue'],
    [502, 'deposit_malformed', 'venue'],
    [500, 'server_error', 'venue'],
  ];

  it('maps each one to its own kind, not to a generic failure', () => {
    for (const [status, code, kind] of cases) {
      expect(failureFromCode(status, code, 'detail', 'quote').kind).toBe(kind);
    }
  });

  it('refuses to guess: a code it does not know is a venue failure with the detail kept', () => {
    // The server names a refused amount itself (`amount_rejected` is what a 400 at quote becomes),
    // so an unfamiliar code here is genuinely a venue failure rather than a misread refusal.
    const failure = failureFromCode(400, 'anything', 'minimum deposit is 2000000 lovelace', 'quote');
    expect(failure.kind).toBe('venue');
    expect(failure.detail).toBe('minimum deposit is 2000000 lovelace');
  });

  it('reads a DepositError by the step it came from', () => {
    const failure = failureFromError(
      new DepositError('build', 400, 'utxos_invalid', 'UTxOs must be CIP-30 hex strings'),
      'quote',
    );
    expect(failure).toEqual({
      kind: 'utxos_invalid',
      at: 'build',
      detail: 'UTxOs must be CIP-30 hex strings',
    });
  });

  it('keeps an unreadable build failure as a venue failure with its message', () => {
    const failure = failureFromError(new Error('the venue did not answer'), 'build');
    expect(failure.kind).toBe('venue');
    expect(failure.detail).toBe('the venue did not answer');
  });
});

describe('the words for each failure', () => {
  const kinds: FailureKind[] = [
    'reconnect',
    'account_mismatch',
    'already_submitted',
    'quote_expired',
    'utxos_required',
    'utxos_invalid',
    'invalid_amount',
    'amount_precision',
    'amount_rejected',
    'rate_limited',
    'utxos_locked',
    'wallet_unsupported',
    'wallet_missing',
    'wallet_refused',
    'submit_unreported',
    'confirm_unreported',
    'venue',
  ];

  it('has a title and a body for every kind, and no shouting', () => {
    for (const kind of kinds) {
      const copy = failureCopy({ kind, at: 'quote', detail: '' } as DepositFailure);
      expect(copy.title.length).toBeGreaterThan(0);
      expect(copy.body.length).toBeGreaterThan(0);
      // House style: no exclamation marks, and no em dashes in copy we write.
      expect(`${copy.title}${copy.body}`).not.toMatch(/[!—]/);
    }
  });

  it('tells the truth about what was sent in the two cases that differ', () => {
    expect(failureCopy({ kind: 'utxos_locked', at: 'build', detail: '' }).body).toContain(
      'nothing was built',
    );
    expect(failureCopy({ kind: 'confirm_unreported', at: 'confirm', detail: '' }).body).toContain(
      'is on its way',
    );
  });
});
