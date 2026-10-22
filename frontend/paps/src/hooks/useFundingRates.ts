import { useEffect, useMemo, useState } from 'react';
import { socket } from '../lib/ws';

export type FundingRate = {
  /** The venue's current rate for this window, as a fraction of notional. */
  rate: number;
  /** When the window closes and the transfer settles. */
  settleAt: number;
};

/**
 * Funding rates for the symbols that hold positions.
 *
 * Watching only the market on screen would have left every other position exempt from
 * funding, which is worse than not showing it: the account would quietly be wrong in
 * the trader's favour. The socket reference counts subscriptions, so asking for the
 * on-screen symbol twice costs nothing.
 */
export function useFundingRates(symbols: string[]): Record<string, FundingRate> {
  const [rates, setRates] = useState<Record<string, FundingRate>>({});
  // Sorted so a reordered position list does not resubscribe every symbol.
  const key = useMemo(() => [...new Set(symbols)].sort().join(','), [symbols]);

  useEffect(() => {
    const wanted = key ? key.split(',') : [];
    if (!wanted.length) return;
    socket.connect();
    const off = socket.on('markPrice', (msg) => {
      const m = msg as { e: string; s: string; r: string; T: number };
      if (m.e !== 'markPriceUpdate' || !wanted.includes(m.s)) return;
      const rate = Number(m.r);
      // A funding window without a time cannot be settled, so it is not a rate we can
      // charge; showing it would invite a charge that never lands.
      if (!Number.isFinite(rate) || !m.T) return;
      setRates((prev) => {
        const cur = prev[m.s];
        if (cur && cur.rate === rate && cur.settleAt === m.T) return prev;
        return { ...prev, [m.s]: { rate, settleAt: m.T } };
      });
    });
    for (const s of wanted) socket.subscribe('markPrice', s);
    return () => {
      off();
      for (const s of wanted) socket.unsubscribe('markPrice', s);
    };
  }, [key]);

  return useMemo(() => {
    const held: Record<string, FundingRate> = {};
    for (const s of key ? key.split(',') : []) if (rates[s]) held[s] = rates[s];
    return held;
  }, [rates, key]);
}
