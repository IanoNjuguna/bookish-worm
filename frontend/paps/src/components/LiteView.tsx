import { price, usd } from '../lib/format';
import type { Side } from '../lib/order';
import type { SymbolInfo } from '../lib/types';
import type { Bar } from '../hooks/useKlines';
import type { TradeApi } from '../hooks/useVenueTrade';
import { ChartPanel } from './Chart';
import type { Interval } from '../lib/constants';
import { IconChevronDown } from '@tabler/icons-react';
import { LiteTicket } from './LiteTicket';

type Props = {
  symbol: string;
  info: SymbolInfo | undefined;
  mark: number;
  equity: number;
  changePct: number;
  bars: Bar[];
  interval: Interval;
  onInterval: (i: Interval) => void;
  chartError: string | null;
  initialRisk?: number;
  initialLeverage?: number;
  maxLeverage?: number;
  onOpenMarkets: () => void;
  /** Funding rate for this market, per funding window. */
  fundingRate?: number;
  /** The venue's margin balance, present only when a Strike session exists. */
  liveBalance?: string | null;
  /** Present for a connected account: the ticket arms a live order instead of a demo one. */
  trade?: TradeApi | null;
  onPlace: (o: { side: Side; kind: 'limit' | 'market'; price: number; size: number; leverage: number }) => void;
};

/**
 * Lite: the whole Trade tab. One column, price first, a chart that fits, then the ticket.
 * Same engine as Pro, no separate state.
 */
export function LiteView({
  symbol,
  info,
  mark,
  equity,
  changePct,
  bars,
  interval,
  onInterval,
  chartError,
  initialRisk,
  initialLeverage,
  maxLeverage = 50,
  fundingRate,
  liveBalance = null,
  trade = null,
  onOpenMarkets,
  onPlace,
}: Props) {
  const [base, quote] = symbol.split('-');

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[520px] flex-col gap-4 px-4 pb-4 pt-3">
      {/* Account context, not a hero: the price below is what the eye should land on. */}
      <div className="flex items-baseline justify-between text-small text-muted">
        {liveBalance !== null ? (
          <span>
            Account <span className="num text-body text-fg">${usd(liveBalance)}</span>
          </span>
        ) : (
          <span>
            Demo equity <span className="num text-body text-fg">${usd(equity)}</span>
          </span>
        )}
        {/* The account is real and the order is still simulated: say both, not just one. */}
        <span className="text-muted">{liveBalance !== null ? 'strike · demo orders' : 'demo · simulated'}</span>
      </div>

      <div className="flex items-end justify-between gap-3">
        <button
          onClick={onOpenMarkets}
          aria-label={`Change market, currently ${symbol}`}
          className="flex min-h-[44px] items-center gap-1.5 rounded-control bg-panel-2 px-3.5 py-2 text-title font-medium text-fg transition-colors active:bg-panel"
        >
          {base}
          {quote ? <span className="text-small font-normal text-muted">{quote}</span> : null}
          <IconChevronDown size={14} className="text-muted" />
        </button>

        <div className="text-right">
          <div className="num text-hero">{mark ? price(mark) : '—'}</div>
          <div className="num mt-1.5 text-body">
            <span className={changePct >= 0 ? 'text-long' : 'text-short'}>
              {changePct >= 0 ? '+' : '−'}
              {Math.abs(changePct).toFixed(2)}%
            </span>
            <span className="ml-1 text-muted">24h</span>
          </div>
        </div>
      </div>

      {/* The chart's own surface is the panel: no second frame around it, and capped at
          150px on a phone so the ticket starts above the fold. It is a flex column
          because a percentage height inside a min-height parent resolves to auto — the
          chart collapsed to 2px until this became flex, and `h-full` must not come back
          here for the same reason. No `flex-1`: the cap is the point. */}
      <div className="flex min-h-[150px] max-h-[190px] flex-col overflow-hidden rounded-card bg-panel">
        <ChartPanel bars={bars} interval={interval} onInterval={onInterval} error={chartError} />
      </div>

      <LiteTicket
        symbol={symbol}
        info={info}
        mark={mark}
        equity={equity}
        initialRisk={initialRisk}
        initialLeverage={initialLeverage}
        maxLeverage={maxLeverage}
        fundingRate={fundingRate}
        trade={trade}
        onPlace={onPlace}
      />
    </div>
  );
}
