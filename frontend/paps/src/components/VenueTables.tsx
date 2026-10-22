import { clock, pct, price, qty, signedUsd, usd } from '../lib/format';
import { cn } from '../lib/cn';
import type {
  VenueAccount,
  VenueFundingRow,
  VenueOrder,
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
}: {
  positions: VenuePosition[];
  marks: Record<string, number>;
}) {
  return (
    // Eight columns inside a 520px rail: tight cells so uPnL and Funding stay on screen.
    <table className="w-full text-[11px] [&_td]:px-2 [&_th]:px-2">
      <thead className="sticky top-0 bg-panel text-muted">
        <Th cols={['Market', 'Side', 'Size', 'Entry', 'Mark', 'Liq.', 'uPnL', 'Funding']} />
      </thead>
      <tbody>
        {positions.map((p) => {
          const mark = marks[p.symbol];
          const upnl = Number(p.upnl);
          const funding = Number(p.funding);
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
            </tr>
          );
        })}
        {!positions.length && <Empty cols={8} text="No open positions on this account." />}
      </tbody>
    </table>
  );
}

export function VenueOrders({ orders }: { orders: VenueOrder[] }) {
  return (
    <table className="w-full text-[11px]">
      <thead className="sticky top-0 bg-panel text-muted">
        <Th cols={['Market', 'Side', 'Type', 'Price', 'Size', 'Filled', 'Time', 'Status']} />
      </thead>
      <tbody>
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
          </tr>
        ))}
        {!orders.length && <Empty cols={8} text="No working orders on this account." />}
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
