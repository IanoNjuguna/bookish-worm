/**
 * Order maths, following Strike's published formulas. The maintenance margin rate is
 * a first-tier approximation here because the real tiers come from an authenticated
 * endpoint; every surface that shows a liquidation price says "est".
 */

export type Side = 'LONG' | 'SHORT';

/**
 * Decimals a step implies, read from its own written form: `0.001` is three, `0.5` is one,
 * `1` is none, and `1e-8` — which is how JavaScript writes a nano-step — is eight.
 */
export const decimalsFor = (step: number): number => {
  const written = String(step);
  const exponent = written.indexOf('e-');
  if (exponent >= 0) return Number(written.slice(exponent + 2));
  const dot = written.indexOf('.');
  return dot < 0 ? 0 : written.length - dot - 1;
};

/**
 * Round to the nearest multiple of `step`.
 *
 * The float noise is trimmed at the step's own precision: `3 * 0.1` is
 * `0.30000000000000004`, and a venue that is asked to parse that will refuse the order.
 * Derived from the step rather than assumed to be a power of ten, because ticks like `0.5`
 * and steps like `0.25` are real.
 */
export const roundTo = (v: number, step: number): number => {
  if (!step) return v;
  return Number((Math.round(v / step) * step).toFixed(decimalsFor(step)));
};

export const notionalOf = (price: number, size: number): number => price * Math.abs(size);

/** Size from a dollar amount, clamped to the exchange's step. */
export const sizeForNotional = (usd: number, price: number, step: number): number =>
  price > 0 ? roundTo(usd / price, step) : 0;

export type Tier = { mmr: number; ma: number };

/** First-tier defaults until the API's tiers are available to this client. */
export const DEFAULT_TIER: Tier = { mmr: 0.005, ma: 0 };

/**
 * Isolated liquidation price:
 *   LP = (EP − (IsoBalance + MA) / Size) / (1 − Direction × MMR)
 * Returns 0 when the position would be liquidated immediately.
 */
export function liquidationPrice(
  side: Side,
  entry: number,
  isoBalance: number,
  size: number,
  tier: Tier = DEFAULT_TIER,
): number {
  if (size <= 0 || entry <= 0) return 0;
  const direction = side === 'LONG' ? 1 : -1;
  const denominator = 1 - direction * tier.mmr;
  if (denominator === 0) return 0;
  // Size is signed in Strike's formula: a short's isolated balance sits above the
  // entry, so dividing by direction * size is what keeps LP above entry.
  const lp = (entry - (isoBalance + tier.ma) / (direction * size)) / denominator;
  if (lp <= 0) return 0;
  if (side === 'LONG' && lp >= entry) return 0;
  if (side === 'SHORT' && lp <= entry) return 0;
  return lp;
}

export type Position = {
  id: string;
  symbol: string;
  side: Side;
  entry: number;
  size: number;
  leverage: number;
  margin: number;
  openedAt: number;
  /** Cumulative funding paid (negative) or received (positive). */
  funding?: number;
};

export const unrealised = (p: Position, mark: number): number =>
  p.side === 'LONG' ? (mark - p.entry) * p.size : (p.entry - mark) * p.size;

export const roe = (p: Position, mark: number): number => {
  const pnl = unrealised(p, mark);
  return p.margin > 0 ? (pnl / p.margin) * 100 : 0;
};
