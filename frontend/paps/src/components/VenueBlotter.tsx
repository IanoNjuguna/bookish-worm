import { useState } from 'react';
import { cn } from '../lib/cn';
import type { VenueState } from '../lib/strike/venue-client';
import type { TradeApi } from '../hooks/useVenueTrade';
import { VenueAge } from './blotter/VenueAge';
import { VenuePositionCards } from './blotter/VenuePositionCards';
import {
  VenueFillRows,
  VenueFundingRows,
  VenueOrderRows,
  VenueTransactionRows,
} from './blotter/VenueRows';
import { VenueFills } from './VenueFills';
import {
  VenueBalances,
  VenueFunding,
  VenueOrders,
  VenuePositions,
  VenueTransactions,
  VenueUnavailable,
} from './VenueTables';

type TabKey = 'positions' | 'orders' | 'fills' | 'funding' | 'transactions' | 'balances';

/**
 * The blotter for a connected account.
 *
 * Every number here is the venue's, including uPnL, the liquidation price and funding, so
 * there is nothing to compute from a mark. A read that failed keeps the last numbers and
 * ages them; a session with nothing readable says so rather than falling back to demo,
 * because demo positions are not this account's positions.
 *
 * Close, half-close and cancel are the venue's own writes, and each one asks for a fresh
 * read afterwards rather than guessing at the result.
 */
export function VenueBlotter({
  state,
  marks,
  trade = null,
  stepFor,
}: {
  state: VenueState;
  marks: Record<string, number>;
  trade?: TradeApi | null;
  stepFor?: (symbol: string) => number;
}) {
  const [tab, setTab] = useState<TabKey>('positions');
  const data = state.data;
  const pending = trade?.pending ?? [];

  const tabs: { key: TabKey; label: string; short: string; n?: number }[] = [
    { key: 'positions', label: 'Positions', short: 'Positions', n: data?.positions.length },
    {
      key: 'orders',
      label: 'Open orders',
      short: 'Orders',
      n: data ? data.orders.length + pending.length : undefined,
    },
    { key: 'fills', label: 'Fills', short: 'Fills', n: data?.fills.length },
    { key: 'funding', label: 'Funding', short: 'Funding', n: data?.funding.length },
    { key: 'transactions', label: 'Transactions', short: 'Txn', n: data?.transactions.length },
    { key: 'balances', label: 'Balances', short: 'Balance' },
  ];

  const onClose = trade
    ? (p: Parameters<TradeApi['close']>[0], f: 1 | 0.5) => trade.close(p, f, marks[p.symbol] ?? 0)
    : undefined;
  const ordersWithActions = Boolean(trade) && (pending.length > 0 || (data?.orders.length ?? 0) > 0);

  return (
    <section className="flex h-full min-h-0 flex-col border-t border-line bg-panel">
      <div className="flex items-center gap-3 overflow-x-auto border-b border-line px-1 scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn('tab whitespace-nowrap', tab === t.key && 'tab-active')}
          >
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.short}</span>
            {t.n !== undefined && <span className="ml-1 text-muted">({t.n})</span>}
          </button>
        ))}
        {tab === 'orders' && ordersWithActions && (
          <button
            onClick={() => trade?.cancelEvery()}
            className="ml-auto whitespace-nowrap border border-line px-2 py-0.5 text-micro uppercase tracking-[0.08em] text-muted hover:text-fg"
          >
            cancel all
          </button>
        )}
        <span
          className={cn(
            'flex items-center gap-1.5 pr-2',
            tab === 'orders' && ordersWithActions ? '' : 'ml-auto',
          )}
        >
          <span className="text-micro uppercase tracking-[0.1em] text-muted">strike</span>
          <VenueAge state={state} />
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {!data ? (
          <VenueUnavailable state={state} />
        ) : (
          <>
            {tab === 'positions' && (
              <>
                <div className="sm:hidden">
                  <VenuePositionCards
                    positions={data.positions}
                    marks={marks}
                    onClose={onClose}
                    stepFor={stepFor}
                  />
                </div>
                <VenuePositions
                  positions={data.positions}
                  marks={marks}
                  onClose={onClose}
                  stepFor={stepFor}
                />
              </>
            )}

            {tab === 'orders' && (
              <>
                <div className="sm:hidden">
                  <VenueOrderRows orders={data.orders} onCancel={trade ? trade.cancel : undefined} />
                </div>
                <VenueOrders
                  orders={data.orders}
                  pending={pending}
                  onCancel={trade ? trade.cancel : undefined}
                />
              </>
            )}

            {tab === 'fills' && (
              <>
                <div className="sm:hidden">
                  <VenueFillRows fills={data.fills} />
                </div>
                <VenueFills fills={data.fills} />
              </>
            )}

            {tab === 'funding' && (
              <>
                <div className="sm:hidden">
                  <VenueFundingRows rows={data.funding} />
                </div>
                <VenueFunding rows={data.funding} />
              </>
            )}

            {tab === 'transactions' && (
              <>
                <div className="sm:hidden">
                  <VenueTransactionRows rows={data.transactions} />
                </div>
                <VenueTransactions rows={data.transactions} />
              </>
            )}

            {tab === 'balances' && <VenueBalances account={data.account} />}
          </>
        )}
      </div>
    </section>
  );
}
