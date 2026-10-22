import { cn } from '../../lib/cn';
import { price, usd } from '../../lib/format';
import { liquidationPrice, roe, unrealised, type Position } from '../../lib/order';

/**
 * Positions on a phone.
 *
 * The blotter table is right on a wide screen and unusable at 390px: eleven columns in
 * 390px means the last five are off-screen with no affordance saying so. A position is
 * one idea, so on a phone it is one card — what you hold, what it is doing, how much
 * room is left before liquidation, and the two ways out.
 */
export function PositionCards({
  positions,
  marks,
  mark,
  onClose,
}: {
  positions: Position[];
  marks: Record<string, number>;
  mark: number;
  onClose: (id: string, mark: number, fraction?: number) => void;
}) {
  if (!positions.length) {
    return (
      <p className="px-4 py-8 text-center text-small text-muted">
        No positions. Swipe a card, or open one from Trade.
      </p>
    );
  }

  return (
    <ul className="space-y-2 p-3">
      {positions.map((p) => {
        const pMark = marks[p.symbol] ?? mark;
        const up = unrealised(p, pMark);
        const liq = liquidationPrice(p.side, p.entry, p.margin, p.size);
        const distance = liq && pMark ? (Math.abs(pMark - liq) / pMark) * 100 : null;

        return (
          <li key={p.id} className="rounded-card border border-line bg-panel-2/40 p-3">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-title text-fg">{p.symbol}</span>
                <span
                  className={cn(
                    'rounded-pill px-1.5 py-0.5 text-micro',
                    p.side === 'LONG' ? 'bg-long/15 text-long' : 'bg-short/15 text-short',
                  )}
                >
                  {p.side}
                </span>
              </div>
              <span className={cn('num text-title', up >= 0 ? 'text-long' : 'text-short')}>
                {up >= 0 ? '+' : '−'}${usd(Math.abs(up))}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <Fact k="entry" v={price(p.entry)} />
              <Fact k="mark" v={price(pMark)} />
              <Fact
                k="liq."
                v={liq ? price(liq) : '—'}
                note={distance !== null ? `${distance.toFixed(1)}% away` : undefined}
              />
            </div>

            <div className="mt-2.5 flex items-center gap-3 border-t border-line/70 pt-2.5">
              <span className="num text-small text-muted">
                ${usd(p.margin)} margin · {roe(p, pMark).toFixed(1)}%
                {p.funding ? ` · funding ${p.funding >= 0 ? '+' : '−'}$${usd(Math.abs(p.funding))}` : ''}
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  onClick={() => onClose(p.id, pMark, 0.5)}
                  className="rounded-control border border-line px-2.5 py-1.5 text-small text-muted active:text-fg"
                >
                  ½
                </button>
                <button
                  onClick={() => onClose(p.id, pMark, 1)}
                  className="rounded-control bg-fg px-3 py-1.5 text-small text-canvas"
                >
                  close
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Fact({ k, v, note }: { k: string; v: string; note?: string }) {
  return (
    <div>
      <p className="text-micro text-muted">{k}</p>
      <p className="num text-body text-fg">{v}</p>
      {note && <p className="num text-micro text-muted">{note}</p>}
    </div>
  );
}
