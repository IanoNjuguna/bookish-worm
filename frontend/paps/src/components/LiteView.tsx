import { useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { price, signedUsd, usd } from '../lib/format';
import { fundingCashFlow } from '../lib/funding';
import { DEFAULT_TIER, liquidationPrice, notionalOf, sizeForNotional, type Side } from '../lib/order';
import type { SymbolInfo } from '../lib/types';
import type { Bar } from '../hooks/useKlines';
import { ChartPanel } from './Chart';
import type { Interval } from '../lib/constants';
import { IconChevronDown } from '@tabler/icons-react';

type Props = {
  symbol: string;
  info: SymbolInfo | undefined;
  mark: number;
  equity: number;
  /** The venue's current rate for this market, as a fraction of notional. */
  fundingRate?: number;
  changePct: number;
  bars: Bar[];
  interval: Interval;
  onInterval: (i: Interval) => void;
  chartError: string | null;
  initialRisk?: number;
  initialLeverage?: number;
  onOpenMarkets: () => void;
  onPlace: (o: { side: Side; kind: 'limit' | 'market'; price: number; size: number; leverage: number }) => void;
};

const PRESETS = [25, 50, 100, 250, 500];
const LEV = [2, 5, 10, 20, 50];
const FEE = 0.0005;

/**
 * Lite: one column, two big buttons, and the whole risk of the trade visible before
 * the click. Same engine as Pro, no separate state.
 */
export function LiteView({
  symbol,
  info,
  mark,
  equity,
  fundingRate,
  changePct,
  bars,
  interval,
  onInterval,
  chartError,
  initialRisk,
  initialLeverage,
  onOpenMarkets,
  onPlace,
}: Props) {
  const [notional, setNotional] = useState(initialRisk ?? 100);
  const [leverage, setLeverage] = useState(initialLeverage ?? 10);
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
  // A long and a short do not pay the same funding, so the line follows the chosen side.
  const funding = fundingRate === undefined ? null : fundingCashFlow(side, fundingRate, notionalValue);
  const base = symbol.split('-')[0];

  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-3 px-3 py-3">
      <section className="border border-line bg-panel">
        <div className="flex items-end justify-between px-3 pb-2 pt-3">
          <div>
            <button
              onClick={onOpenMarkets}
              className="flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] text-muted hover:text-fg"
            >
              {symbol}
              <IconChevronDown size={11} />
            </button>
            <div className="num mt-1 text-[30px] leading-none">{mark ? price(mark) : '—'}</div>
          </div>
          <div className="num text-[12px]">
            <span className={changePct >= 0 ? 'text-long' : 'text-short'}>
              {changePct >= 0 ? '+' : '−'}
              {Math.abs(changePct).toFixed(2)}%
            </span>
            <span className="ml-1 text-muted">24h</span>
          </div>
        </div>
        <div className="h-[212px] border-t border-line">
          <ChartPanel bars={bars} interval={interval} onInterval={onInterval} error={chartError} />
        </div>
      </section>

      <section className="border border-line bg-panel">
        <div className="flex items-center gap-1 border-b border-line px-1">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setNotional(p)}
              className={cn('chip flex-1 border-b-2 border-transparent', notional === p && 'chip-on border-brand')}
            >
              ${p}
            </button>
          ))}
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted">Amount</span>
            <span className="num text-[12px]">${usd(notional)}</span>
          </div>
          <input
            type="range"
            min={filters.minNotional}
            max={Math.max(600, Math.round(equity))}
            step={5}
            value={notional}
            onChange={(e) => setNotional(Number(e.target.value))}
            className="mt-2"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-muted">Leverage</span>
            <div className="flex gap-1">
              {LEV.map((l) => (
                <button
                  key={l}
                  onClick={() => setLeverage(l)}
                  className={cn('chip border border-line', leverage === l && 'chip-on')}
                >
                  {l}×
                </button>
              ))}
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-4 gap-2 border-t border-line pt-2 text-[11px]">
            <div>
              <dt className="text-[10px] text-muted">margin</dt>
              <dd className="num mt-0.5">${usd(margin)}</dd>
            </div>
            <div>
              <dt className="text-[10px] text-muted">liq. {side === 'LONG' ? 'long' : 'short'}</dt>
              <dd className="num mt-0.5 text-short">{liq ? price(liq) : '—'}</dd>
            </div>
            <div className="text-right">
              <dt className="text-[10px] text-muted">fee</dt>
              <dd className="num mt-0.5">${usd(fee)}</dd>
            </div>
            <div className="text-right">
              <dt className="text-[10px] text-muted">funding (next)</dt>
              <dd className="num mt-0.5">{funding === null ? '—' : signedUsd(funding)}</dd>
            </div>
          </dl>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setSide('LONG');
                onPlace({ side: 'LONG', kind: 'market', price: mark, size, leverage });
              }}
              className="flex flex-col items-center bg-long py-3 text-black transition-opacity hover:opacity-90"
            >
              <span className="text-[13px] font-semibold">Long {base}</span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-black/60">paper</span>
            </button>
            <button
              onClick={() => {
                setSide('SHORT');
                onPlace({ side: 'SHORT', kind: 'market', price: mark, size, leverage });
              }}
              className="flex flex-col items-center bg-short py-3 text-black transition-opacity hover:opacity-90"
            >
              <span className="text-[13px] font-semibold">Short {base}</span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-black/60">paper</span>
            </button>
          </div>

          <p className="mt-2 text-[10px] text-muted">
            Fills at the mark. {size.toLocaleString('en-US')} {base} of notional ${usd(notionalValue)}.
            Liquidation is first-tier and an estimate.
          </p>
        </div>
      </section>
    </div>
  );
}
