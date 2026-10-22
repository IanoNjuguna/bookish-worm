import { IconCheck } from '@tabler/icons-react';
import type { Stats } from '../../lib/progress';

type Badge = {
  id: string;
  label: string;
  title: string;
  test: (s: Stats, startEquity: number) => boolean;
};

/**
 * Badges are a read of the stats already stored, never a separate counter: no state,
 * no storage, nothing to get out of sync. Every rule below is a statement about numbers
 * this app actually keeps.
 */
const BADGES: Badge[] = [
  { id: 'green', label: 'first green', title: 'closed a position in profit', test: (s) => s.cleanCloses >= 1 },
  { id: 'five', label: 'five clean', title: 'closed five positions in profit', test: (s) => s.cleanCloses >= 5 },
  { id: 'unbroken', label: 'unbroken', title: 'ten rounds without a single liquidation', test: (s) => s.rounds >= 10 && s.liquidations === 0 },
  { id: 'ten', label: 'ten rounds', title: 'finished ten rounds', test: (s) => s.rounds >= 10 },
  { id: 'high', label: 'new high', title: 'peaked above the balance this account started with', test: (s, startEquity) => s.peak > startEquity },
];

export function Achievements({ stats, startEquity }: { stats: Stats; startEquity: number }) {
  return (
    <div className="rounded-card border border-line bg-panel p-4">
      <span className="text-small text-muted">badges</span>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {BADGES.map((b) => {
          const earned = b.test(stats, startEquity);
          return (
            <span
              key={b.id}
              title={`${b.title}${earned ? ' — earned' : ' — not yet'}`}
              className={
                earned
                  ? 'inline-flex items-center gap-1 rounded-chip bg-panel-2 px-2 py-1 text-small text-fg'
                  : 'inline-flex items-center gap-1 rounded-chip border border-line px-2 py-1 text-small text-muted'
              }
            >
              {earned && <IconCheck size={11} stroke={2.5} className="shrink-0" />}
              {b.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
