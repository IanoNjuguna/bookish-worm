import { Card, CardLabel, Note } from '@/components/ui/card';
import { ada, count, percent } from '@/lib/format';
import { shortenAddress, type FanRow } from '@/lib/summary';

/**
 * Concentration, in one card: who spent, how much, and what share. At seven
 * collectors the top row is the story, which is why the bar is here and not a
 * third decimal on a percentage.
 */
export function FansList({ fans }: { fans: FanRow[] | null }) {
  return (
    <Card className="flex flex-col gap-3">
      <CardLabel>Fans by value</CardLabel>
      {!fans || fans.length === 0 ? (
        <Note>
          {fans === null
            ? 'No metrics endpoint, so nothing is ranked here rather than a list of zeroes.'
            : 'No collect in this window.'}
        </Note>
      ) : (
        <ul className="divide-y divide-midnight/[0.06] dark:divide-white/[0.06]">
          {fans.map((fan) => (
            <li key={fan.address} className="flex items-center gap-4 py-2">
              <span className="w-28 shrink-0 font-mono text-xs text-midnight/70 dark:text-white/70">
                {shortenAddress(fan.address)}
              </span>
              <span className="w-20 shrink-0 font-mono text-xs tabular-nums text-midnight/60 dark:text-white/50">
                {count(fan.collects)}×
              </span>
              <span className="w-24 shrink-0 font-mono text-sm tabular-nums text-midnight dark:text-white">
                {ada(fan.spendLovelace / 1_000_000)} ADA
              </span>
              <span className="flex flex-1 items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-midnight/[0.06] dark:bg-white/[0.08]">
                  <span
                    className="block h-full rounded-full bg-chart-1"
                    style={{ width: `${Math.max(fan.share * 100, 2)}%` }}
                  />
                </span>
                <span className="w-10 text-right font-mono text-[11px] tabular-nums text-midnight/50 dark:text-white/50">
                  {percent(fan.share)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
