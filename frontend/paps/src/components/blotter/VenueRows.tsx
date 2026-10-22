import { cn } from '../../lib/cn';
import { clock, price, qty, signedUsd } from '../../lib/format';
import type { VenueFundingRow, VenueOrder, VenueTransactionRow } from '../../lib/strike/venue';

/**
 * Working orders and history on a phone: one row each, the four facts that decide
 * anything, no table. The wide-screen versions live in VenueTables.
 */

export function VenueOrderRows({ orders }: { orders: VenueOrder[] }) {
  if (!orders.length) {
    return <p className="px-4 py-8 text-center text-small text-muted">No working orders on this account.</p>;
  }

  return (
    <ul className="divide-y divide-line/60">
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
          <span className="num shrink-0 text-small text-muted">{o.status}</span>
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
