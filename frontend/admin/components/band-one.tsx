import { Card, CardLabel, Figure, Note } from '@/components/ui/card';
import { ada, count, percent } from '@/lib/format';
import type { Overview as LocalSummary } from '@/lib/metrics';
import type { Overview as ChainOverview } from '@/lib/overview';

/**
 * Band 1 is a causal pair: what a fan spends on the left, what we keep on the right,
 * with the realised fee as the arrow between them rather than as a third card.
 *
 * Both figures come from `mints.price_lovelace` / `fee_lovelace`, read off the
 * chain per transaction. When that data is missing the card shows a dash and says
 * why; it never derives take from price, because the fee is a per-release
 * validator parameter and the seven existing collects prove it varies.
 */
export function BandOne({
  summary,
  metrics,
}: {
  summary: LocalSummary;
  metrics: ChainOverview | null;
}) {
  const money = metrics?.money;
  const fans = metrics?.fans.total ?? summary.collects;
  const feeRate =
    money && money.gmvLovelace > 0 ? money.takeLovelace / money.gmvLovelace : null;

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
      <Card>
        <CardLabel>Fan spend / fan</CardLabel>
        <div className="mt-3">
          {money?.spendPerFanLovelace != null ? (
            <Figure>
              {ada(money.spendPerFanLovelace / 1_000_000)}
              <span className="ml-2 text-base text-midnight/50 dark:text-white/50">ADA</span>
            </Figure>
          ) : (
            <Figure quiet>—</Figure>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <Note>
            {count(money?.collects ?? summary.collects)} collects across{' '}
            {count(metrics?.levers.releasesWithCollects ?? summary.releasedWithCollects)} releases
          </Note>
          <Note>
            {money
              ? `${count(fans)} fans in the window, ${count(metrics!.fans.zeroRevenue)} of them unheard-and-uncollected`
              : 'No metrics endpoint yet, so this reads the public catalogue only'}
          </Note>
        </div>
      </Card>

      <div className="hidden flex-col items-center justify-center gap-1 lg:flex">
        <span className="font-mono text-sm tabular-nums text-midnight/70 dark:text-white/70">
          {feeRate === null ? 'not recorded' : percent(feeRate)}
        </span>
        <span className="text-[11px] uppercase tracking-[0.15em] text-midnight/40 dark:text-white/40">
          fee
        </span>
        <span aria-hidden className="text-midnight/30 dark:text-white/30">
          ▶
        </span>
      </div>

      <Card>
        <CardLabel>Our take / fan</CardLabel>
        <div className="mt-3">
          {money?.takePerFanLovelace != null ? (
            <Figure>
              {ada(money.takePerFanLovelace / 1_000_000)}
              <span className="ml-2 text-base text-midnight/50 dark:text-white/50">ADA</span>
            </Figure>
          ) : (
            <Figure quiet>—</Figure>
          )}
        </div>
        <div className="mt-3 space-y-1">
          {money ? (
            <>
              <Note>
                median {money.medianSpendLovelace != null ? ada(money.medianSpendLovelace / 1e6) : '—'}{' '}
                ADA spent per collector
              </Note>
              <Note>
                top fan {money.topFanShare != null ? percent(money.topFanShare) : '—'} of spend
                {money.unpricedCollects > 0
                  ? ` · ${count(money.unpricedCollects)} collect(s) unpriced`
                  : ''}
              </Note>
            </>
          ) : (
            <Note>
              Fee per collect is not recorded yet: the splitter takes a per-release fee
              in basis points, so take is read from each transaction, never from price
            </Note>
          )}
        </div>
      </Card>
    </section>
  );
}
