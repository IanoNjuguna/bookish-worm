import { useEffect, useRef, useState } from 'react';
import { get } from '../lib/api';
import type { MarkPrice } from '../lib/types';

export type Funding = { rate: number; nextTime: number };

/**
 * Funding for the symbols a trader actually holds, not just the one on screen.
 *
 * Polled rather than streamed: the rate changes slowly and the settlement time is what
 * matters, so a 20s poll costs nothing and keeps the subscription count flat.
 */
export function useFunding(symbols: string[]) {
  const [rates, setRates] = useState<Record<string, Funding>>({});
  const key = symbols.slice().sort().join(',');

  useEffect(() => {
    if (!symbols.length) return;
    let cancelled = false;

    const load = async () => {
      const pairs = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const rows = await get<MarkPrice[] | MarkPrice>(`/markPrice?symbol=${symbol}`);
            const row = (Array.isArray(rows) ? rows[0] : rows) as
              | { r?: string; T?: number; lastFundingRate?: string; nextFundingTime?: number }
              | undefined;
            const rate = Number(row?.r ?? row?.lastFundingRate);
            const nextTime = Number(row?.T ?? row?.nextFundingTime);
            return Number.isFinite(rate) && Number.isFinite(nextTime)
              ? ([symbol, { rate, nextTime }] as const)
              : null;
          } catch {
            return null;
          }
        }),
      );
      if (cancelled) return;
      const found = pairs.filter((p): p is readonly [string, Funding] => Boolean(p));
      if (found.length) setRates((prev) => ({ ...prev, ...Object.fromEntries(found) }));
    };

    void load();
    const id = window.setInterval(load, 20_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
    // key covers the symbol set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return rates;
}

/**
 * Settles funding once per window, per symbol. The guard lives outside the reducer
 * because the reducer must stay pure; a re-render or a StrictMode double mount must not
 * charge the same window twice.
 */
export function useFundingSettlement(
  rates: Record<string, Funding>,
  marks: Record<string, number>,
  onFund: (symbol: string, rate: number, mark: number) => void,
) {
  const settled = useRef<Record<string, number>>({});

  useEffect(() => {
    const now = Date.now();
    for (const [symbol, f] of Object.entries(rates)) {
      const window = f.nextTime;
      if (!window || now < window) continue;
      if (settled.current[symbol] === window) continue;
      const mark = marks[symbol];
      if (!mark) continue;
      settled.current[symbol] = window;
      onFund(symbol, f.rate, mark);
    }
  }, [rates, marks, onFund]);
}
