import { usd } from '../../lib/format';
import type { Tier } from '../../lib/progress';

const RISK_STEPS = [25, 50, 100, 200];
const LEV_STEPS = [2, 3, 5, 10];

/**
 * Two numbers decide what a swipe does: how much of the account is at risk, and how much
 * it is geared. Written in money and multiples, capped by tier, because the ceiling is
 * earned rather than offered. Chrome-free: the disclosure that holds it is the card.
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
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-body text-fg">each swipe risks</span>
        <span className="num text-body text-fg">${usd(risk, 0)}</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {RISK_STEPS.map((r) => (
          <button
            key={r}
            onClick={() => onChange({ riskUsd: r })}
            className={
              'num flex-1 rounded-control py-1.5 text-body transition-colors ' +
              (r === risk ? 'bg-fg text-canvas' : 'bg-panel-2 text-muted hover:text-fg')
            }
          >
            ${r}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-body text-fg">leverage</span>
        <span className="num text-body text-fg">{leverage}×</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {LEV_STEPS.map((l) => {
          const locked = l > tier.maxLeverage;
          return (
            <button
              key={l}
              disabled={locked}
              onClick={() => onChange({ leverage: l })}
              title={locked ? `${l}× unlocks at a higher tier` : undefined}
              className={
                'num flex-1 rounded-control py-1.5 text-body transition-colors ' +
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
      <p className="mt-2 text-small text-muted">{tier.maxLeverage}× is your ceiling on {tier.name}</p>
    </div>
  );
}
