import { BandOne } from '@/components/band-one';
import { Conversion, ReleaseList } from '@/components/evidence';
import { HealthStrip } from '@/components/health-strip';
import { Levers } from '@/components/levers';
import { Card, CardLabel, Note } from '@/components/ui/card';
import { getReleases } from '@/lib/api';
import { count } from '@/lib/format';
import { summarize } from '@/lib/metrics';
import { ThemeToggle } from '@/components/theme-toggle';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const releases = await getReleases();
  const overview = summarize(releases);

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

      <BandOne overview={overview} />
      <HealthStrip />

      <section className="grid gap-4 lg:grid-cols-2">
        <Levers overview={overview} />
        <Conversion />
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

      <Card className="flex flex-col gap-2">
        <CardLabel>Take and spend, 12 weeks</CardLabel>
        <Note>
          No history table yet: charts read `metrics_daily` once the rollup exists, so
          this renders an empty state instead of a fake series.
        </Note>
      </Card>
    </main>
  );
}
