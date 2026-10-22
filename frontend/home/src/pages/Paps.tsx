import { Helmet } from 'react-helmet-async';
import { Hero } from '@/components/paps/Hero';
import { FeaturePanels } from '@/components/paps/FeaturePanels';
import { RiskLab } from '@/components/paps/RiskLab';
import { useReveal } from '@/components/paps/motion';

const APP = 'https://paps.doba.world';
const REPO = 'https://github.com/IanoNjuguna/bookish-worm/tree/main/frontend/paps';

const NOTS = [
  ['It is not a real trade', 'Every fill is simulated at the live mark. Nothing is sent to a venue and no funds can move.'],
  ['It is not custody', 'There is no deposit, no wallet connection required, and no key held in the browser.'],
  ['It is not advice', 'A demo of a leverage interface is not an offering of leveraged derivatives.'],
  ['It is not free of charges', 'Paper positions still pay the venue’s fee and funding, so the PnL you see is the PnL you would get.'],
];

export default function Paps() {
  const riskRef = useReveal<HTMLDivElement>({ y: 20 });
  const notRef = useReveal<HTMLDivElement>({ y: 20 });

  return (
    <div className="min-h-screen bg-paps-canvas text-paps-fg selection:bg-paps-accent/30">
      <Helmet>
        <title>paps — paper perpetuals, risk written down</title>
        <meta
          name="description"
          content="Trade perpetuals on a phone with $10,000 of paper money on live Strike prices. See the liquidation price before you swipe."
        />
        <meta property="og:title" content="paps — perps, with the risk written down" />
        <meta
          property="og:description"
          content="Swipe a market, see where you'd be closed out, trade it with paper money on live prices."
        />
      </Helmet>

      <header className="mx-auto flex w-full max-w-5xl items-center gap-3 px-5 py-5 sm:px-8">
        <a href="/" className="text-[15px] font-semibold tracking-tight text-paps-fg">
          doba<span className="text-paps-muted">.</span>
        </a>
        <span className="rounded-md border border-paps-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-paps-muted">
          paps
        </span>
        <nav className="ml-auto flex items-center gap-4 text-[13px] text-paps-muted">
          {/* On a phone the header keeps one job: get into the demo. The two reference
              links live in the body and the footer instead of wrapping to two lines. */}
          <a href="#how" className="hidden hover:text-paps-fg sm:inline">
            how it works
          </a>
          <a href={REPO} className="hidden hover:text-paps-fg sm:inline">
            source
          </a>
          <a
            href={APP}
            className="whitespace-nowrap rounded-md bg-paps-fg px-3 py-1.5 text-[13px] font-medium text-paps-canvas"
          >
            open demo
          </a>
        </nav>
      </header>

      <Hero />

      <section id="how" className="mx-auto w-full max-w-5xl px-5 pt-20 sm:px-8 sm:pt-28">
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
      </section>

      <footer className="border-t border-paps-line">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-8 text-[12px] text-paps-muted sm:flex-row sm:items-center sm:px-8">
          <span>
            paps is built by <a href="/" className="text-paps-fg/80 hover:text-paps-fg">doba</a> for the
            Strike Finance hackathon. Market data by Strike.
          </span>
          <a href={APP} className="sm:ml-auto text-paps-fg/80 hover:text-paps-fg">
            paps.doba.world
          </a>
        </div>
      </footer>
    </div>
  );
}
