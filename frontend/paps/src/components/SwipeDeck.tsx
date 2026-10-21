import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { price, usd } from '../lib/format';
import { DEFAULT_TIER, liquidationPrice, sizeForNotional, type Side } from '../lib/order';
import type { DeckCard } from '../hooks/useDeck';

type Props = {
  cards: DeckCard[];
  equity: number;
  risk: number;
  leverage: number;
  stepFor: (symbol: string) => number;
  onSwipe: (c: DeckCard, side: Side) => void;
  onPass: (c: DeckCard) => void;
  undo: { symbol: string; side: Side; id: string } | null;
  onUndo: () => void;
};

type Drag = { x: number; y: number; active: boolean };
const THRESHOLD = 0.32;

/**
 * Swipe deck: right is long, left is short, up passes. A swipe is an immediate paper
 * order, so the undo window is not decoration — it is the thing that makes the gesture
 * safe enough to use.
 */
export function SwipeDeck({ cards, equity, risk, leverage, stepFor, onSwipe, onPass, undo, onUndo }: Props) {
  const [drag, setDrag] = useState<Drag>({ x: 0, y: 0, active: false });
  const [flying, setFlying] = useState<'LONG' | 'SHORT' | null>(null);
  const width = useRef(0);
  const host = useRef<HTMLDivElement | null>(null);

  const top = cards[0];

  const commit = useCallback(
    (side: Side | 'pass') => {
      if (!top) return;
      if (side === 'pass') {
        setFlying(null);
        setDrag({ x: 0, y: 0, active: false });
        onPass(top);
        return;
      }
      setFlying(side);
      setDrag({ x: side === 'LONG' ? 600 : -600, y: 0, active: false });
      window.setTimeout(() => {
        onSwipe(top, side);
        setFlying(null);
        setDrag({ x: 0, y: 0, active: false });
      }, 180);
    },
    [onPass, onSwipe, top],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') commit('LONG');
      if (e.key === 'ArrowLeft') commit('SHORT');
      if (e.key === 'ArrowUp') commit('pass');
      if (e.key.toLowerCase() === 'z') onUndo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commit, onUndo]);

  if (!top) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="text-[12px] text-muted">
          Deck empty. Every market has been swiped; reload to reshuffle.
        </p>
      </div>
    );
  }

  const size = sizeForNotional(risk, top.markPrice, stepFor(top.symbol));
  const margin = risk / leverage;
  const liqLong = liquidationPrice('LONG', top.markPrice, margin, size, DEFAULT_TIER);
  const liqShort = liquidationPrice('SHORT', top.markPrice, margin, size, DEFAULT_TIER);
  const range = Math.max(top.high - top.low, 1e-9);
  const pos = Math.min(1, Math.max(0, (top.price - top.low) / range));
  const dir = drag.x > 0 ? 'LONG' : 'SHORT';
  // Facts, not signals: where price sits in the day's range, and who pays funding.
  const where = pos > 0.8 ? 'near the 24h high' : pos < 0.2 ? 'near the 24h low' : 'mid-range';
  const pays = !Number.isFinite(top.funding)
    ? 'funding unknown'
    : top.funding >= 0
      ? 'longs pay shorts'
      : 'shorts pay longs';
  const lean = Math.min(1, Math.abs(drag.x) / (width.current * THRESHOLD || 240));

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="text-[10px] uppercase tracking-[0.1em] text-muted">
          swipe right to long · left to short
        </span>
        <span className="num text-[10px] text-muted">
          {cards.length} left · risk ${usd(risk)} · {leverage}×
        </span>
      </div>

      <div
        ref={host}
        className="relative flex flex-1 items-center justify-center overflow-hidden p-4"
        onPointerDown={(e) => {
          width.current = host.current?.clientWidth ?? 320;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setDrag({ x: 0, y: 0, active: true });
        }}
        onPointerMove={(e) => {
          if (!drag.active) return;
          setDrag({ x: e.movementX + drag.x, y: drag.y, active: true });
        }}
        onPointerUp={() => {
          if (!drag.active) return;
          const past = Math.abs(drag.x) > (width.current * THRESHOLD || 120);
          if (past) commit(drag.x > 0 ? 'LONG' : 'SHORT');
          else setDrag({ x: 0, y: 0, active: false });
        }}
      >
        <div className="relative w-full max-w-[360px]">
          {cards.length > 2 && (
            <div className="absolute inset-x-4 top-4 h-full border border-line/40 bg-panel/40" />
          )}
          {cards.length > 1 && (
            <div className="absolute inset-x-2 top-2 h-full border border-line/70 bg-panel/70" />
          )}
        <div
          className={cn(
            'relative w-full select-none border bg-panel p-4 transition-transform min-h-[340px] flex flex-col justify-center',
            flying ? 'duration-200' : drag.active ? 'duration-75' : 'duration-200',
            drag.x > 0 ? 'border-long/60' : drag.x < 0 ? 'border-short/60' : 'border-line',
          )}
          style={{
            transform: `translateX(${drag.x}px) rotate(${drag.x / 40}deg)`,
            opacity: flying ? 0 : 1,
          }}
        >
          <div className="mb-3 flex items-center justify-between border-b border-line pb-2 text-[10px] text-muted">
            <span>
              #{top.rank} mover · {where}
            </span>
            <span>{pays}</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="text-[13px] font-semibold">{top.symbol}</div>
              <div className="num mt-1 text-[26px] leading-none">{price(top.price)}</div>
            </div>
            <div className="text-right">
              <div className={cn('num text-[12px]', top.pct >= 0 ? 'text-long' : 'text-short')}>
                {top.pct >= 0 ? '+' : '−'}
                {Math.abs(top.pct).toFixed(2)}%
              </div>
              <div className="text-[10px] text-muted">24h</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="relative h-1.5 bg-panel-2">
              <span
                className="absolute top-0 h-full bg-fg/40"
                style={{ width: `${pos * 100}%` }}
              />
              <span
                className="absolute -top-1 h-3.5 w-[2px] bg-fg"
                style={{ left: `${pos * 100}%` }}
              />
            </div>
            <div className="num mt-1 flex justify-between text-[10px] text-muted">
              <span>{price(top.low)}</span>
              <span>24h range</span>
              <span>{price(top.high)}</span>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-3 text-[11px]">
            <Row
              k="funding / apr"
              v={Number.isFinite(top.funding) ? `${(top.funding * 3 * 365 * 100).toFixed(1)}%` : '—'}
              tone={Number.isFinite(top.funding) && top.funding < 0 ? 'short' : undefined}
            />
            <Row k="your risk" v={`$${usd(risk)} at ${leverage}×`} />
            <Row k="liq. if long" v={liqLong ? price(liqLong) : '—'} tone="short" />
            <Row k="liq. if short" v={liqShort ? price(liqShort) : '—'} tone="short" />
          </dl>

          <p className="mt-3 text-[10px] text-muted">
            {size.toLocaleString('en-US')} {top.symbol.split('-')[0]} of notional ${usd(risk)}. Paper.
          </p>

          {lean > 0.02 && (
            <div
              className={cn(
                'pointer-events-none absolute inset-0 flex items-center justify-center border-2',
                dir === 'LONG' ? 'border-long' : 'border-short',
              )}
              style={{ opacity: lean * 0.9 }}
            >
              <span
                className={cn(
                  'px-3 py-1 text-[16px] font-semibold uppercase tracking-[0.1em]',
                  dir === 'LONG' ? 'text-long' : 'text-short',
                )}
              >
                {dir === 'LONG' ? 'long' : 'short'}
              </span>
            </div>
          )}
        </div>
        </div>
      </div>

      <p className="shrink-0 px-4 pb-2 text-center text-[10px] text-muted">
        drag the card, or use the buttons · arrow keys and <span className="num">z</span> on
        desktop
      </p>

      <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-line p-3">
        <button
          onClick={() => commit('SHORT')}
          className="bg-short py-3 text-[13px] font-semibold text-black hover:opacity-90"
        >
          Short
        </button>
        <button
          onClick={() => commit('LONG')}
          className="bg-long py-3 text-[13px] font-semibold text-black hover:opacity-90"
        >
          Long
        </button>
      </div>

      <div className="flex h-9 shrink-0 items-center justify-between border-t border-line px-3">
        <span className="num text-[10px] text-muted">equity ${usd(equity)}</span>
        {undo ? (
          <button
            onClick={onUndo}
            className="num flex items-center gap-2 border border-brand/40 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-brand"
          >
            {undo.side === 'LONG' ? 'long' : 'short'} {undo.symbol} · undo
          </button>
        ) : (
          <span className="text-[10px] text-muted">2s undo for every swipe</span>
        )}
      </div>
    </div>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: 'short' }) {
  return (
    <div>
      <dt className="text-[10px] text-muted">{k}</dt>
      <dd className={cn('num mt-0.5', tone === 'short' && 'text-short')}>{v}</dd>
    </div>
  );
}
