import { LiveStrip } from './LiveStrip';
import { useHeroIntro } from './motion';

const APP = 'https://paps.doba.world';

export function Hero() {
  const ref = useHeroIntro<HTMLElement>('[data-line]');

  return (
    <section ref={ref} className="relative mx-auto w-full max-w-5xl px-5 pt-16 sm:px-8 sm:pt-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
      <p
        data-line
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-paps-muted"
      >
        paper perpetuals on Cardano
      </p>

      <h1
        data-line
        className="mt-5 max-w-3xl text-[40px] leading-[1.02] tracking-[-0.03em] text-paps-fg sm:text-[64px]"
      >
        Perps, with the risk
        <br />
        written down.
      </h1>

      <p data-line className="mt-5 max-w-xl text-[15px] leading-relaxed text-paps-muted sm:text-[17px]">
        Swipe a market, see the price at which you'd be closed out, and trade it with
        $10,000 of paper money on live Strike prices. No deposit, no wallet to start, and
        no leverage you can't see.
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
        <span className="text-[12px] text-paps-muted">no sign-up, nothing to install</span>
      </div>

      {/* The product itself, on the right, so the claim above it has a witness. */}
      <div data-line className="hidden justify-center lg:flex">
        <img
          src="/paps/deck.png"
          alt="The paps swipe deck, with one market card showing price, 24h range and funding"
          width={390}
          height={844}
          className="w-[260px] rounded-xl border border-paps-line"
        />
      </div>
      </div>

      <div className="mt-12">
        <LiveStrip />
      </div>
    </section>
  );
}
