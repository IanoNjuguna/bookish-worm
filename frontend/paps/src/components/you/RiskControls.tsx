import { usd } from '../../lib/format';
import type { Tier } from '../../lib/progress';

const RISK_STEPS = [25, 50, 100, 200];
const LEV_STEPS = [2, 3, 5, 10];

/**
 * Two numbers decide what a swipe does: how much of the account is at risk, and how much
 * it is geared. Written in money and multiples, capped by tier, because the ceiling is
 * earned rather than offered.
 */
export function RiskControls({
  risk,
  leverage,
  tier,
  onChange,
}: {
  risk: number;
  leverage: number;
  tier: Tier;
  onChange: (patch: { riskUsd?: number; leverage?: number }) => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[13px] text-fg">Each swipe risks</h2>
        <span className="num text-[13px] text-fg">${usd(risk, 0)}</span>
      </div>
      <div className="mt-2.5 flex gap-1.5">
        {RISK_STEPS.map((r) => (
          <button
            key={r}
            onClick={() => onChange({ riskUsd: r })}
            className={
              'flex-1 rounded-lg py-1.5 text-[12px] ' +
              (r === risk ? 'bg-fg text-canvas' : 'bg-panel-2 text-muted hover:text-fg')
            }
          >
            ${r}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h2 className="text-[13px] text-fg">Leverage</h2>
        <span className="num text-[13px] text-fg">{leverage}×</span>
      </div>
      <div className="mt-2.5 flex gap-1.5">
        {LEV_STEPS.map((l) => {
          const locked = l > tier.maxLeverage;
          return (
            <button
              key={l}
              disabled={locked}
              onClick={() => onChange({ leverage: l })}
              className={
                'flex-1 rounded-lg py-1.5 text-[12px] ' +
                (locked
                  ? 'cursor-not-allowed bg-panel-2/40 text-muted/40'
                  : l === leverage
                    ? 'bg-fg text-canvas'
                    : 'bg-panel-2 text-muted hover:text-fg')
              }
            >
              {l}×
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-muted">
        {tier.name} · up to {tier.maxLeverage}× and {tier.maxPositions} open at once
      </p>
    </div>
  );
}
