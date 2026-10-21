import type { MarkPrice } from '../lib/types';
import type { MiniTicker } from '../hooks/useMiniTickers';
import { fundingApr, price, pct, usd } from '../lib/format';
import { cn } from '../lib/cn';

type Props = {
  symbol: string;
  ticker?: MiniTicker;
  mark: MarkPrice | null;
  equity: number;
  connected: boolean;
};

function Stat({ k, v, tone }: { k: string; v: string; tone?: 'long' | 'short' }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-[10px] text-muted">{k}</span>
      <span className={cn('num text-[12px]', tone === 'long' && 'text-long', tone === 'short' && 'text-short')}>
        {v}
      </span>
    </div>
  );
}

/** Header: identity, environment, and the six numbers a trader checks first. */
export function TopBar({ symbol, ticker, mark, equity, connected }: Props) {
  const next = mark ? Math.max(0, mark.nextFundingTime - Date.now()) : 0;
  const hh = Math.floor(next / 3_600_000);
  const mm = Math.floor((next % 3_600_000) / 60_000);

  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-line bg-panel px-3">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-bold tracking-tight">
          paps<span className="text-brand">.</span>
        </span>
        <span className="border border-brand/40 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-brand">
          paper
        </span>
      </div>

      <div className="flex items-baseline gap-2 border-l border-line pl-4">
        <span className="text-[14px] font-semibold">{symbol}</span>
        <span className="text-[10px] uppercase tracking-[0.1em] text-muted">perpetual</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="num text-[16px]">{ticker ? price(ticker.last) : '—'}</span>
        <span className={cn('num text-[11px]', (ticker?.pct ?? 0) >= 0 ? 'text-long' : 'text-short')}>
          {ticker ? pct(ticker.pct) : '—'}
        </span>
      </div>

      <div className="hidden items-center gap-5 lg:flex">
        <Stat k="mark" v={mark ? price(mark.markPrice) : '—'} />
        <Stat k="index" v={mark ? price(mark.indexPrice) : '—'} />
        <Stat
          k="funding / apr"
          v={mark ? fundingApr(Number(mark.lastFundingRate)) : '—'}
          tone={mark ? (Number(mark.lastFundingRate) >= 0 ? 'long' : 'short') : undefined}
        />
        <Stat k="next funding" v={mark ? `${hh}h ${usd(mm, 0)}m` : '—'} />
        <Stat k="24h vol" v={ticker ? `$${(ticker.quoteVolume / 1e6).toFixed(2)}M` : '—'} />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[10px] text-muted">paper equity</span>
          <span className="num text-[12px]">${usd(equity)}</span>
        </div>
        <div className="flex items-center gap-1.5 border border-line px-2 py-1">
          <span className={cn('h-1.5 w-1.5 rounded-full', connected ? 'bg-long' : 'bg-short')} />
          <span className="text-[10px] uppercase tracking-[0.1em] text-muted">
            {connected ? 'live' : 'offline'}
          </span>
        </div>
      </div>
    </header>
  );
}
