import type { Side } from './order';

/**
 * Funding is the venue's periodic transfer between longs and shorts. A positive rate
 * means longs pay shorts, so the cash flow is negative for a long and positive for a
 * short: negative takes money out of equity, positive credits it.
 *
 * The rate is quoted against notional, not against margin, which is why a leveraged
 * position pays the same funding as the same notional unleveraged.
 */
export const fundingCashFlow = (side: Side, rate: number, notional: number): number => {
  const flow = (side === 'LONG' ? -1 : 1) * rate * Math.abs(notional);
  // Normalise negative zero: `-0` renders as "−$0.00" and reads as a charge that is not there.
  return flow === 0 ? 0 : flow;
};

/**
 * One charge per funding window. Keying on the window's close time means a re-render,
 * a repeated mark line or a StrictMode double mount cannot settle the same window
 * twice, which is the failure that would make funding show up as a doubled loss.
 */
export const fundingWindowKey = (symbol: string, settleAt: number): string =>
  `${symbol}:${settleAt}`;
