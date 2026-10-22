import { useEffect, useState } from 'react';
import { cn } from '../lib/cn';

/**
 * Data age, not socket state. A green dot that means "the websocket is open" tells a
 * trader everything except the thing they need to know.
 */
export function AgeBadge({ lastAt, connected }: { lastAt: number; connected: boolean }) {
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 500);
    return () => clearInterval(id);
  }, []);

  if (!connected) return <Dot tone="short" label="offline" />;
  if (!lastAt) return <Dot tone="muted" label="waiting" />;

  const age = (Date.now() - lastAt) / 1000;
  const tone = age < 5 ? 'muted' : age < 15 ? 'warn' : 'short';
  const text = age < 1 ? 'live' : `${age.toFixed(age < 10 ? 1 : 0)}s ago`;

  return <Dot tone={tone} label={text} />;
}

function Dot({ tone, label }: { tone: 'muted' | 'warn' | 'short'; label: string }) {
  return (
    <div className="flex items-center gap-1.5 border border-line px-1.5 py-1 sm:px-2" title={label}>
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          tone === 'muted' && 'bg-muted',
          tone === 'warn' && 'bg-short/60',
          tone === 'short' && 'bg-short',
        )}
      />
      <span
        className={cn(
          'num hidden text-[10px] lowercase sm:inline',
          tone === 'muted' && 'text-muted',
          tone === 'warn' && 'text-short/80',
          tone === 'short' && 'text-short',
        )}
      >
        {label}
      </span>
    </div>
  );
}
