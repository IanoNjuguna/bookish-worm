import { Card, CardLabel, Figure, Note } from '@/components/ui/card';
import { ada, count, percent } from '@/lib/format';
import type { Overview } from '@/lib/metrics';

/** Band 2 left: the levers that move band 1. Each one is a ratio with its denominator visible. */
export function Levers({ overview }: { overview: Overview }) {
  const perRelease = overview.releases === 0 ? 0 : overview.collects / overview.releases;
  const withCollects = overview.releases === 0 ? 0 : overview.releasedWithCollects / overview.releases;

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <CardLabel>Collects / release</CardLabel>
        <div className="mt-2 flex items-baseline gap-3">
          <Figure>{perRelease.toFixed(2)}</Figure>
          <Note>
            {count(overview.releasedWithCollects)} of {count(overview.releases)} releases
            collected ({percent(withCollects)})
          </Note>
        </div>
      </div>
      <div className="border-t border-midnight/[0.06] pt-4 dark:border-white/[0.06]">
        <CardLabel>Average price</CardLabel>
        <div className="mt-2 flex items-baseline gap-3">
          <Figure>
            {ada(overview.averageCollectAda)}
            <span className="ml-2 text-base text-midnight/50 dark:text-white/50">ADA</span>
          </Figure>
          <Note>
            {count(overview.pricedReleases)} of {count(overview.releases)} releases carry a
            readable price
          </Note>
        </div>
      </div>
    </Card>
  );
}
