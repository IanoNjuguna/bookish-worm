import { useEffect, useRef, useState } from 'react';

type Panel = {
  n: string;
  title: string;
  body: string;
  shot: string;
  alt: string;
  facts: string[];
};

const PANELS: Panel[] = [
  {
    n: '01',
    title: 'Swipe a market',
    body: 'The deck hands you one market at a time, the calm ones first. Right is long, left is short, and two seconds of undo means a wrong thumb costs nothing.',
    shot: '/paps/deck-crop.png',
    alt: 'One market card with its price, three facts and the four swipe actions',
    facts: ['one card, three facts', '5× default, not 50×', 'undo before anything settles'],
  },
  {
    n: '02',
    title: 'Trade the way you think',
    body: 'Price, direction, amount, one button. Margin, liquidation and fees sit one tap away, because you only need them once you have decided to size the trade.',
    shot: '/paps/trade-crop.png',
    alt: 'The trade screen: live candle chart, long and short, amount, and one action',
    facts: ['live candle chart', 'liquidation before you commit', 'funding charged per window'],
  },
  {
    n: '03',
    title: 'Know what you hold',
    body: 'Each position is a card: what it is doing, how much room is left before liquidation, and the two ways out. Close half, or close it. No menus.',
    shot: '/paps/positions-crop.png',
    alt: 'A position card: entry, mark, liquidation price and the two close actions',
    facts: ['entry, mark, liquidation', 'distance to liquidation in %', 'close half in one tap'],
  },
];

/**
 * No pinning.
 *
 * The first version pinned this section and cross-faded three panels. It jittered on a
 * trackpad, it fought the address bar on a phone, and the panels had different heights so
 * the scroll length changed as images loaded. A sticky media column does the same job
 * with the browser's own compositor: the picture stays, the words scroll past it, and
 * there is nothing to tear down on rotation.
 */
export function FeaturePanels() {
  const [active, setActive] = useState(0);
  const hosts = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = hosts.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    // The block nearest the middle of the viewport owns the picture.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number((visible.target as HTMLElement).dataset.index ?? 0);
        setActive(idx);
      },
      // Biased low so the first block keeps the picture while it is still being read.
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="space-y-14 sm:space-y-20">
          {PANELS.map((p, i) => (
            <PanelCopy
              key={p.n}
              panel={p}
              index={i}
              register={(el) => {
                hosts.current[i] = el;
              }}
            />
          ))}
        </div>

        {/* Desktop: one picture, held still while the words move past it. */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <div className="relative h-[min(600px,68vh)] overflow-hidden rounded-xl border border-paps-line bg-paps-canvas">
              {PANELS.map((p, i) => (
                <img
                  key={p.n}
                  src={p.shot}
                  alt={p.alt}
                  width={390}
                  height={470}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className={`h-full w-full object-contain object-top transition-opacity duration-300 ${
                    i === active ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 font-mono text-[11px] text-paps-muted">
              {PANELS[active].n} / 03 — {PANELS[active].title.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PanelCopy({
  panel,
  index,
  register,
}: {
  panel: Panel;
  index: number;
  register: (el: HTMLElement | null) => void;
}) {
  return (
    <article
      ref={register}
      data-index={index}
      className="max-w-md"
    >
      <span className="font-mono text-[11px] text-paps-muted">{panel.n}</span>
      <h2 className="mt-2 text-[26px] leading-tight tracking-[-0.02em] text-paps-fg sm:text-[32px]">
        {panel.title}
      </h2>
      <p className="mt-3 text-[14px] leading-relaxed text-paps-muted sm:text-[15px]">{panel.body}</p>
      <ul className="mt-5 space-y-1.5">
        {panel.facts.map((f) => (
          <li key={f} className="flex items-baseline gap-2 text-[13px] text-paps-fg/80">
            <span className="h-1 w-1 shrink-0 rounded-full bg-paps-accent" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      {/* Phone: the picture belongs to its paragraph, so it travels with it. */}
      <img
        src={panel.shot}
        alt={panel.alt}
        width={390}
        height={470}
        loading="lazy"
        className="mt-6 w-full max-w-[320px] rounded-lg border border-paps-line lg:hidden"
      />
    </article>
  );
}
