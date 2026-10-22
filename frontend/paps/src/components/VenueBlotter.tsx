import { useState } from 'react';
import { cn } from '../lib/cn';
import type { VenueState } from '../lib/strike/venue-client';
import { VenueAge } from './blotter/VenueAge';
import { VenuePositionCards } from './blotter/VenuePositionCards';
import { VenueFundingRows, VenueOrderRows, VenueTransactionRows } from './blotter/VenueRows';
import {
  VenueBalances,
  VenueFunding,
  VenueOrders,
  VenuePositions,
  VenueTransactions,
  VenueUnavailable,
} from './VenueTables';

type TabKey = 'positions' | 'orders' | 'history' | 'balances';

/**
 * The blotter for a connected account.
 *
 * Every number here is the venue's, including uPnL, the liquidation price and funding, so
 * there is nothing to compute from a mark. A read that failed keeps the last numbers and
 * ages them; a session with nothing readable says so rather than falling back to paper,
 * because paper positions are not this account's positions.
 */
export function VenueBlotter({ state, marks }: { state: VenueState; marks: Record<string, number> }) {
  const [tab, setTab] = useState<TabKey>('positions');
  const data = state.data;

  const tabs: { key: TabKey; label: string; short: string; n?: number }[] = [
    { key: 'positions', label: 'Positions', short: 'Positions', n: data?.positions.length },
    { key: 'orders', label: 'Open orders', short: 'Orders', n: data?.orders.length },
    {
      key: 'history',
      label: 'Funding & history',
      short: 'History',
      n: data ? data.funding.length + data.transactions.length : undefined,
    },
    { key: 'balances', label: 'Balances', short: 'Balance' },
  ];

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
        <span className="ml-auto flex items-center gap-1.5 pr-2">
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
                  <VenuePositionCards positions={data.positions} marks={marks} />
                </div>
                <VenuePositions positions={data.positions} marks={marks} />
              </>
            )}

            {tab === 'orders' && (
              <>
                <div className="sm:hidden">
                  <VenueOrderRows orders={data.orders} />
                </div>
                <VenueOrders orders={data.orders} />
              </>
            )}

            {tab === 'history' && (
              <>
                <div className="sm:hidden">
                  <VenueFundingRows rows={data.funding} />
                  <VenueTransactionRows rows={data.transactions} />
                </div>
                <VenueFunding rows={data.funding} />
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
