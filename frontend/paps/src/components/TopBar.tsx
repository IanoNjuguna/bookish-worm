import type { MarkPrice } from '../lib/types';
import type { MiniTicker } from '../hooks/useMiniTickers';
import { fundingApr, price, pct, usd } from '../lib/format';
import { cn } from '../lib/cn';
import { AgeBadge } from './AgeBadge';
import { IdentityMenu } from './IdentityMenu';
import type { useIdentity } from '../hooks/useIdentity';
import type { Tier } from '../lib/progress';

export type ViewMode = 'pro' | 'lite' | 'swipe';

type Props = {
  symbol: string;
  ticker?: MiniTicker;
  mark: MarkPrice | null;
  lastAt: number;
  equity: number;
  connected: boolean;
  mode: ViewMode;
  modes: ViewMode[];
  identity: ReturnType<typeof useIdentity>;
  tier: Tier;
  onMode: (m: ViewMode) => void;
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

/** Status bar: identity, environment, freshness, and the six numbers that matter. */
export function TopBar({
  symbol,
  ticker,
  mark,
  lastAt,
  equity,
  connected,
  mode,
  modes,
  onMode,
  identity,
  tier,
}: Props) {
  const next = mark ? Math.max(0, mark.nextFundingTime - Date.now()) : 0;
  const hh = Math.floor(next / 3_600_000);
  const mm = Math.floor((next % 3_600_000) / 60_000);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-panel px-2 sm:gap-3 sm:px-3">
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-[15px] font-bold tracking-tight">
          paps<span className="text-brand">.</span>
        </span>
        <span className="border border-brand/40 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-brand">
          paper
        </span>
      </div>

      <div className="flex min-w-0 shrink items-baseline gap-2 border-l border-line pl-2 sm:pl-3">
        <span className="text-[13px] font-semibold whitespace-nowrap">{symbol}</span>
        <span className="hidden text-[10px] uppercase tracking-[0.1em] text-muted sm:inline">perp</span>
      </div>

      <div className="flex min-w-0 items-baseline gap-2">
        <span className="num text-[15px]">{ticker ? price(ticker.last) : '—'}</span>
        <span
          className={cn(
            'num hidden text-[11px] sm:inline',
            (ticker?.pct ?? 0) >= 0 ? 'text-long' : 'text-short',
          )}
        >
          {ticker ? pct(ticker.pct) : '—'}
        </span>
      </div>

      <div className="hidden items-center gap-5 xl:flex">
        <Stat k="mark" v={mark ? price(mark.markPrice) : '—'} />
        <Stat k="index" v={mark ? price(mark.indexPrice) : '—'} />
        <Stat
          k="funding / apr"
          v={mark ? fundingApr(Number(mark.lastFundingRate)) : '—'}
          tone={mark ? (Number(mark.lastFundingRate) >= 0 ? 'long' : 'short') : undefined}
        />
        <Stat k="next funding" v={mark ? `${hh}h ${usd(mm, 0)}m` : '—'} />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <div className="hidden flex-col items-end leading-tight sm:flex">
          <span className="text-[10px] text-muted">
            paper equity <span className="text-muted/70">· simulated</span>
          </span>
          <span className="num text-[12px]">${usd(equity)}</span>
        </div>

        <span className="hidden sm:inline-flex">
          <AgeBadge lastAt={lastAt} connected={connected} />
        </span>

        <span className="hidden items-center gap-1 border border-line px-1.5 py-1 text-[10px] text-muted sm:flex">
          <span className="text-fg/80">{tier.name}</span>
          <span className="num">· {tier.maxLeverage}× max</span>
          {tier.maxPositions < 5 && <span className="num">· {tier.maxPositions} open</span>}
        </span>

        <IdentityMenu identity={identity} />

        <div className="hidden items-center border border-line sm:flex">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => onMode(m)}
              className={cn(
                'px-2 py-1 text-[10px] uppercase tracking-[0.08em] transition-colors',
                m === mode ? 'bg-panel-2 text-fg' : 'text-muted hover:text-fg',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
