import { canRetryConfirm } from '../../lib/deposit/machine';
import { cn } from '../../lib/cn';
import { SIGN_WARNING, WORKING_LABEL } from './DepositSheet.constants';
import type { FooterProps } from './DepositSheet.types';

const PRIMARY = cn(
  'w-full rounded-control bg-accent py-3 text-body font-medium text-canvas transition-opacity',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  'focus-visible:ring-offset-panel disabled:opacity-40',
);

const QUIET = cn(
  'w-full rounded-control border border-line py-3 text-body text-muted transition-colors',
  'hover:text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
);

/**
 * The one action on the screen, and it always says what it does.
 *
 * The order of the checks is the order the flow allows: a submitted deposit offers nothing but
 * its hash again, a dead quote offers a new quote, a live quote offers the signature. Because
 * the branches are mutually exclusive there is never a second way to spend money on screen.
 */
export function DepositFooter({
  state,
  ada,
  expired,
  signable,
  ready,
  working,
  onQuote,
  onSign,
  onRetryConfirm,
  onReset,
}: FooterProps) {
  // `working && …` would be `false`, not null, and `false` renders as nothing at all.
  const inFlight = working ? (WORKING_LABEL[state.stage] ?? null) : null;

  if (state.stage === 'pending') {
    return (
      <button type="button" onClick={onReset} className={QUIET}>
        deposit again
      </button>
    );
  }

  if (canRetryConfirm(state)) {
    return (
      <button type="button" onClick={onRetryConfirm} disabled={working} className={PRIMARY}>
        {inFlight ?? 'send the hash again'}
      </button>
    );
  }

  if (state.quote && expired) {
    return (
      <button type="button" onClick={onQuote} disabled={working} className={PRIMARY}>
        {inFlight ?? 'get a fresh quote'}
      </button>
    );
  }

  if (state.quote) {
    return (
      <>
        <p className="mb-2 text-micro leading-snug text-muted">{SIGN_WARNING}</p>
        <button type="button" onClick={onSign} disabled={!signable || working} className={PRIMARY}>
          {inFlight ?? `sign and send ${ada} ada`}
        </button>
      </>
    );
  }

  return (
    <button type="button" onClick={onQuote} disabled={!ready || working} className={PRIMARY}>
      {inFlight ?? 'get a quote'}
    </button>
  );
}
