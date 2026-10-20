import { BandOne } from '@/components/band-one';
import { Conversion, ReleaseList } from '@/components/evidence';
import { HealthStrip } from '@/components/health-strip';
import { Heatmap } from '@/components/heatmap';
import { Levers } from '@/components/levers';
import { Card, CardLabel, Note } from '@/components/ui/card';
import { getReleases } from '@/lib/api';
import { count } from '@/lib/format';
import { summarize } from '@/lib/metrics';
import { ThemeToggle } from '@/components/theme-toggle';
import { getTimeline } from '@/lib/timeline';
import { summarizeHeatmap } from '@/lib/heatmap';
import { getOverview } from '@/lib/overview';

export const dynamic = 'force-dynamic';

function Stat({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[11px] uppercase tracking-[0.15em] text-midnight/45 dark:text-white/45">
        {term}
      </dt>
      <dd className="font-mono text-sm tabular-nums text-midnight dark:text-white">{value}</dd>
    </div>
  );
}

export default async function OverviewPage() {
  const [releases, timeline, metrics] = await Promise.all([
    getReleases(),
    getTimeline(),
    getOverview(),
  ]);
  const overview = summarize(releases);
  const heat = summarizeHeatmap(timeline.days);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-6">
          <span className="text-sm font-semibold text-midnight dark:text-white">doba admin</span>
          <nav className="flex gap-4 text-xs uppercase tracking-[0.15em]">
            <span className="text-midnight dark:text-white">Overview</span>
            <span className="text-midnight/40 dark:text-white/40">Releases</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full border border-midnight/[0.08] px-2 py-0.5 font-mono text-[11px] text-midnight/60 dark:border-white/[0.1] dark:text-white/60">
            30d
          </span>
          <ThemeToggle />
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            prod
          </span>
        </div>
      </header>

      <p className="text-xs text-midnight/55 dark:text-white/50">
        {count(overview.releases)} releases · {count(overview.releasedWithCollects)} with
        collects · {count(overview.minted)} fractions stated · {count(overview.collects)}{' '}
        collects
      </p>

      <BandOne summary={overview} metrics={metrics} />
      <HealthStrip health={metrics?.health} />

      <section className="grid gap-4 lg:grid-cols-2">
        <Levers overview={overview} />
        <Conversion metrics={metrics} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <CardLabel>Fans by value</CardLabel>
          <Note>
            Needs per-collector totals. `/songs` returns aggregates, so there is nothing
            honest to rank here yet.
          </Note>
        </Card>
        <ReleaseList releases={releases} />
      </section>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <CardLabel>Collects per day, 12 weeks</CardLabel>
          <Note>EAT days · absence is blank, not zero</Note>
        </div>
        {timeline.available ? (
          <div className="flex flex-wrap items-start justify-between gap-8">
            <Heatmap days={timeline.days} label="Collects per day over the last twelve weeks" />
            <dl className="flex gap-8">
              <Stat term="collects" value={count(heat.total)} />
              <Stat term="active days" value={count(heat.activeDays)} />
              <Stat term="busiest" value={heat.busiestWeekday ?? '—'} />
            </dl>
          </div>
        ) : (
          <Note>
            core-api does not serve `/admin/timeline` yet, so this renders an empty
            state instead of a grid of invented squares.
          </Note>
        )}
      </Card>
    </main>
  );
}
