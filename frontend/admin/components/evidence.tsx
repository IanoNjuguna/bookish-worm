import { Card, CardLabel, Note } from '@/components/ui/card';
import { count, percent } from '@/lib/format';
import type { Overview } from '@/lib/overview';
import { conversion } from '@/lib/summary';
import type { Release } from '@/lib/api';

/** The population behaviour that drives the levers. */
export function Conversion({ metrics }: { metrics: Overview | null }) {
  const fans = metrics?.fans;
  const rate = fans ? conversion(fans.collectors, fans.listeners) : null;
  // above 1 the ratio is a windowing artefact, so the note explains instead of the number
  const inverted = Boolean(fans && fans.listeners > 0 && fans.collectors > fans.listeners);

  return (
    <Card className="flex flex-col gap-3">
      <CardLabel>Conversion</CardLabel>
      {fans ? (
        <>
          <p className="font-mono text-sm tabular-nums text-midnight dark:text-white">
            listeners {count(fans.listeners)} ▶ collectors {count(fans.collectors)}{' '}
            <span className="text-midnight/50 dark:text-white/50">
              {rate !== null && rate <= 1 ? percent(rate) : '—'}
            </span>
          </p>
          {inverted ? (
            <Note>
              More collectors than listeners in this window: some collected before they
              listened, so the ratio would read above 100% and lie
            </Note>
          ) : (
            <Note>
              {count(fans.zeroRevenue)} of {count(fans.total)} fans heard a track and never
              collected
            </Note>
          )}
          <Note>signed-in listeners only · identity is required to play</Note>
        </>
      ) : (
        <>
          <p className="font-mono text-sm text-midnight/55 dark:text-white/50">
            listeners ▶ collectors
          </p>
          <Note>
            Needs distinct listener and collector identities in one window. `/songs`
            exposes aggregate counts only, so this card renders its empty state rather
            than a fabricated ratio.
          </Note>
        </>
      )}
    </Card>
  );
}

/** Evidence zone: releases ranked by what they actually collected. */
export function ReleaseList({ releases }: { releases: Release[] }) {
  const ranked = [...releases].sort((a, b) => b.mint_count - a.mint_count).slice(0, 8);

  return (
    <Card className="flex flex-col gap-3">
      <CardLabel>Releases by collects</CardLabel>
      <ul className="divide-y divide-midnight/[0.06] dark:divide-white/[0.06]">
        {ranked.map((release) => (
          <li key={release.token_id} className="flex items-baseline justify-between gap-4 py-2">
            <span className="truncate text-sm text-midnight dark:text-white">
              {release.name}
            </span>
            <span className="font-mono text-sm tabular-nums text-midnight/70 dark:text-white/70">
              {count(release.mint_count)}
              <span className="ml-2 text-midnight/40 dark:text-white/40">
                {release.price ? `${release.price} ADA` : 'no price'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
