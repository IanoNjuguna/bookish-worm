import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { price, usd } from '../lib/format';
import { DEFAULT_TIER, liquidationPrice, sizeForNotional, type Side } from '../lib/order';
import { sparkPath } from '../hooks/useSparklines';
import type { DeckCard } from '../hooks/useDeck';

type Props = {
  cards: DeckCard[];
  spark: Record<string, number[]>;
  equity: number;
  risk: number;
  leverage: number;
  stepFor: (symbol: string) => number;
  openPositions: number;
  maxPositions: number;
  onSwipe: (c: DeckCard, side: Side) => void;
  onPass: (c: DeckCard) => void;
  undo: { symbol: string; side: Side } | null;
  onUndo: () => void;
};

type Drag = { x: number; y: number; active: boolean };
const THRESHOLD = 0.32;

/**
 * Card anatomy borrowed from the two strongest swipe surfaces in Mobbin: Tinder's
 * deck (stack behind the card, depth ticks, one hero, chips for facts) and Plenty of
 * Fish's action row inside the card instead of under it.
 *
 * Density rule: four chips on the face, everything else behind Details. A card is
 * judged in under a second; a table is not.
 */
export function SwipeDeck({
  cards,
  spark,
  equity,
  risk,
  leverage,
  stepFor,
  openPositions,
  maxPositions,
  onSwipe,
  onPass,
  undo,
  onUndo,
}: Props) {
  const [drag, setDrag] = useState<Drag>({ x: 0, y: 0, active: false });
  const [flying, setFlying] = useState<'LONG' | 'SHORT' | null>(null);
  const [details, setDetails] = useState(false);
  const width = useRef(0);
  const host = useRef<HTMLDivElement | null>(null);

  const top = cards[0];
  const full = openPositions >= maxPositions;

  const commit = useCallback(
    (side: Side | 'pass') => {
      if (!top) return;
      if (side === 'pass') {
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

  useEffect(() => {
    setDetails(false);
  }, [top?.symbol]);

  if (!top) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="text-[12px] text-muted">Deck empty. Nothing left to swipe in this batch.</p>
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
  const lean = Math.min(1, Math.abs(drag.x) / (width.current * THRESHOLD || 240));
  const series = spark[top.symbol] ?? [];
  const path = sparkPath(series, 100, 42);
  const up = top.pct >= 0;

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <div className="flex items-center gap-1">
          {cards.slice(0, 8).map((c, i) => (
            <span
              key={c.symbol}
              className={cn('h-[2px] w-4', i === 0 ? 'bg-fg' : 'bg-line')}
              title={`${i + 1} of ${cards.length}`}
            />
          ))}
        </div>
        <span className="num text-[10px] text-muted">
          {cards.length} left · ${usd(risk)} at {leverage}×
        </span>
      </div>

      <div
        ref={host}
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-5"
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
        <div className="relative w-full max-w-[366px]">
          {cards.length > 2 && (
            <div className="absolute inset-x-5 top-5 h-full border border-line/40 bg-panel/40" />
          )}
          {cards.length > 1 && (
            <div className="absolute inset-x-2.5 top-2.5 h-full border border-line/70 bg-panel/70" />
          )}

          <div
            className={cn(
              'relative flex select-none flex-col overflow-hidden border bg-panel transition-transform',
              flying ? 'duration-200' : drag.active ? 'duration-75' : 'duration-200',
              drag.x > 0 ? 'border-long/60' : drag.x < 0 ? 'border-short/60' : 'border-line',
            )}
            style={{
              transform: `translateX(${drag.x}px) rotate(${drag.x / 40}deg)`,
              opacity: flying ? 0 : 1,
            }}
          >
            {/* hero: the price series, framed the way a photo is framed */}
            <div className="relative h-[240px] overflow-hidden border-b border-line">
              <svg viewBox="0 0 100 42" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                <defs>
                  <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={up ? '#00b47a' : '#f0534e'} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={up ? '#00b47a' : '#f0534e'} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {path && (
                  <>
                    <path d={`${path} L100,42 L0,42 Z`} fill="url(#sparkFill)" />
                    <path d={path} fill="none" stroke={up ? '#00b47a' : '#f0534e'} strokeWidth="0.7" />
                  </>
                )}
              </svg>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-panel via-panel/80 to-transparent px-4 pb-3 pt-8">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[15px] font-semibold">{top.symbol}</div>
                    <div className="num mt-0.5 text-[30px] leading-none">{price(top.price)}</div>
                  </div>
                  <div className={cn('num text-right text-[12px]', up ? 'text-long' : 'text-short')}>
                    {up ? '+' : '−'}
                    {Math.abs(top.pct).toFixed(2)}%
                    <div className="text-[10px] text-muted">24h</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 px-4 pt-3">
              <Chip>#{top.rank} mover</Chip>
              <Chip>{pos > 0.8 ? 'near 24h high' : pos < 0.2 ? 'near 24h low' : 'mid range'}</Chip>
              <Chip>
                {Number.isFinite(top.funding)
                  ? `funding ${top.funding >= 0 ? '+' : ''}${(top.funding * 3 * 365 * 100).toFixed(1)}%`
                  : 'funding —'}
              </Chip>
            </div>

            <div className="px-4 pb-3 pt-3">
              <div className="relative h-1 bg-panel-2">
                <span className="absolute top-0 h-full bg-fg/30" style={{ width: `${pos * 100}%` }} />
                <span className="absolute -top-1 h-3 w-[2px] bg-fg" style={{ left: `${pos * 100}%` }} />
              </div>
              <div className="num mt-1 flex justify-between text-[9px] text-muted">
                <span>{price(top.low)}</span>
                <span>24h range</span>
                <span>{price(top.high)}</span>
              </div>
            </div>

            {details && (
              <dl className="grid grid-cols-2 gap-2 border-t border-line px-4 py-3 text-[11px]">
                <Row k="liq. if long" v={withAway(liqLong, top.markPrice)} tone="short" />
                <Row k="liq. if short" v={withAway(liqShort, top.markPrice)} />
                <Row k="size" v={`${size.toLocaleString('en-US')} ${top.symbol.split('-')[0]}`} />
                <Row k="notional" v={`$${usd(risk)}`} />
                <Row k="margin" v={`$${usd(margin)}`} />
                <Row k="24h volume" v={`$${(top.quoteVolume / 1e6).toFixed(2)}M`} />
              </dl>
            )}

            <div className="mt-auto flex items-center justify-between border-t border-line px-4 py-2">
              <span className="text-[10px] text-muted">
                {details ? 'less' : 'more'} · {size.toLocaleString('en-US')} {top.symbol.split('-')[0]}
              </span>
              <button
                onClick={() => setDetails((v) => !v)}
                className="border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-muted hover:text-fg"
              >
                {details ? 'hide' : 'details'}
              </button>
            </div>

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

        {/* action row under the deck, the way Plenty of Fish places it */}
        <div className="mt-3 flex items-center justify-center gap-4">
            <Action
              label="undo"
              tone="neutral"
              disabled={!undo}
              onClick={onUndo}
              glyph="↺"
            />
            <Action label="pass" tone="neutral" onClick={() => commit('pass')} glyph="✕" />
            <Action
              label="short"
              tone="short"
              disabled={full}
              onClick={() => commit('SHORT')}
              glyph="↓"
            />
            <Action
              label="long"
              tone="long"
              disabled={full}
              onClick={() => commit('LONG')}
              glyph="↑"
            />
        </div>
      </div>

      <div className="flex h-9 shrink-0 items-center justify-between border-t border-line px-3">
        <span className="num text-[10px] text-muted">
          equity ${usd(equity)} · {openPositions}/{maxPositions} open
        </span>
        {full ? (
          <span className="text-[10px] text-short">position cap reached · close one first</span>
        ) : undo ? (
          <button
            onClick={onUndo}
            className="num border border-brand/40 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-brand"
          >
            {undo.side === 'LONG' ? 'long' : 'short'} {undo.symbol} · undo
          </button>
        ) : (
          <span className="text-[10px] text-muted">2s undo</span>
        )}
      </div>
    </div>
  );
}

/** Absolute liquidation plus how far the price has to travel to reach it. */
function withAway(liq: number, entry: number): string {
  if (!liq || !entry) return '—';
  const away = ((liq - entry) / entry) * 100;
  return `${price(liq)} (${away >= 0 ? '+' : '−'}${Math.abs(away).toFixed(1)}%)`;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="num border border-line bg-panel-2 px-1.5 py-0.5 text-[10px] text-fg/80">
      {children}
    </span>
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

function Action({
  label,
  glyph,
  tone,
  onClick,
  disabled,
}: {
  label: string;
  glyph: string;
  tone: 'neutral' | 'long' | 'short';
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full border text-[16px] transition-colors',
        tone === 'neutral' && 'border-line text-fg/70 hover:text-fg',
        tone === 'long' && 'border-long text-long hover:bg-long/15',
        tone === 'short' && 'border-short text-short hover:bg-short/15',
        disabled && 'opacity-30',
      )}
    >
      {glyph}
    </button>
  );
}
