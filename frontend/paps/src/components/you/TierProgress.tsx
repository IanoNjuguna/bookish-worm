import { effectiveClean, nextTier, type Stats, type Tier } from '../../lib/progress';

/**
 * One bar, one objective. Progress is measured in clean closes because that is what
 * tiers are actually earned by; a liquidation costs one clean close and the caption
 * says so rather than letting the bar look arbitrary.
 */
export function TierProgress({
  stats,
  tier,
  openPositions,
}: {
  stats: Stats;
  tier: Tier;
  openPositions: number;
}) {
  const next = nextTier(stats);
  const clean = effectiveClean(stats);
  const span = next ? next.needs - tier.needs : 0;
  const done = next ? Math.min(Math.max(clean - tier.needs, 0), span) : 0;
  const pct = span > 0 ? Math.round((done / span) * 100) : 0;

  return (
    <div className="rounded-card border border-line bg-panel p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-small text-muted">tier</span>
        <span className="num text-small text-fg">{tier.name}</span>
      </div>

      <p className="mt-1 text-body text-fg">
        up to {tier.maxLeverage}× leverage · {openPositions} of {tier.maxPositions} open
      </p>

      {next ? (
        <>
          <div
            role="progressbar"
            aria-label={`progress to ${next.name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="mt-3 h-1 overflow-hidden rounded-chip bg-panel-2"
          >
            <div className="h-full rounded-chip bg-accent" style={{ width: `${pct}%` }} />
          </div>
          <p
            className="mt-2 text-small text-muted"
            title="A liquidation takes one clean close off the total, it does not wipe the progress."
          >
            {clean} of {next.needs} clean closes · {next.name} unlocks {next.maxLeverage}× and{' '}
            {next.maxPositions} open
          </p>
        </>
      ) : (
        <p className="mt-2 text-body text-fg">
          {tier.name} is the top tier. Nothing above it to unlock.
        </p>
      )}
    </div>
  );
}
