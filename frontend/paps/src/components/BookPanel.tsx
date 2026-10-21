import { useEffect, useMemo, useRef, useState } from 'react';
import { OrderBook } from '../lib/book';
import { BOOK_DEPTH } from '../lib/constants';
import { price, qty } from '../lib/format';
import { cn } from '../lib/cn';
import type { Level } from '../lib/types';
import type { BookStatus } from '../hooks/useDepth';

type Props = {
  bids: Level[];
  asks: Level[];
  status: BookStatus;
  funding: number;
  nextFundingIn: number;
  onPick: (p: string) => void;
};

function Row({ p, q, side, width, onPick }: { p: string; q: string; side: 'bid' | 'ask'; width: number; onPick: (p: string) => void }) {
  return (
    <button
      onClick={() => onPick(p)}
      className="relative flex h-[20px] w-full items-center justify-between px-2.5 text-[11px]"
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

/** Order book with cumulative depth, the mid row carrying spread and funding. */
export function BookPanel({ bids, asks, status, funding, nextFundingIn, onPick }: Props) {
  const [tab, setTab] = useState<'book' | 'depth'>('book');
  const bidCum = useMemo(() => OrderBook.cumulative(bids), [bids]);
  const askCum = useMemo(() => OrderBook.cumulative(asks), [asks]);
  const max = Math.max(bidCum.at(-1) ?? 0, askCum.at(-1) ?? 0, 1);
  const spread = asks[0] && bids[0] ? Number(asks[0][0]) - Number(bids[0][0]) : 0;
  const mid = asks[0] && bids[0] ? (Number(asks[0][0]) + Number(bids[0][0])) / 2 : 0;
  const crossing = spread < 0;

  return (
    <section className="flex min-h-0 flex-1 flex-col border-b border-line bg-panel">
      <div className="flex items-center gap-1 border-b border-line px-1">
        {(['book', 'depth'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn('tab', t === tab && 'tab-active')}>
            {t === 'book' ? 'Order book' : 'Depth'}
          </button>
        ))}
        <span className="ml-auto pr-2 text-[10px] text-muted">
          {status === 'live' ? 'live' : status === 'down' ? 'reconnecting' : 'syncing'}
        </span>
      </div>

      <div className="flex items-center justify-between px-2.5 py-1">
        <span className="label">price (usd)</span>
        <span className="label">size</span>
      </div>

      <div className="flex flex-col justify-end">
        {[...asks].reverse().map(([p, q], i, arr) => (
          <Row
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
        <span className="num text-[14px] text-long">{mid ? price(mid) : '—'}</span>
        <span className={cn('num text-[10px]', crossing ? 'text-short' : 'text-muted')}>
          {crossing ? 'resyncing' : `spread ${spread ? spread.toFixed(6) : '—'}`}
        </span>
        <span className="num text-[10px] text-muted">
          funding {nextFundingIn > 0 ? `${Math.floor(nextFundingIn / 60000)}m` : '—'}
        </span>
      </div>

      <div className="flex flex-col">
        {bids.slice(0, BOOK_DEPTH).map(([p, q], i) => (
          <Row key={`b${p}`} p={p} q={q} side="bid" width={(bidCum[i] / max) * 100} onPick={onPick} />
        ))}
      </div>
      <span className="sr-only">{funding}</span>
    </section>
  );
}

/** Keeps the column height stable while the book fills in. */
export function useStableBook() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rows, setRows] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setRows(Math.floor(el.clientHeight / 20));
  }, []);
  return { ref, rows };
}
