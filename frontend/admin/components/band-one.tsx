import { Card, CardLabel, Figure, Note } from '@/components/ui/card';
import { ada, count } from '@/lib/format';
import type { Overview } from '@/lib/metrics';

/**
 * Band 1 is a causal pair: what a fan spends on the left, what we keep on the right,
 * with the fee rate between them as the arrow rather than as a third card.
 * The right-hand number is the hero, so it carries the display weight.
 */
export function BandOne({ overview }: { overview: Overview }) {
  const feeRate = null; // measured once fee_lovelace is recorded (spec section 4)

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
      <Card>
        <CardLabel>Fan spend / collect</CardLabel>
        <div className="mt-3">
          <Figure>
            {ada(overview.averageCollectAda)}
            <span className="ml-2 text-base text-midnight/50 dark:text-white/50">ADA</span>
          </Figure>
        </div>
        <div className="mt-3 space-y-1">
          <Note>
            {count(overview.collects)} collects across{' '}
            {count(overview.releasedWithCollects)} releases
          </Note>
          <Note>{ada(overview.gmvAda)} ADA recorded in total</Note>
        </div>
      </Card>

      <div className="hidden flex-col items-center justify-center gap-1 lg:flex">
        <span className="font-mono text-sm tabular-nums text-midnight/70 dark:text-white/70">
          {feeRate === null ? 'not recorded' : `${(feeRate * 100).toFixed(1)}%`}
        </span>
        <span className="text-[11px] uppercase tracking-[0.15em] text-midnight/40 dark:text-white/40">
          fee
        </span>
        <span aria-hidden className="text-midnight/30 dark:text-white/30">
          ▶
        </span>
      </div>

      <Card>
        <CardLabel>Our take / collect</CardLabel>
        <div className="mt-3">
          <Figure quiet>—</Figure>
        </div>
        <div className="mt-3 space-y-1">
          <Note>Fee per collect is not recorded yet</Note>
          <Note>
            The splitter takes a per-release fee in basis points, so take is read from
            each transaction, never derived from price (spec section 4)
          </Note>
        </div>
      </Card>
    </section>
  );
}
