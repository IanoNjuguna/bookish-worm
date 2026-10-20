import { Note } from '@/components/ui/card';

const SIGNALS = [
  'failed collects',
  'chain fallbacks',
  'API 5xx',
  'supply drift',
] as const;

/**
 * The diagonal element. One line when everything is instrumented and green;
 * it expands when a signal fires, and deliberately breaks the Z when it is red.
 * Today nothing is instrumented, so it says so instead of showing four zeros.
 */
export function HealthStrip() {
  return (
    <section
      aria-label="Health"
      className="flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-midnight/[0.06] py-2 dark:border-white/[0.06]"
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-lavender">
        Health
      </span>
      <span className="font-mono text-xs tabular-nums text-midnight/55 dark:text-white/50">
        not instrumented
      </span>
      <Note>
        {SIGNALS.join(' · ')} — each needs an events row before this line can be trusted
      </Note>
    </section>
  );
}
