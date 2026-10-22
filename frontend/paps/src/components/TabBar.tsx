import { cn } from '../lib/cn';

export type Tab = 'deck' | 'trade' | 'positions' | 'you';

const TABS: { id: Tab; label: string }[] = [
  { id: 'deck', label: 'Deck' },
  { id: 'trade', label: 'Trade' },
  { id: 'positions', label: 'Positions' },
  { id: 'you', label: 'You' },
];

/**
 * Four tabs, four jobs: watch markets, take a view, manage what is open, manage yourself.
 *
 * A bar welded to the bottom edge, not a floating pill: square top corners, one hairline
 * in `line`, `panel` behind it. The tab is the control that carries the radius — the
 * shell stays a rectangle.
 */
export function TabBar({
  tab,
  onChange,
  openPositions,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  openPositions: number;
}) {
  return (
    <nav className="shrink-0 border-t border-line bg-panel px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-14 items-center gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={cn(
              'flex h-10 flex-1 items-center justify-center gap-1 rounded-control text-small transition-colors',
              tab === t.id ? 'bg-fg font-medium text-canvas' : 'text-muted hover:text-fg',
            )}
          >
            {t.label}
            {t.id === 'positions' && openPositions > 0 && (
              <span
                className={cn(
                  'num text-micro',
                  tab === t.id ? 'text-canvas/70' : 'text-brand',
                )}
              >
                {openPositions}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
