import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/doba/PageLayout';
import { Hero } from '@/components/paps/Hero';
import { FeaturePanels } from '@/components/paps/FeaturePanels';
import { RiskLab } from '@/components/paps/RiskLab';
import { useReveal } from '@/components/paps/motion';
import { papsApp, papsLanding } from '@/lib/site';

const REPO = 'https://github.com/IanoNjuguna/bookish-worm/tree/main/frontend/paps';

const NOTS = [
  [
    'It is not only paper',
    'Without signing in, every fill is simulated at the live mark and nothing is sent to a venue. Connect a wallet and a swipe arms a real Strike order, confirmed in two steps, with real funds behind it.',
  ],
  ['It is not custody', 'There is no deposit, no wallet connection required, and no key held in the browser.'],
  ['It is not advice', 'A demo of a leverage interface is not an offering of leveraged derivatives.'],
  ['It is not free of charges', 'Paper positions still pay the venue’s fee and funding, so the PnL you see is the PnL you would get.'],
];

export default function Paps() {
  const riskRef = useReveal<HTMLDivElement>({ y: 20 });
  const notRef = useReveal<HTMLDivElement>({ y: 20 });

  return (
    <>
      <Helmet>
        <title>paps | perps, with the risk written down</title>
        <meta
          name="description"
          content="Trade perpetuals on a phone with $10,000 of paper money on live Strike prices. See the liquidation price before you swipe."
        />
        <meta property="og:title" content="paps | perps, with the risk written down" />
        <meta
          property="og:description"
          content="Swipe a market, see where you'd be closed out, trade it with paper money on live prices."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={papsLanding} />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="paps | perps, with the risk written down" />
        <meta
          name="twitter:description"
          content="Swipe a market, see where you'd be closed out, trade it with paper money on live prices."
        />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href={papsLanding} />
      </Helmet>

      {/* px-0 and the page's own section padding: the paps grid is 5xl with its own
          gutters, and PageLayout's main would add a second set inside it. */}
      <PageLayout maxWidth="5xl" className="px-0 pb-0 pt-16 sm:pt-20">
        <Hero />

        <section id="how" className="mx-auto w-full max-w-5xl scroll-mt-24 px-5 pt-20 sm:px-8 sm:pt-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paps-muted">how it works</p>
          <h2 className="mt-3 max-w-2xl text-[28px] leading-tight tracking-[-0.02em] text-paps-fg sm:text-[36px]">
            Leverage is the only thing here worth understanding properly.
          </h2>
          <div ref={riskRef} className="mt-8 grid gap-6 sm:grid-cols-[1.1fr_0.9fr] sm:items-start">
            <RiskLab />
            <div className="space-y-4 text-[14px] leading-relaxed text-paps-muted">
              <p>
                A perpetual is an agreement about a price, not a purchase. At 5× your $100
                controls $500, and roughly a fifth of a move against you closes it.
              </p>
              <p>
                Everything else follows from that: the liquidation price is not a surprise,
                funding is a cost you can see, and a fee is charged on the fill rather than
                hidden in the spread.
              </p>
              <p className="text-paps-fg/80">
                The app does this same arithmetic on every card, before you swipe.
              </p>
            </div>
          </div>
        </section>

        <FeaturePanels />

        <section className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-8">
          <div ref={notRef} className="rounded-lg border border-paps-line bg-paps-panel p-5 sm:p-7">
            <h2 className="text-[20px] tracking-[-0.01em] text-paps-fg">What this is not</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {NOTS.map(([t, d]) => (
                <div key={t}>
                  <dt className="text-[14px] text-paps-fg">{t}</dt>
                  <dd className="mt-1 text-[13px] leading-relaxed text-paps-muted">{d}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The attribution the bespoke footer used to carry. It stays because
              "market data by Strike" is a claim about where the numbers come from. */}
          <p className="mt-6 text-[12px] leading-relaxed text-paps-muted">
            paps is built by <a href="/" className="text-paps-fg/80 hover:text-paps-fg">doba</a> for
            the Strike Finance hackathon. Market data by Strike.{' '}
            <a href={papsApp} className="text-paps-fg/80 hover:text-paps-fg">
              paps.doba.world
            </a>{' '}
            ·{' '}
            <a href={REPO} className="text-paps-fg/80 hover:text-paps-fg">
              source
            </a>
          </p>
        </section>
      </PageLayout>
    </>
  );
}
