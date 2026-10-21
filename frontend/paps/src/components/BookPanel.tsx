import { useMemo, useState } from 'react';
import { OrderBook } from '../lib/book';
import { BOOK_DEPTH } from '../lib/constants';
import { clock, price, qty } from '../lib/format';
import { cn } from '../lib/cn';
import type { Level, Trade } from '../lib/types';
import type { BookStatus } from '../hooks/useDepth';

type Props = {
  bids: Level[];
  asks: Level[];
  trades: Trade[];
  status: BookStatus;
  nextFundingIn: number;
  onPick: (p: string) => void;
};

type Tab = 'book' | 'depth' | 'trades';

function LevelRow({
  p,
  q,
  side,
  width,
  onPick,
}: {
  p: string;
  q: string;
  side: 'bid' | 'ask';
  width: number;
  onPick: (p: string) => void;
}) {
  return (
    <button
      onClick={() => onPick(p)}
      className="relative flex h-[20px] w-full items-center justify-between px-2.5 text-[11px]"
      title={`${side} ${q} @ ${p}`}
    >
      <span
        className={cn('absolute inset-y-0 right-0', side === 'bid' ? 'bg-long/[0.14]' : 'bg-short/[0.14]')}
        style={{ width: `${Math.min(99, width)}%` }}
      />
      <span className={cn('num relative', side === 'bid' ? 'text-long' : 'text-short')}>{price(p)}</span>
      <span className="num relative text-fg/80">{qty(q)}</span>
    </button>
  );
}

/**
 * Book, depth and tape in one rail, the way every exchange ships it. Depth is the
 * cumulative view, which answers "how much can I sell before the price moves" in one
 * glance rather than by adding rows in your head.
 */
export function BookPanel({ bids, asks, trades, status, nextFundingIn, onPick }: Props) {
  const [tab, setTab] = useState<Tab>('book');

  const bidCum = useMemo(() => OrderBook.cumulative(bids), [bids]);
  const askCum = useMemo(() => OrderBook.cumulative(asks), [asks]);
  const max = Math.max(bidCum.at(-1) ?? 0, askCum.at(-1) ?? 0, 1);
  const spread = asks[0] && bids[0] ? Number(asks[0][0]) - Number(bids[0][0]) : 0;
  const mid = asks[0] && bids[0] ? (Number(asks[0][0]) + Number(bids[0][0])) / 2 : 0;
  const crossing = spread < 0;

  const head =
    tab === 'trades'
      ? ['price (usd)', 'size', 'time']
      : ['price (usd)', tab === 'depth' ? 'total' : 'size'];

  return (
    <section className="flex min-h-0 flex-1 flex-col border-b border-line bg-panel">
      <div className="flex items-center gap-0.5 border-b border-line px-1">
        {(['book', 'depth', 'trades'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn('tab capitalize', t === tab && 'tab-active')}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto pr-2 text-[10px] text-muted">
          {status === 'live' ? 'live' : status === 'down' ? 'reconnecting' : 'syncing'}
        </span>
      </div>

      <div className="flex items-center justify-between px-2.5 py-1">
        <span className="label">{head[0]}</span>
        <span className="label">{head[1]}</span>
      </div>

      {tab === 'book' && (
        <>
          <div className="flex flex-col justify-end">
            {[...asks].slice(0, BOOK_DEPTH).reverse().map(([p, q], i, arr) => (
              <LevelRow
                key={`a${p}`}
                p={p}
                q={q}
                side="ask"
                width={(askCum[arr.length - 1 - i] / max) * 100}
                onPick={onPick}
              />
            ))}
          </div>

          <div className="flex items-center justify-between border-y border-line bg-panel-2 px-2.5 py-1.5">
            <span className={cn('num text-[14px]', crossing ? 'text-short' : 'text-long')}>
              {mid ? price(mid) : '—'}
            </span>
            <span className={cn('num text-[10px]', crossing ? 'text-short' : 'text-muted')}>
              {crossing ? 'resyncing' : `spread ${spread ? spread.toFixed(6) : '—'}`}
            </span>
            <span className="num text-[10px] text-muted">
              {nextFundingIn > 0 ? `funding in ${Math.floor(nextFundingIn / 60000)}m` : '—'}
            </span>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden">
            {bids.slice(0, BOOK_DEPTH).map(([p, q], i) => (
              <LevelRow key={`b${p}`} p={p} q={q} side="bid" width={(bidCum[i] / max) * 100} onPick={onPick} />
            ))}
          </div>
        </>
      )}

      {tab === 'depth' && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {[...asks].slice(0, 12).reverse().map(([p], i, arr) => (
            <div key={`d${p}`} className="flex h-[20px] items-center justify-between px-2.5 text-[11px]">
              <span className="num text-short">{price(p)}</span>
              <span className="num text-fg/70">{qty(askCum[arr.length - 1 - i] ?? '0')}</span>
            </div>
          ))}
          <div className="flex h-[20px] items-center justify-between border-y border-line bg-panel-2 px-2.5 text-[11px]">
            <span className="num text-muted">spread</span>
            <span className="num">{spread ? spread.toFixed(6) : '—'}</span>
          </div>
          {bids.slice(0, 12).map(([p], i) => (
            <div key={`db${p}`} className="flex h-[20px] items-center justify-between px-2.5 text-[11px]">
              <span className="num text-long">{price(p)}</span>
              <span className="num text-fg/70">{qty(bidCum[i] ?? '0')}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'trades' && (
        <div className="min-h-0 flex-1 overflow-hidden">
          {trades.map((t) => (
            <div key={t.id} className="flex h-[20px] items-center justify-between px-2.5 text-[11px]">
              <span className={cn('num', t.isBuyerMaker === false ? 'text-long' : 'text-short')}>
                {price(t.price)}
              </span>
              <span className="num text-fg/80">{qty(t.qty)}</span>
              <span className="num text-[10px] text-muted">{clock(t.time)}</span>
            </div>
          ))}
          {!trades.length && <p className="px-2.5 py-2 text-[10px] text-muted">waiting for prints…</p>}
        </div>
      )}
    </section>
  );
}
