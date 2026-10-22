import { useEffect, useState } from 'react';
import type { MarkPrice } from '../lib/types';
import type { MiniTicker } from '../hooks/useMiniTickers';
import type { VenueState } from '../lib/strike/venue-client';
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
  /** Present when a Strike session exists; the numbers it carries are the venue's. */
  venue?: VenueState | null;
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

/**
 * Age of the venue read, not a green dot. A balance that is four minutes old is still
 * useful; a balance that pretends to be current is not.
 */
function VenueAge({ state }: { state: VenueState }) {
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1_000);
    return () => clearInterval(id);
  }, []);

  if (state.status === 'reconnect') {
    return <span className="text-[9px] lowercase text-short">reconnect needed</span>;
  }
  if (!state.lastAt) {
    return <span className="text-[9px] lowercase text-muted">reading…</span>;
  }

  const age = Math.max(0, Math.round((Date.now() - state.lastAt) / 1000));
  const late = state.status === 'stale';
  const label =
    age < 1 ? 'just now' : age < 60 ? `${age}s ago` : `${Math.round(age / 60)}m ago`;

  return (
    <span className={cn('num text-[9px] lowercase', late ? 'text-short' : 'text-muted')}>
      {late ? `stale · ${label}` : `updated ${label}`}
    </span>
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
  venue = null,
}: Props) {
  const next = mark ? Math.max(0, mark.nextFundingTime - Date.now()) : 0;
  const hh = Math.floor(next / 3_600_000);
  const mm = Math.floor((next % 3_600_000) / 60_000);

  // A session means the account is real. Paper is only ever claimed when there is none.
  const live = Boolean(venue);
  const account = venue?.data?.account ?? null;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-panel px-2 sm:gap-3 sm:px-3">
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-[15px] font-bold tracking-tight">
          paps<span className="text-brand">.</span>
        </span>
        <span className="border border-brand/40 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-brand">
          {live ? 'live mainnet' : 'paper'}
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
            {live ? 'margin balance' : 'paper equity'}{' '}
            <span className="text-muted/70">· {live ? 'strike' : 'simulated'}</span>
          </span>
          <span className="num text-[12px]">
            {live ? (account ? `$${usd(account.marginBalance)}` : '—') : `$${usd(equity)}`}
          </span>
          {venue && <VenueAge state={venue} />}
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
