import { useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { price, usd } from '../lib/format';
import { DEFAULT_TIER, liquidationPrice, notionalOf, sizeForNotional, type Side } from '../lib/order';
import type { SymbolInfo } from '../lib/types';

type Order = { side: Side; kind: 'limit' | 'market'; price: number; size: number; leverage: number };

type Props = {
  symbol: string;
  info: SymbolInfo | undefined;
  mark: number;
  equity: number;
  initialRisk?: number;
  initialLeverage?: number;
  maxLeverage: number;
  /** Funding rate for this market, per funding window. */
  fundingRate?: number;
  onPlace: (o: Order) => void;
};

const PRESETS = [25, 50, 100, 250, 500];
// The strip contains every tier default, so the selected leverage is always visible.
const LEV = [2, 3, 5, 10, 20];
const FEE = 0.0005;

/**
 * The ticket half of the Trade tab: direction, size, leverage, risk, one action.
 * It owns its own sizing so the surface above stays a price page, not a form.
 */
export function LiteTicket({
  symbol,
  info,
  mark,
  equity,
  initialRisk,
  initialLeverage,
  maxLeverage = 50,
  fundingRate,
  onPlace,
}: Props) {
  const [notional, setNotional] = useState(initialRisk ?? 100);
  const [leverage, setLeverage] = useState(Math.min(initialLeverage ?? 5, maxLeverage));
  const [side, setSide] = useState<Side>('LONG');

  const filters = useMemo(() => {
    const f = info?.filters ?? [];
    const find = (t: string) => f.find((x) => x.filterType === t);
    return {
      step: Number(find('LOT_SIZE')?.stepSize ?? 1),
      minNotional: Number(find('MIN_NOTIONAL')?.notional ?? 10),
    };
  }, [info]);

  const size = sizeForNotional(notional, mark, filters.step);
  const notionalValue = notionalOf(mark, size);
  const margin = notionalValue / leverage;
  const liq = mark ? liquidationPrice(side, mark, margin, size, DEFAULT_TIER) : 0;
  const fee = notionalValue * FEE;
  const base = symbol.split('-')[0];
  const canPlace = Boolean(mark) && size > 0;

  return (
    <section className="rounded-card border border-line bg-panel p-4">
      {/* Direction sits in the well; the only accent on the surface is the action. */}
      <div className="grid grid-cols-2 gap-1 rounded-control bg-canvas p-1">
        {(['LONG', 'SHORT'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            aria-pressed={side === s}
            className={cn(
              'min-h-[40px] rounded-control text-title font-medium transition-colors',
              side === s
                ? cn('bg-panel-2', s === 'LONG' ? 'text-long' : 'text-short')
                : 'text-muted',
            )}
          >
            {s === 'LONG' ? 'Long' : 'Short'}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-small text-muted">Amount</span>
        <span className="num text-title text-fg">${usd(notional)}</span>
      </div>
      <div className="mt-1 flex items-baseline justify-between">
        <span className="text-small text-muted">size</span>
        <span className="num text-small text-muted">
          {size ? `${size.toLocaleString('en-US')} ${base}` : '—'}
        </span>
      </div>

      <input
        type="range"
        aria-label="Amount"
        min={filters.minNotional}
        max={Math.max(600, Math.round(equity))}
        step={5}
        value={notional}
        onChange={(e) => setNotional(Number(e.target.value))}
        className="mt-3"
      />

      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setNotional(p)}
            className={cn(
              'min-h-[36px] rounded-control text-body transition-colors',
              notional === p ? 'bg-panel-2 text-fg' : 'text-muted',
            )}
          >
            ${p}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-small text-muted">Leverage</span>
        <span className="num text-title text-fg">{leverage}×</span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {LEV.map((l) => {
          const locked = l > maxLeverage;
          return (
            <button
              key={l}
              disabled={locked}
              onClick={() => setLeverage(l)}
              title={locked ? `unlocks at a higher level` : undefined}
              className={cn(
                'min-h-[36px] rounded-control text-body transition-colors',
                leverage === l ? 'bg-panel-2 text-fg' : 'text-muted',
                locked && 'opacity-30',
              )}
            >
              {l}×
            </button>
          );
        })}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3">
        <div>
          <dt className="text-small text-muted">margin</dt>
          <dd className="num mt-1 text-body">${usd(margin)}</dd>
        </div>
        <div>
          <dt className="text-small text-muted">liq. {side === 'LONG' ? 'long' : 'short'}</dt>
          <dd className="num mt-1 text-body text-short">{liq ? price(liq) : '—'}</dd>
        </div>
        <div className="text-right">
          <dt className="text-small text-muted">fee{fundingRate ? ' · funding' : ''}</dt>
          <dd className="num mt-1 text-body">
            ${usd(fee)}
            {fundingRate ? (
              <span className="ml-1 text-small text-muted">
                {fundingRate >= 0 ? '−' : '+'}
                {usd(fundingRate * Math.abs(notionalValue))}{'/\u00a0'}8h
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      <button
        onClick={() => onPlace({ side, kind: 'market', price: mark, size, leverage })}
        disabled={!canPlace}
        className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-control bg-accent text-title font-semibold text-canvas transition-opacity active:opacity-80 disabled:opacity-40"
      >
        Open {side === 'LONG' ? 'long' : 'short'} {base}
        <span className="ml-1.5 text-body font-medium opacity-80">· paper</span>
      </button>

      <p className="mt-3 text-body leading-relaxed text-muted">
        Fills at the mark. {size.toLocaleString('en-US')} {base} of notional ${usd(notionalValue)}.
        Liquidation is first-tier and an estimate.
      </p>
    </section>
  );
}
