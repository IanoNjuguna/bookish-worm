import { Card, CardLabel, Note } from '@/components/ui/card';
import { count } from '@/lib/format';
import type { Release } from '@/lib/api';

/** The population behaviour that drives the levers. Needs /admin/overview for identities. */
export function Conversion() {
  return (
    <Card className="flex flex-col gap-3">
      <CardLabel>Conversion</CardLabel>
      <p className="font-mono text-sm text-midnight/55 dark:text-white/50">
        listeners ▶ collectors
      </p>
      <Note>
        Needs distinct listener and collector identities in one window. `/songs` exposes
        aggregate counts only, so this card renders its empty state rather than a
        fabricated ratio.
      </Note>
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
