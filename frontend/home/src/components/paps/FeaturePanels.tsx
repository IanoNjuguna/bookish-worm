import { useRef } from 'react';
import { usePinnedPanels, useReveal } from './motion';

type Panel = {
  n: string;
  title: string;
  body: string;
  shot: string;
  facts: string[];
};

const PANELS: Panel[] = [
  {
    n: '01',
    title: 'Swipe a market',
    body: 'The deck hands you one market at a time, the calm ones first. Right is long, left is short, and two seconds of undo means a wrong thumb costs nothing.',
    shot: '/paps/deck.png',
    facts: ['one card, three facts', '5× default, not 50×', 'undo before anything settles'],
  },
  {
    n: '02',
    title: 'Trade the way you think',
    body: 'Price, direction, amount, one button. Margin, liquidation and fees sit one tap away, because you only need them once you have decided to size the trade.',
    shot: '/paps/trade.png',
    facts: ['live candle chart', 'liquidation before you commit', 'funding charged per window'],
  },
  {
    n: '03',
    title: 'Know what you hold',
    body: 'Each position is a card: what it is doing, how much room is left before liquidation, and the two ways out. Close half, or close it. No menus.',
    shot: '/paps/positions.png',
    facts: ['entry, mark, liquidation', 'distance to liquidation in %', 'close half in one tap'],
  },
];

/** Desktop: pinned cross-fade. Mobile: three stacked panels that simply reveal. */
export function FeaturePanels() {
  const host = useRef<HTMLElement | null>(null);
  usePinnedPanels(host, '[data-panel]');

  return (
    <section ref={host} className="relative mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="relative sm:min-h-[560px]">
        {PANELS.map((p, i) => (
          <PanelCard key={p.n} panel={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function PanelCard({ panel, index }: { panel: Panel; index: number }) {
  const ref = useReveal<HTMLDivElement>({ y: 24, delay: index * 0.04, only: 'mobile' });

  return (
    <div
      data-panel
      ref={ref}
      className={`grid items-center gap-8 sm:absolute sm:inset-0 sm:grid-cols-2 sm:gap-12 ${
        index === 0 ? '' : 'mt-14 sm:mt-0'
      }`}
    >
      <div>
        <span className="font-mono text-[11px] text-paps-muted">{panel.n}</span>
        <h2 className="mt-2 text-[28px] leading-tight tracking-[-0.02em] text-paps-fg sm:text-[36px]">
          {panel.title}
        </h2>
        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-paps-muted sm:text-[15px]">
          {panel.body}
        </p>
        <ul className="mt-5 space-y-1.5">
          {panel.facts.map((f) => (
            <li key={f} className="flex items-baseline gap-2 text-[13px] text-paps-fg/80">
              <span className="h-1 w-1 shrink-0 rounded-full bg-paps-accent" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center sm:justify-end">
        <img
          src={panel.shot}
          alt={`paps ${panel.title.toLowerCase()} screen`}
          width={390}
          height={844}
          loading="lazy"
          className="max-h-[520px] w-auto rounded-xl border border-paps-line bg-paps-panel"
        />
      </div>
    </div>
  );
}
