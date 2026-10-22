import { useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { price, usd } from '../lib/format';
import { DEFAULT_TIER, liquidationPrice, notionalOf, sizeForNotional, type Side } from '../lib/order';
import type { SymbolInfo } from '../lib/types';
import { IconChevronDown } from '@tabler/icons-react';
import { useFeeRate } from '../hooks/useFeeRate';
import type { TradeApi } from '../hooks/useVenueTrade';

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
  /** Present for a connected account: the ticket arms a live order instead of a demo one. */
  trade?: TradeApi | null;
  onPlace: (o: Order) => void;
};

// Three chips, not five: the field and the slider already say the same number twice.
const PRESETS = [50, 100, 250];
// The strip contains every tier default, so the selected leverage is always visible.
const LEV = [2, 3, 5, 10, 20];

/**
 * The ticket half of the Trade tab. The face is the decision — direction, amount,
 * one action. Size, margin, liquidation, fee, funding and leverage are what a
 * trader needs *after* committing to a size, so they live one tap down in
 * `showRisk` rather than competing with the CTA.
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
  trade = null,
  onPlace,
}: Props) {
  const [notional, setNotional] = useState(initialRisk ?? 100);
  const [leverage, setLeverage] = useState(Math.min(initialLeverage ?? 5, maxLeverage));
  const [side, setSide] = useState<Side>('LONG');
  /** The one disclosure: collapsed it is a single line, expanded it is the risk panel. */
  const [showRisk, setShowRisk] = useState(false);

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
  // The venue's own taker rate, and a label that admits when it is the fallback.
  const feeRate = useFeeRate();
  const fee = notionalValue * feeRate.taker;
  const blocked = Boolean(trade && (trade.block || trade.busy));
  const base = symbol.split('-')[0];
  const canPlace = Boolean(mark) && size > 0;
  // A caller may hand us a leverage that is not a tier default; show it as its own
  // chip so the current leverage is never the one value missing from the strip.
  const tiers = LEV.includes(leverage) ? LEV : [...LEV, leverage].sort((a, b) => a - b);

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

      <div className="mt-2 flex gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setNotional(p)}
            aria-pressed={notional === p}
            className={cn(
              'min-h-[32px] flex-1 rounded-chip text-body transition-colors',
              notional === p ? 'bg-panel-2 text-fg' : 'bg-canvas text-muted',
            )}
          >
            ${p}
          </button>
        ))}
      </div>

      {/* One line, always: the two numbers that answer "how much can I lose", then the
          disclosure. `truncate` keeps it to a single line at 390px whatever the values. */}
      <button
        type="button"
        onClick={() => setShowRisk((v) => !v)}
        aria-expanded={showRisk}
        className="mt-3 flex w-full items-center gap-1.5 text-small text-muted transition-colors active:text-fg"
      >
        <span className="min-w-0 truncate">
          Margin <span className="num text-fg">${usd(margin)}</span>
          <span aria-hidden="true"> · </span>
          Liq. <span className="num text-short">{liq ? price(liq) : '—'}</span>
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-0.5 font-medium text-fg">
          {showRisk ? 'Hide' : 'Details'}
          <IconChevronDown
            size={13}
            className={cn('text-muted transition-transform', showRisk && 'rotate-180')}
          />
        </span>
      </button>

      {showRisk ? (
        <div className="mt-3 rounded-card border border-line bg-canvas p-3">
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            <div>
              <dt className="text-small text-muted">size</dt>
              <dd className="num mt-0.5 text-body">
                {size ? `${size.toLocaleString('en-US')} ${base}` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-small text-muted">margin</dt>
              <dd className="num mt-0.5 text-body">${usd(margin)}</dd>
            </div>
            <div>
              <dt className="text-small text-muted">liq. {side === 'LONG' ? 'long' : 'short'}</dt>
              <dd className="num mt-0.5 text-body text-short">{liq ? price(liq) : '—'}</dd>
            </div>
            <div>
              <dt className="text-small text-muted">
                fee{fundingRate ? ' · funding' : ''}
                {feeRate.known ? '' : ' · 5 bps fallback'}
              </dt>
              <dd className="num mt-0.5 text-body">
                ${usd(fee)}
                {fundingRate ? (
                  <span className="ml-1 text-small text-muted">
                    {fundingRate >= 0 ? '−' : '+'}
                    {usd(fundingRate * Math.abs(notionalValue))}
                    {'/\u00a0'}8h
                  </span>
                ) : null}
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
            <span className="text-small text-muted">Leverage</span>
            <span className="num text-body text-fg">{leverage}×</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {tiers.map((l) => {
              const locked = l > maxLeverage;
              return (
                <button
                  key={l}
                  disabled={locked}
                  aria-pressed={leverage === l}
                  onClick={() => setLeverage(l)}
                  title={locked ? `unlocks at a higher level` : undefined}
                  className={cn(
                    'min-h-[32px] flex-1 rounded-chip text-body transition-colors',
                    leverage === l ? 'bg-panel-2 font-medium text-fg' : 'bg-panel text-muted',
                    locked && 'cursor-not-allowed opacity-30',
                  )}
                >
                  {l}×
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {trade?.block && (
        <p className="mt-3 rounded-control border border-short/40 bg-short/10 px-2.5 py-2 text-small text-short">
          {trade.block}
        </p>
      )}
      {trade?.notice && (
        <p className="mt-3 rounded-control border border-line bg-panel-2 px-2.5 py-2 text-small text-muted">
          {trade.notice}
        </p>
      )}

      <button
        onClick={() =>
          trade
            ? trade.place({ symbol, side, kind: 'market', size, price: mark, leverage })
            : onPlace({ side, kind: 'market', price: mark, size, leverage })
        }
        disabled={!canPlace || blocked}
        className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-control bg-accent text-title font-semibold text-canvas transition-opacity active:opacity-80 disabled:opacity-40"
      >
        Open {side === 'LONG' ? 'long' : 'short'} {base}
        <span className="ml-1.5 text-body font-medium opacity-80">
          {trade ? (trade.block ? '· paused' : '· live · 2 steps') : '· demo'}
        </span>
      </button>

      <p className="mt-2.5 text-small leading-relaxed text-muted">
        {trade
          ? 'Live order on your Strike account: the confirm step shows both fees before it sends.'
          : 'Fills at the mark.'}{' '}
        {size.toLocaleString('en-US')} {base} of notional ${usd(notionalValue)}. Liquidation is
        first-tier and an estimate.
        {!feeRate.known && ' The venue fee schedule did not load, so 5 bps is an estimate.'}
      </p>
    </section>
  );
}
