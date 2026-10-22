import { useState } from 'react';
import { cn } from '../lib/cn';
import { unrealised, type Position } from '../lib/order';
import type { Fill, WorkingOrder } from '../lib/store';
import type { VenueState } from '../lib/strike/venue-client';
import type { TradeApi } from '../hooks/useVenueTrade';
import { PaperBalances, PaperHistory, PaperOrders, PaperPositions } from './PaperTables';
import { VenueFills } from './VenueFills';
import {
  VenueBalances,
  VenueFunding,
  VenueOrders,
  VenuePositions,
  VenueTransactions,
  VenueUnavailable,
} from './VenueTables';

type Props = {
  positions: Position[];
  orders: WorkingOrder[];
  fills: Fill[];
  equity: number;
  mark: number;
  marks: Record<string, number>;
  symbol: string;
  onClose: (id: string, mark: number, fraction?: number) => void;
  onCloseAll: (mark: number) => void;
  onCancel: (id: string) => void;
  /** Absent with no session: the blotter is the paper ledger, exactly as before. */
  venue?: VenueState | null;
  /** A mark per symbol the venue holds, not just the one on screen. */
  venueMarks?: Record<string, number>;
  /** Present when the session may trade: closes and cancels go to the venue. */
  trade?: TradeApi | null;
  /** The market's lot step, so a position too small to halve does not offer a half close. */
  stepFor?: (symbol: string) => number;
};

type TabKey = 'positions' | 'orders' | 'fills' | 'history' | 'funding' | 'transactions' | 'balances';

/**
 * The blotter: what you hold, what is working, what happened, what you have.
 *
 * With a session the rows are the venue's, because showing a local $10,000 equity next to a
 * real account would be a lie the whole app tells. Without one it is the paper ledger.
 */
export function Blotter({
  positions,
  orders,
  fills,
  equity,
  mark,
  marks,
  symbol,
  onClose,
  onCloseAll,
  onCancel,
  venue = null,
  venueMarks = {},
  trade = null,
  stepFor,
}: Props) {
  const [tab, setTab] = useState<TabKey>('positions');
  const open = orders.filter((o) => o.status === 'open');
  const data = venue?.data ?? null;
  const live = Boolean(venue);

  const tabs: { key: TabKey; label: string; short: string; n?: number }[] = live
    ? [
        { key: 'positions', label: 'Positions', short: 'Positions', n: data?.positions.length ?? 0 },
        {
          key: 'orders',
          label: 'Open orders',
          short: 'Orders',
          n: (data?.orders.length ?? 0) + (trade?.pending.length ?? 0),
        },
        { key: 'fills', label: 'Fills', short: 'Fills', n: data?.fills.length ?? 0 },
        { key: 'funding', label: 'Funding', short: 'Funding', n: data?.funding.length ?? 0 },
        {
          key: 'transactions',
          label: 'Transactions',
          short: 'Txn',
          n: data?.transactions.length ?? 0,
        },
        { key: 'balances', label: 'Balances', short: 'Balance' },
      ]
    : [
        { key: 'positions', label: 'Positions', short: 'Positions', n: positions.length },
        { key: 'orders', label: 'Open orders', short: 'Orders', n: open.length },
        { key: 'history', label: 'Order history', short: 'History', n: fills.length },
        { key: 'balances', label: 'Balances', short: 'Balance' },
      ];

  const showUnavailable = live && !data;
  const statusLabel = !live
    ? ''
    : venue?.status === 'reconnect'
      ? 'reconnect needed'
      : venue?.status === 'stale'
        ? 'stale · read only'
        : trade
          ? 'strike · live'
          : 'strike · read only';

  return (
    <section className="flex h-full min-h-0 flex-col border-t border-line bg-panel">
      {/* The tabs scroll; the venue's state and the market do not scroll away with them. */}
      <div className="flex items-center border-b border-line">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto px-1 scrollbar-none">
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
          {live && trade && !trade.block && (data?.orders.length ?? 0) > 0 && (
            <button
              onClick={() => trade.cancelEvery()}
              title="cancel every open order on this account"
              className="ml-auto whitespace-nowrap border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-muted hover:text-fg"
            >
              cancel all
            </button>
          )}
          {!live && positions.length > 0 && (
            <button
              onClick={() => onCloseAll(mark)}
              className="ml-auto whitespace-nowrap border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-muted hover:text-fg"
            >
              close all
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 pr-2">
          {live && (
            <span
              className={cn(
                'whitespace-nowrap text-[10px] uppercase tracking-[0.08em]',
                venue?.status === 'stale' || venue?.status === 'reconnect'
                  ? 'text-short'
                  : 'text-muted',
              )}
            >
              {statusLabel}
            </span>
          )}
          <span className="text-[10px] text-muted">{symbol}</span>
        </div>
      </div>

      {trade?.notice && (
        <div className="flex items-start justify-between gap-2 border-b border-line bg-panel-2 px-3 py-1">
          <span className="text-[10px] text-short">{trade.notice}</span>
          <button
            onClick={trade.dismissNotice}
            className="text-[10px] text-muted hover:text-fg"
            aria-label="dismiss"
          >
            ×
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'positions' &&
          (showUnavailable ? (
            <VenueUnavailable state={venue as VenueState} />
          ) : live && data ? (
            <VenuePositions
              positions={data.positions}
              marks={venueMarks}
              onClose={
                trade && !trade.block
                  ? (p, fraction) => trade.close(p, fraction, venueMarks[p.symbol] ?? 0)
                  : undefined
              }
              stepFor={stepFor}
            />
          ) : (
            <PaperPositions positions={positions} marks={marks} mark={mark} onClose={onClose} />
          ))}

        {tab === 'orders' &&
          (showUnavailable ? (
            <VenueUnavailable state={venue as VenueState} />
          ) : live && data ? (
            <VenueOrders
              orders={data.orders}
              pending={trade?.pending}
              onCancel={trade && !trade.block ? trade.cancel : undefined}
            />
          ) : (
            <PaperOrders orders={open} onCancel={onCancel} />
          ))}

        {tab === 'fills' && (data ? <VenueFills fills={data.fills} /> : <VenueUnavailable state={venue as VenueState} />)}

        {tab === 'history' && <PaperHistory fills={fills} />}

        {tab === 'funding' &&
          (data ? <VenueFunding rows={data.funding} /> : <VenueUnavailable state={venue as VenueState} />)}

        {tab === 'transactions' &&
          (data ? (
            <VenueTransactions rows={data.transactions} />
          ) : (
            <VenueUnavailable state={venue as VenueState} />
          ))}

        {tab === 'balances' &&
          (showUnavailable ? (
            <VenueUnavailable state={venue as VenueState} />
          ) : live && data ? (
            <VenueBalances account={data.account} />
          ) : (
            <PaperBalances
              equity={equity}
              margin={positions.reduce((n, p) => n + p.margin, 0)}
              pnl={positions.reduce((n, p) => n + unrealised(p, mark), 0)}
            />
          ))}
      </div>
    </section>
  );
}
