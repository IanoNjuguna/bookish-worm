import { usd } from '../lib/format';
import type { Stats, Tier } from '../lib/progress';
import type { useIdentity } from '../hooks/useIdentity';
import { IdentityCard } from './you/IdentityCard';
import { RiskControls } from './you/RiskControls';

/**
 * "You" is the only tab that is about the trader rather than the market: what they hold,
 * how they have behaved, and the two dials that decide the next swipe.
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
}) {
  const pnl = equity - startEquity;

  return (
    <div className="mx-auto w-full max-w-[520px] space-y-3 px-4 pb-6 pt-4">
      <div className="px-1">
        <p className="text-micro uppercase tracking-[0.1em] text-muted">paper account</p>
        <p className="num text-hero leading-none text-fg">${usd(equity)}</p>
        <p className={pnl >= 0 ? 'num mt-1 text-body text-long' : 'num mt-1 text-body text-short'}>
          {pnl >= 0 ? '+' : '−'}${usd(Math.abs(pnl))} since you started
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { k: 'open', v: String(openPositions) },
          { k: 'clean closes', v: String(stats.cleanCloses) },
          { k: 'liquidations', v: String(stats.liquidations) },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-line bg-panel px-3 py-2.5">
            <p className="num text-[16px] text-fg">{s.v}</p>
            <p className="mt-0.5 text-[10px] text-muted">{s.k}</p>
          </div>
        ))}
      </div>

      <RiskControls
        risk={risk}
        leverage={leverage}
        tier={tier}
        onChange={(patch) => identity.update(patch)}
      />

      <IdentityCard
        me={identity.identity}
        onConnect={onOpenIdentity}
        onDisconnect={identity.disconnect}
      />

      <p className="px-1 pt-1 text-[11px] leading-relaxed text-muted">
        Paper trading. Prices come from Strike, the fills do not. A demo of a leverage
        interface is not an offering of leveraged derivatives.
      </p>
    </div>
  );
}
