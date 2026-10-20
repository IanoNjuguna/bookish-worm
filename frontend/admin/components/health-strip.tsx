import { Note } from '@/components/ui/card';
import { count } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Overview } from '@/lib/overview';

/**
 * The diagonal element. One line when the numbers are readable; it expands when a
 * signal fires, and deliberately breaks the Z when it is red.
 *
 * Only `collect_unpriced` has call sites today, so the other three read zero
 * because nothing writes them, not because nothing happened. The strip says which
 * is which instead of implying a clean bill of health.
 */
export function HealthStrip({ health }: { health?: Overview['health'] }) {
  const signals = health
    ? [
        { label: 'failed collects', value: health.collectFailed },
        { label: 'chain fallbacks', value: health.chainFallbacks },
        { label: 'API 5xx', value: health.api5xx },
        { label: 'unpriced collects', value: health.unpricedCollects },
      ]
    : null;

  return (
    <section
      aria-label="Health"
      className="flex flex-wrap items-center gap-x-5 gap-y-1 border-y border-midnight/[0.06] py-2 dark:border-white/[0.06]"
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-lavender">
        Health
      </span>
      {signals ? (
        signals.map((signal) => (
          <span key={signal.label} className="flex items-baseline gap-2">
            <span
              className={cn(
                'font-mono text-xs tabular-nums',
                signal.value > 0
                  ? 'text-red-400'
                  : 'text-midnight/55 dark:text-white/50',
              )}
            >
              {count(signal.value)}
            </span>
            <span className="text-[11px] uppercase tracking-[0.12em] text-midnight/45 dark:text-white/40">
              {signal.label}
            </span>
          </span>
        ))
      ) : (
        <Note>not instrumented — no metrics endpoint, so nothing here is being counted</Note>
      )}
    </section>
  );
}
