import { useState } from 'react';
import { cn } from '../../lib/cn';
import { markOnboarded } from '../../lib/onboarding';
import { Sheet } from './Sheet';

const SLIDES: { title: string; body: string; hint: string }[] = [
  {
    title: 'Swipe to take a view',
    body: 'Right is long, left is short, up passes. Two seconds to undo after a swipe, so a wrong thumb costs nothing.',
    hint: 'The card shows the last day of price, where it sits in its range, and the one thing moving it.',
  },
  {
    title: 'You decide what it risks',
    body: 'Every swipe risks the same amount — $100 by default — and that is the whole decision. Leverage and the amount are in the You tab.',
    hint: 'The card draws the price at which you would be liquidated, before you commit.',
  },
  {
    title: 'This money is simulated',
    body: 'Ten thousand simulated dollars, real Strike prices, simulated fills. Nothing moves, nothing can be withdrawn. That is what demo means here.',
    hint: 'Sign in only if you want this run to survive a refresh or a new device.',
  },
];

/** Three slides, never a gate: skip is on the first screen, and closing counts as seen. */
export function Onboarding({
  open,
  onClose,
  onOpenHowItWorks,
}: {
  open: boolean;
  onClose: () => void;
  onOpenHowItWorks: () => void;
}) {
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

  const finish = (then?: () => void) => {
    markOnboarded();
    onClose();
    then?.();
  };

  return (
    <Sheet
      open={open}
      title="paps"
      onClose={() => finish()}
      footer={
        <div className="flex items-center gap-2">
          <button onClick={() => finish()} className="rounded-control px-3 py-2 text-small text-muted">
            skip
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            {SLIDES.map((s, n) => (
              <span
                key={s.title}
                className={cn('h-1.5 w-4 rounded-chip', n === i ? 'bg-fg' : 'bg-panel-2')}
                aria-hidden="true"
              />
            ))}
          </div>
          <button
            onClick={() => (last ? finish(onOpenHowItWorks) : setI((n) => n + 1))}
            className="ml-2 rounded-control bg-accent px-4 py-2 text-small font-medium text-canvas"
          >
            {last ? 'how it works' : 'next'}
          </button>
        </div>
      }
    >
      <h3 className="text-title text-fg">{slide.title}</h3>
      <p className="mt-2 text-body leading-relaxed text-fg/90">{slide.body}</p>
      <p className="mt-3 border-t border-line pt-3 text-small leading-relaxed text-muted">{slide.hint}</p>
    </Sheet>
  );
}
