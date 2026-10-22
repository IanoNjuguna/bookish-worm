import { usd } from '../lib/format';
import type { Stats, Tier } from '../lib/progress';
import type { useIdentity } from '../hooks/useIdentity';
import { ProfileHeader } from './you/ProfileHeader';
import { StatsGrid } from './you/StatsGrid';
import { RiskSettings } from './you/RiskSettings';
import { TierProgress } from './you/TierProgress';
import { Achievements } from './you/Achievements';
import { Watchlist } from './you/Watchlist';
import { AccountActions } from './you/AccountActions';

/**
 * "You" is the only tab that is about the trader rather than the market: what they have
 * done, what they have earned, and the two dials that decide the next swipe.
 */
export function YouView({
  identity,
  equity,
  startEquity,
  tier,
  stats,
  risk,
  leverage,
  openPositions,
  onOpenIdentity,
  onOpenHowItWorks,
}: {
  identity: ReturnType<typeof useIdentity>;
  equity: number;
  startEquity: number;
  tier: Tier;
  stats: Stats;
  risk: number;
  leverage: number;
  openPositions: number;
  onOpenIdentity: () => void;
  onOpenHowItWorks?: () => void;
}) {
  const pnl = equity - startEquity;

  return (
    <div className="mx-auto w-full max-w-[520px] space-y-3 px-4 pb-24 pt-4">
      <ProfileHeader
        handle={identity.profile.handle}
        address={identity.identity?.address ?? null}
        wallet={identity.identity?.wallet ?? null}
        tier={tier}
        onRename={identity.update}
        onConnect={onOpenIdentity}
      />

      <div className="px-1">
        <p className="text-micro uppercase tracking-[0.1em] text-muted">demo account</p>
        <p className="num text-hero leading-none text-fg">${usd(equity)}</p>
        <p className={pnl >= 0 ? 'num mt-1 text-body text-long' : 'num mt-1 text-body text-short'}>
          {pnl >= 0 ? '+' : '−'}${usd(Math.abs(pnl))} since you started
        </p>
      </div>

      <RiskSettings
        risk={risk}
        leverage={leverage}
        tier={tier}
        onChange={(patch) => identity.update(patch)}
      />

      <StatsGrid stats={stats} />
      <TierProgress stats={stats} tier={tier} openPositions={openPositions} />
      <Achievements stats={stats} startEquity={startEquity} />
      <Watchlist symbols={identity.profile.watchlist} onToggle={identity.watch} />

      {onOpenHowItWorks && (
        <button
          onClick={onOpenHowItWorks}
          className="w-full rounded-card border border-line bg-panel px-4 py-3 text-left text-small text-fg"
        >
          how this works
          <span className="ml-2 text-muted">leverage, liquidation, funding</span>
        </button>
      )}
      <AccountActions
        signedIn={Boolean(identity.identity)}
        onSignOut={identity.disconnect}
        onReset={identity.reset}
      />

      <p className="px-1 pt-1 text-[11px] leading-relaxed text-muted">
        Demo trading. Prices come from Strike, the fills do not. A demo of a leverage
        interface is not an offering of leveraged derivatives.
      </p>
    </div>
  );
}
