import { clock, pct, price, qty, signedUsd, usd } from '../lib/format';
import { cn } from '../lib/cn';
import type { PendingOrder, VenueOrder } from '../lib/strike/orders';
import type {
  VenueAccount,
  VenueFundingRow,
  VenuePosition,
  VenueTransactionRow,
} from '../lib/strike/venue';
import type { VenueState } from '../lib/strike/venue-client';
import { Empty, Td, Th } from './Table';

/**
 * The venue's own numbers.
 *
 * Nothing here is computed from the paper ledger: `upnl`, the liquidation price and the
 * accumulated funding are what Strike returned for this account. Marks are read per symbol
 * because a position can be in a market the Blotter is not currently showing.
 */

export function VenuePositions({
  positions,
  marks,
  onClose,
  stepFor,
}: {
  positions: VenuePosition[];
  marks: Record<string, number>;
  /**
   * Close here, on the venue. `fraction` is 1 or 0.5 only: half or all, never a slice the
   * venue would have to guess at. Absent while the session cannot trade.
   */
  onClose?: (position: VenuePosition, fraction: 1 | 0.5) => void;
  /** The market's lot step, so a position too small to halve does not offer a half close. */
  stepFor?: (symbol: string) => number;
}) {
  const cols = ['Market', 'Side', 'Size', 'Entry', 'Mark', 'Liq.', 'uPnL', 'Funding'];
  if (onClose) cols.push('');

  return (
    // Eight columns inside a 520px rail: tight cells so uPnL and Funding stay on screen.
    <table className="w-full text-[11px] [&_td]:px-2 [&_th]:px-2">
      <thead className="sticky top-0 bg-panel text-muted">
        <Th cols={cols} />
      </thead>
      <tbody>
        {positions.map((p) => {
          const mark = marks[p.symbol];
          const upnl = Number(p.upnl);
          const funding = Number(p.funding);
          const step = stepFor?.(p.symbol) ?? 0;
          const halvable = step > 0 && Number(p.absSize) / 2 >= step;
          return (
            <tr key={p.id} className="border-b border-line/50">
              <Td><span className="whitespace-nowrap">{p.symbol}</span></Td>
              <Td>
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-[10px]',
                    p.side === 'LONG' ? 'bg-long/15 text-long' : 'bg-short/15 text-short',
                  )}
                >
                  {p.side}
                </span>
              </Td>
              <Td num>{qty(p.absSize)}</Td>
              <Td num>{price(p.entryPrice)}</Td>
              <Td num>{mark ? price(mark) : '—'}</Td>
              <Td num muted>{p.liquidationPrice ? price(p.liquidationPrice) : '—'}</Td>
              <Td num tone={upnl >= 0 ? 'long' : 'short'}>
                <span className="whitespace-nowrap">{signedUsd(p.upnl)}</span>
              </Td>
              <Td num muted tone={funding === 0 ? undefined : funding > 0 ? 'long' : 'short'}>
                <span className="whitespace-nowrap">{signedUsd(p.funding)}</span>
              </Td>
              {onClose && (
                <Td>
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onClose(p, 0.5)}
                      disabled={!halvable}
                      title={halvable ? 'close half' : 'too small to halve'}
                      className={cn(
                        'border border-line px-1 text-[10px] text-muted hover:text-fg',
                        !halvable && 'opacity-30',
                      )}
                    >
                      ½
                    </button>
                    <button
                      onClick={() => onClose(p, 1)}
                      className="border border-line px-1 text-[10px] hover:text-fg"
                    >
                      close
                    </button>
                  </div>
                </Td>
              )}
            </tr>
          );
        })}
        {!positions.length && <Empty cols={cols.length} text="No open positions on this account." />}
      </tbody>
    </table>
  );
}

export function VenueOrders({
  orders,
  pending = [],
  onCancel,
}: {
  orders: VenueOrder[];
  /** Accepted by the venue, not yet covered by a read: `accepted · seq N`, never "filled". */
  pending?: PendingOrder[];
  onCancel?: (order: VenueOrder) => void;
}) {
  const cols = ['Market', 'Side', 'Type', 'Price', 'Size', 'Filled', 'Time', 'Status'];
  if (onCancel) cols.push('');
  const rows = pending.length + orders.length;

  return (
    <table className="w-full text-[11px]">
      <thead className="sticky top-0 bg-panel text-muted">
        <Th cols={cols} />
      </thead>
      <tbody>
        {pending.map((p) => (
          <tr key={p.clientOrderId} className="border-b border-line/50 bg-panel-2/40">
            <Td><span className="whitespace-nowrap">{p.symbol}</span></Td>
            <Td tone={p.side === 'LONG' ? 'long' : 'short'}>{p.side}</Td>
            <Td muted>{p.type}</Td>
            <Td num>{p.price ? price(p.price) : '—'}</Td>
            <Td num>{qty(p.size)}</Td>
            <Td num muted>—</Td>
            <Td num muted>{clock(p.acceptedAt)}</Td>
            <Td muted>accepted · seq {p.sequenceId}</Td>
            {onCancel ? <Td>{''}</Td> : null}
          </tr>
        ))}
        {orders.map((o) => (
          <tr key={o.id} className="border-b border-line/50">
            <Td><span className="whitespace-nowrap">{o.symbol}</span></Td>
            <Td tone={o.side === 'LONG' ? 'long' : 'short'}>{o.side}</Td>
            <Td muted>
              {o.type}
              {o.reduceOnly ? ' · reduce' : ''}
            </Td>
            <Td num>{Number(o.price) ? price(o.price) : '—'}</Td>
            <Td num>{qty(o.size)}</Td>
            <Td num muted>{qty(o.filled)}</Td>
            <Td num muted>{o.createdAt ? clock(o.createdAt) : '—'}</Td>
            <Td muted>{o.status}</Td>
            {onCancel && (
              <Td>
                <button
                  onClick={() => onCancel(o)}
                  className="whitespace-nowrap border border-line px-1 text-[10px] text-muted hover:text-fg"
                >
                  cancel
                </button>
              </Td>
            )}
          </tr>
        ))}
        {!rows && <Empty cols={cols.length} text="No working orders on this account." />}
      </tbody>
    </table>
  );
}

export function VenueFunding({ rows }: { rows: VenueFundingRow[] }) {
  return (
    <table className="w-full text-[11px]">
      <thead className="sticky top-0 bg-panel text-muted">
        <Th cols={['Time', 'Market', 'Side', 'Size', 'Rate 1h', 'Amount']} />
      </thead>
      <tbody>
        {rows.map((r) => {
          const amount = Number(r.amount);
          const rate = Number(r.rate);
          return (
            <tr key={r.id} className="border-b border-line/50">
              <Td num muted>{r.at ? clock(r.at) : '—'}</Td>
              <Td><span className="whitespace-nowrap">{r.symbol}</span></Td>
              <Td tone={r.side === 'LONG' ? 'long' : 'short'}>{r.side}</Td>
              <Td num muted>{qty(r.size)}</Td>
              {/* Strike settles funding hourly, so the rate is per hour, not annualised here. */}
              <Td num>{Number.isFinite(rate) ? pct(rate * 100, 5) : '—'}</Td>
              <Td num tone={amount >= 0 ? 'long' : 'short'}>{signedUsd(r.amount)}</Td>
            </tr>
          );
        })}
        {!rows.length && <Empty cols={6} text="No funding payments yet." />}
      </tbody>
    </table>
  );
}

export function VenueTransactions({ rows }: { rows: VenueTransactionRow[] }) {
  return (
    <table className="w-full text-[11px]">
      <thead className="sticky top-0 bg-panel text-muted">
        <Th cols={['Time', 'Type', 'Amount', 'Status']} />
      </thead>
      <tbody>
        {rows.map((r) => {
          const amount = Number(r.amount);
          return (
            <tr key={r.id} className="border-b border-line/50">
              <Td num muted>{r.at ? clock(r.at) : '—'}</Td>
              <Td>{r.type.replace(/_/g, ' ')}</Td>
              <Td num tone={amount >= 0 ? 'long' : 'short'}>{signedUsd(r.amount)}</Td>
              <Td muted>{r.status || '—'}</Td>
            </tr>
          );
        })}
        {!rows.length && <Empty cols={4} text="No venue transactions yet." />}
      </tbody>
    </table>
  );
}

export function VenueBalances({ account }: { account: VenueAccount }) {
  const cash = Number(account.unrealizedPnl);
  const rows: { k: string; v: string; tone?: 'long' | 'short' }[] = [
    { k: 'wallet balance', v: `$${usd(account.walletBalance)}` },
    { k: 'available', v: `$${usd(account.availableBalance)}` },
    { k: 'margin balance', v: `$${usd(account.marginBalance)}` },
    { k: 'unrealized pnl', v: signedUsd(account.unrealizedPnl), tone: cash >= 0 ? 'long' : 'short' },
    { k: 'margin reserved', v: `$${usd(account.totalMargin)}` },
    { k: 'maintenance margin', v: `$${usd(account.maintenanceMargin)}` },
  ];

  return (
    <dl className="px-3 py-2 text-[11px]">
      <div className="flex items-center justify-between border-b border-line/50 pb-1.5 text-muted">
        <span className="text-[10px] uppercase tracking-[0.08em]">USD · strike</span>
        <span className="text-[10px]">as the venue reports it</span>
      </div>
      {rows.map((r) => (
        <div key={r.k} className="flex items-center justify-between border-b border-line/50 py-1.5">
          <dt className="text-muted">{r.k}</dt>
          <dd
            className={cn(
              'num',
              r.tone === 'long' && 'text-long',
              r.tone === 'short' && 'text-short',
            )}
          >
            {r.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** No numbers yet, or none that can be trusted. Say which, rather than showing paper ones. */
export function VenueUnavailable({ state }: { state: VenueState }) {
  const text =
    state.status === 'reconnect'
      ? 'Session expired. Reconnect to read your Strike account.'
      : state.status === 'loading'
        ? 'Reading your Strike account…'
        : 'Could not read your Strike account. Retrying.';

  return (
    <p className="px-3 py-6 text-center text-[11px] text-muted">
      {text}
      {state.error && <span className="ml-1 text-muted/60">({state.error})</span>}
    </p>
  );
}
