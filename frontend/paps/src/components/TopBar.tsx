import type { MiniTicker } from '../hooks/useMiniTickers';
import { price, pct } from '../lib/format';
import { cn } from '../lib/cn';
import { AgeBadge } from './AgeBadge';
import { IdentityMenu } from './IdentityMenu';
import type { useIdentity } from '../hooks/useIdentity';

/**
 * Four facts, no more: which market, what it costs, which way it moved today, and whether
 * that number is still fresh. Everything else a terminal would put here — mark, index,
 * funding, equity — belongs to the tab that acts on it.
 */
export function TopBar({
  symbol,
  ticker,
  lastAt,
  connected,
  identity,
  identityOpen,
  onIdentityOpen,
}: {
  symbol: string;
  ticker?: MiniTicker;
  lastAt: number;
  connected: boolean;
  identity: ReturnType<typeof useIdentity>;
  identityOpen: boolean;
  onIdentityOpen: (open: boolean) => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2.5 px-4">
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="text-[15px] font-semibold tracking-tight">{symbol}</span>
        <span className="text-[10px] uppercase tracking-[0.1em] text-muted">paper</span>
      </div>

      <div className="ml-auto flex items-baseline gap-2">
        <span className="num text-[16px] leading-none">{ticker ? price(ticker.last) : '—'}</span>
        <span
          className={cn(
            'num text-[12px]',
            (ticker?.pct ?? 0) >= 0 ? 'text-long' : 'text-short',
          )}
        >
          {ticker ? pct(ticker.pct) : '—'}
        </span>
      </div>

      <span className="flex items-center gap-2">
        <AgeBadge lastAt={lastAt} connected={connected} />
        <IdentityMenu
          identity={identity}
          open={identityOpen}
          onOpenChange={onIdentityOpen}
        />
      </span>
    </header>
  );
}
