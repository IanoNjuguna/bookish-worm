import { failureCopy } from '../../lib/deposit/copy';
import type { FailureNoteProps } from './DepositSheet.types';

/** Failures that a new strike session fixes. Everything else is answered inside this sheet. */
const RECONNECTS = new Set(['reconnect', 'account_mismatch']);

/**
 * One failure, in the words `copy.ts` wrote for it.
 *
 * The venue's own message is kept underneath when it sent one, because "minimum deposit is
 * 2000000 lovelace" is more use than a summary of it. Nothing here says "something went wrong":
 * each kind names what happened and what to do, which is the only way a refusal is actionable.
 */
export function DepositFailureNote({ failure, txHash, onReconnect }: FailureNoteProps) {
  const copy = failureCopy(failure);
  const canReconnect = RECONNECTS.has(failure.kind);

  return (
    <section role="alert" className="rounded-card border border-short/40 bg-short/10 px-3 py-2">
      <p className="text-body text-fg">{copy.title}</p>
      <p className="mt-0.5 text-small leading-snug text-muted">{copy.body}</p>

      {failure.detail && (
        <p className="mt-1 break-words text-micro leading-snug text-muted">strike said: {failure.detail}</p>
      )}

      {txHash && (
        <p className="mt-1 break-all text-micro leading-snug text-fg/70">hash {txHash}</p>
      )}

      {canReconnect && (
        <button
          type="button"
          onClick={onReconnect}
          className="mt-2 w-full rounded-control border border-line py-2 text-small text-fg hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          reconnect the session
        </button>
      )}
    </section>
  );
}
