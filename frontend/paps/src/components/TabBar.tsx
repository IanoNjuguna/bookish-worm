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
 * A floating pill rather than a bar welded to the bottom edge: it reads as part of the
 * surface instead of as chrome, and it leaves room for the safe area on a phone.
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
    <nav className="pointer-events-none flex shrink-0 justify-center pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
      <div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-line/80 bg-panel/90 p-1 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={cn(
              'relative rounded-full px-3.5 py-2 text-[12px] transition-colors',
              tab === t.id ? 'bg-fg text-canvas' : 'text-muted hover:text-fg',
            )}
          >
            {t.label}
            {t.id === 'positions' && openPositions > 0 && (
              <span
                className={cn(
                  'num ml-1 text-[10px]',
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
