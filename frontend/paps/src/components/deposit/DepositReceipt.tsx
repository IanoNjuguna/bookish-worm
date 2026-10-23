import { PENDING_NOTE } from './DepositSheet.constants';
import { DepositRow } from './DepositRow';
import type { ReceiptProps } from './DepositSheet.types';

/**
 * The end of the flow: a hash, and the truth about what it means.
 *
 * `confirm` answers `pending` whatever happens, so this cannot say "credited". The balance moves
 * when the transfer settles, which is an observation on the venue's side, so the receipt says
 * pending and keeps the hash where it can be read back.
 */
export function DepositReceipt({ txHash, confirmations }: ReceiptProps) {
  return (
    <section className="rounded-card border border-line bg-panel-2/60 px-3 py-2" aria-label="deposit submitted">
      <div className="flex items-center justify-between pb-1">
        <span className="label">submitted · pending</span>
        <span className="num text-micro text-muted">
          {confirmations > 0 ? `needs ${confirmations} confirmations` : 'waiting on strike'}
        </span>
      </div>

      <dl>
        <DepositRow label="transaction" value={txHash} wrap />
      </dl>

      <p className="border-t border-line pt-1.5 text-micro leading-snug text-muted">{PENDING_NOTE}</p>
    </section>
  );
}
