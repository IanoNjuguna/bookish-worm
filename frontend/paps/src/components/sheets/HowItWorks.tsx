import { Sheet } from './Sheet';

const SECTIONS: { h: string; body: string }[] = [
  {
    h: 'A perpetual is an agreement about a price',
    body: 'You never own the coin. You take a side on where its price goes, and the position stays open until you close it. Long means you think it goes up. Short means you think it goes down.',
  },
  {
    h: 'Leverage is borrowed size, not free size',
    body: 'At 5× your $100 controls $500, and a move of about 20% against you closes the position with nothing left of that margin. The card always tells you where that price is before you swipe.',
  },
  {
    h: 'What it costs',
    body: 'A 0.05% fee on each fill, plus paps’s 1% when the order goes to the venue. Funding every eight hours between longs and shorts, charged on the position, not on your balance. A liquidation closes at the mark and charges the venue’s 1% fee.',
  },
  {
    h: 'What is real, and what is not',
    body: "Prices come from Strike. Until you sign in the fills are simulated, the money is simulated, and nothing leaves this browser. Sign in and the same swipe arms a real order on Strike, filled by the venue, with paps taking 1% on top of Strike's fee.",
  },
];

/** The four questions a first-time perp trader actually asks, answered without jargon. */
export function HowItWorks({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} title="How this works" onClose={onClose}>
      <ol className="space-y-4">
        {SECTIONS.map((s, i) => (
          <li key={s.h}>
            <div className="flex items-baseline gap-2">
              <span className="num text-micro text-muted">{i + 1}</span>
              <h3 className="text-body text-fg">{s.h}</h3>
            </div>
            <p className="mt-1 pl-5 text-small leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-line pt-3 text-small leading-relaxed text-muted">
        Demo trading here means simulated fills on real prices. A demo of a leverage
        interface is not an offering of leveraged derivatives.
      </p>
    </Sheet>
  );
}
