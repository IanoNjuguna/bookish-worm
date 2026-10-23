import { LiveStrip } from './LiveStrip';
import { useHeroIntro } from './motion';

const APP = 'https://paps.doba.world';

export function Hero() {
  const ref = useHeroIntro<HTMLElement>('[data-line]');

  return (
    <section ref={ref} className="relative mx-auto w-full max-w-5xl px-5 pt-14 sm:px-8 sm:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        {/* One column of words. Everything below is a child of it, so the grid can never
            interleave the eyebrow with the headline. */}
        <div>
          <p data-line className="font-mono text-[11px] uppercase tracking-[0.16em] text-paps-muted">
            paper perpetuals on Cardano
          </p>

          <h1
            data-line
            className="mt-5 max-w-[15ch] text-balance text-[40px] leading-[1.02] tracking-[-0.03em] text-paps-fg sm:text-[56px]"
          >
            Perps, with the risk written down.
          </h1>

          <p data-line className="mt-5 max-w-md text-[15px] leading-relaxed text-paps-muted sm:text-[17px]">
            Swipe a market, see the price at which you'd be closed out, and trade it with
            $10,000 of paper money on live Strike prices. No deposit, no wallet to start.
          </p>

          <div data-line className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={APP}
              className="rounded-lg bg-paps-accent px-5 py-3 text-[14px] font-medium text-paps-canvas transition-transform hover:-translate-y-px"
            >
              Open the demo
            </a>
            <a
              href="#how"
              className="rounded-lg border border-paps-line px-5 py-3 text-[14px] text-paps-fg/90 transition-colors hover:bg-paps-panel"
            >
              How it works
            </a>
          </div>

          <p data-line className="mt-3 text-[12px] text-paps-muted">
            no sign-up · nothing to install · paper money to start
          </p>
        </div>

        {/* The product beside the claim, framed as the card it is rather than a phone. */}
        <div data-line className="hidden justify-end lg:flex">
          <img
            src="/paps/deck-crop.png"
            alt="One paps market card: price, three facts, the 24h range and four swipe actions"
            width={390}
            height={452}
            className="w-[320px] rounded-xl border border-paps-line"
          />
        </div>
      </div>

      <div className="mt-12">
        <LiveStrip />
      </div>
    </section>
  );
}
