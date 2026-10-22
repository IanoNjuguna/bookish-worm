import { cn } from '../../lib/cn';
import { price, qty, signedUsd, usd } from '../../lib/format';
import type { VenuePosition } from '../../lib/strike/venue';

/**
 * The venue's positions on a phone.
 *
 * Same reason as the paper cards: eight columns in 390px is a table with the numbers
 * cut off. The venue's own `upnl` and liquidation price are shown as returned, never
 * recomputed from a mark we read elsewhere.
 */
export function VenuePositionCards({
  positions,
  marks,
  onClose,
  stepFor,
}: {
  positions: VenuePosition[];
  marks: Record<string, number>;
  /** Close on the venue: half or all, never a slice the venue would have to guess at. */
  onClose?: (position: VenuePosition, fraction: 1 | 0.5) => void;
  /** The market's lot step, so a position too small to halve does not offer a half. */
  stepFor?: (symbol: string) => number;
}) {
  if (!positions.length) {
    return (
      <p className="px-4 py-8 text-center text-small text-muted">
        No open positions on this account.
      </p>
    );
  }

  return (
    <ul className="space-y-2 p-3">
      {positions.map((p) => {
        const mark = marks[p.symbol];
        const liq = Number(p.liquidationPrice);
        const distance = liq && mark ? (Math.abs(mark - liq) / mark) * 100 : null;
        const upnl = Number(p.upnl);
        const funding = Number(p.funding);

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
                <span className="num text-micro text-muted">{p.leverage}×</span>
              </div>
              <span className={cn('num text-title', upnl >= 0 ? 'text-long' : 'text-short')}>
                {signedUsd(p.upnl)}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <Fact k="size" v={qty(p.absSize)} />
              <Fact k="entry" v={price(p.entryPrice)} />
              <Fact
                k="mark"
                v={mark ? price(mark) : '—'}
                note={
                  Number(p.liquidationPrice)
                    ? `liq. ${price(p.liquidationPrice)}${distance !== null ? ` · ${distance.toFixed(1)}% away` : ''}`
                    : undefined
                }
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line/70 pt-2.5">
              <span className="num min-w-0 truncate text-small text-muted">
                ${usd(p.isoBalance)} margin · {p.marginMode} ·{' '}
                <span className={funding === 0 ? '' : funding > 0 ? 'text-long' : 'text-short'}>
                  {signedUsd(p.funding)}
                </span>
              </span>
              {onClose && (
                <div className="flex shrink-0 items-center gap-1.5">
                  {halvable(p, stepFor) && (
                    <button
                      onClick={() => onClose(p, 0.5)}
                      className="rounded-control border border-line px-2.5 py-1.5 text-small text-muted active:text-fg"
                    >
                      ½
                    </button>
                  )}
                  <button
                    onClick={() => onClose(p, 1)}
                    className="rounded-control bg-fg px-3 py-1.5 text-small text-canvas"
                  >
                    close
                  </button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** A half close needs the position's size to be worth halving at the market's step. */
const halvable = (p: VenuePosition, stepFor?: (symbol: string) => number): boolean =>
  !stepFor || Number(p.absSize) / 2 >= stepFor(p.symbol);

function Fact({ k, v, note }: { k: string; v: string; note?: string }) {
  return (
    <div>
      <p className="text-micro text-muted">{k}</p>
      <p className="num text-body text-fg">{v}</p>
      {note && <p className="num text-micro text-muted">{note}</p>}
    </div>
  );
}
