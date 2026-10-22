import { cn } from '../../lib/cn';
import { clock, price, qty, signedUsd } from '../../lib/format';
import type { PendingOrder, VenueFill } from '../../lib/strike/orders';
import type { VenueFundingRow, VenueOrder, VenueTransactionRow } from '../../lib/strike/venue';

/**
 * Working orders, fills and history on a phone: one row each, the facts that decide
 * anything, no table. The wide-screen versions live in VenueTables and VenueFills.
 */

export function VenueOrderRows({
  orders,
  pending = [],
  onCancel,
}: {
  orders: VenueOrder[];
  /** Accepted by the venue, not yet covered by a read: "accepted · seq N", never "filled". */
  pending?: PendingOrder[];
  onCancel?: (order: VenueOrder) => void;
}) {
  if (!orders.length && !pending.length) {
    return <p className="px-4 py-8 text-center text-small text-muted">No working orders on this account.</p>;
  }

  return (
    <ul className="divide-y divide-line/60">
      {pending.map((p) => (
        <li key={p.clientOrderId} className="flex items-baseline justify-between gap-2 px-4 py-2.5">
          <div className="min-w-0">
            <p className="flex items-baseline gap-1.5 text-body text-fg">
              <span className="truncate">{p.symbol}</span>
              <span className={cn('text-micro', p.side === 'LONG' ? 'text-long' : 'text-short')}>
                {p.side}
              </span>
            </p>
            <p className="num text-micro text-muted">
              {p.type} · {qty(p.size)} @ {Number(p.price) ? price(p.price) : 'market'}
            </p>
          </div>
          <span className="num shrink-0 text-small text-muted">accepted · seq {p.sequenceId}</span>
        </li>
      ))}
      {orders.map((o) => (
        <li key={o.id} className="flex items-baseline justify-between gap-2 px-4 py-2.5">
          <div className="min-w-0">
            <p className="flex items-baseline gap-1.5 text-body text-fg">
              <span className="truncate">{o.symbol}</span>
              <span className={cn('text-micro', o.side === 'LONG' ? 'text-long' : 'text-short')}>
                {o.side}
              </span>
              {o.reduceOnly && <span className="text-micro text-muted">reduce</span>}
            </p>
            <p className="num text-micro text-muted">
              {o.type} · {qty(o.size)} @ {Number(o.price) ? price(o.price) : 'market'} ·{' '}
              {o.createdAt ? clock(o.createdAt) : '—'}
            </p>
          </div>
          {onCancel ? (
            <button
              onClick={() => onCancel(o)}
              className="shrink-0 rounded-chip border border-line px-2.5 py-1 text-micro text-muted active:text-fg"
            >
              cancel
            </button>
          ) : (
            <span className="num shrink-0 text-small text-muted">{o.status}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function VenueFillRows({ fills }: { fills: VenueFill[] }) {
  if (!fills.length) {
    return <p className="px-4 py-8 text-center text-small text-muted">No fills on this account yet.</p>;
  }

  return (
    <ul className="divide-y divide-line/60">
      {fills.map((f) => (
        <li key={`${f.id}-${f.orderId}`} className="flex items-baseline justify-between gap-2 px-4 py-2.5">
          <div className="min-w-0">
            <p className="flex items-baseline gap-1.5 text-body text-fg">
              <span className="truncate">{f.symbol}</span>
              <span className={cn('text-micro', f.side === 'LONG' ? 'text-long' : 'text-short')}>
                {f.side}
              </span>
              <span className="text-micro text-muted">
                {f.role}
                {f.autoCloseType ? ` · ${f.autoCloseType}` : ''}
              </span>
            </p>
            <p className="num text-micro text-muted">
              {qty(f.size)} @ {price(f.price)} · fee {signedUsd(f.fee)} ·{' '}
              {f.at ? clock(f.at) : '—'}
            </p>
          </div>
          <span className={cn('num shrink-0 text-small', Number(f.realizedPnl) >= 0 ? 'text-long' : 'text-short')}>
            {signedUsd(f.realizedPnl)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function VenueFundingRows({ rows }: { rows: VenueFundingRow[] }) {
  if (!rows.length) {
    return <p className="px-4 py-8 text-center text-small text-muted">No funding payments yet.</p>;
  }

  return (
    <ul className="divide-y divide-line/60">
      {rows.map((r) => (
        <li key={r.id} className="flex items-baseline justify-between gap-2 px-4 py-2.5">
          <div className="min-w-0">
            <p className="flex items-baseline gap-1.5 text-body text-fg">
              <span className="truncate">{r.symbol}</span>
              <span className={cn('text-micro', r.side === 'LONG' ? 'text-long' : 'text-short')}>
                {r.side}
              </span>
            </p>
            <p className="num text-micro text-muted">
              {qty(r.size)} · rate {(Number(r.rate) * 100).toFixed(5)}% · {r.at ? clock(r.at) : '—'}
            </p>
          </div>
          <span className={cn('num shrink-0 text-small', Number(r.amount) >= 0 ? 'text-long' : 'text-short')}>
            {signedUsd(r.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function VenueTransactionRows({ rows }: { rows: VenueTransactionRow[] }) {
  if (!rows.length) {
    return <p className="px-4 py-8 text-center text-small text-muted">No venue transactions yet.</p>;
  }

  return (
    <ul className="divide-y divide-line/60">
      {rows.map((r) => (
        <li key={r.id} className="flex items-baseline justify-between gap-2 px-4 py-2.5">
          <div className="min-w-0">
            <p className="text-body capitalize text-fg">{r.type.replace(/_/g, ' ')}</p>
            <p className="num text-micro text-muted">
              {r.status || '—'} · {r.at ? clock(r.at) : '—'}
            </p>
          </div>
          <span className={cn('num shrink-0 text-small', Number(r.amount) >= 0 ? 'text-long' : 'text-short')}>
            {signedUsd(r.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
