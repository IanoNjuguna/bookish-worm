import { usd } from '../../lib/format';
import type { Stats } from '../../lib/progress';

/** Best and worst are single closes, so a negative carries a sign; the rest are plain. */
const signedUsd = (v: number): string => `${v < 0 ? '−' : ''}$${usd(Math.abs(v), 0)}`;

/**
 * Six numbers that describe behaviour rather than balance. Each tile is one fact, so a
 * trader can scan the column and see whether they are disciplined or just lucky.
 */
export function StatsGrid({ stats }: { stats: Stats }) {
  const tiles = [
    { k: 'rounds', v: String(stats.rounds) },
    { k: 'clean', v: String(stats.cleanCloses) },
    { k: 'liquidations', v: String(stats.liquidations) },
    { k: 'best', v: signedUsd(Math.max(stats.best, 0)) },
    { k: 'worst', v: signedUsd(Math.min(stats.worst, 0)) },
    { k: 'peak', v: `$${usd(stats.peak, 0)}` },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {tiles.map((t) => (
        <div key={t.k} className="rounded-card border border-line bg-panel px-3 py-2.5">
          <p className="num truncate text-body tabular-nums text-fg">{t.v}</p>
          <p className="mt-0.5 truncate text-micro text-muted">{t.k}</p>
        </div>
      ))}
    </div>
  );
}
