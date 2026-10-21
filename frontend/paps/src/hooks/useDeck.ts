import { useEffect, useMemo, useState } from 'react';
import { get } from '../lib/api';
import type { MiniTicker } from './useMiniTickers';
import type { MarkPrice, SymbolInfo } from '../lib/types';

export type DeckCard = {
  symbol: string;
  price: number;
  pct: number;
  high: number;
  low: number;
  funding: number;
  markPrice: number;
  quoteVolume: number;
  rank: number;
};

/**
 * The deck is ordered by movement, not by taste: the loudest markets first, because a
 * swipe deck with dead cards teaches nothing. Funding is fetched per card — it is a
 * public endpoint, no key involved.
 */
export function useDeck(symbols: SymbolInfo[], tickers: Record<string, MiniTicker>, take = 6) {
  const [funding, setFunding] = useState<Record<string, number>>({});

  const ranked = useMemo(() => {
    return symbols
      .map((s) => ({ symbol: s.symbol, t: tickers[s.symbol] }))
      .filter((r): r is { symbol: string; t: MiniTicker } => Boolean(r.t))
      .sort((a, b) => Math.abs(b.t.pct) - Math.abs(a.t.pct))
      .slice(0, take)
      .map((r) => r.symbol);
  }, [symbols, tickers, take]);

  const key = ranked.join(',');

  useEffect(() => {
    if (!ranked.length) return;
    const missing = ranked.filter((s) => funding[s] === undefined);
    if (!missing.length) return;

    let cancelled = false;

    // One state update for the whole batch. The previous version looped and bailed on
    // the first abort, which under StrictMode's double mount left every card after the
    // first with an unknown funding rate.
    void Promise.all(
      missing.map(async (symbol) => {
        try {
          const rows = await get<MarkPrice[] | MarkPrice>(`/markPrice?symbol=${symbol}`);
          const row = Array.isArray(rows) ? rows[0] : rows;
          // This endpoint answers in the websocket event shape (r), not the documented
          // REST shape (lastFundingRate), so read both.
          const rate = (row as { lastFundingRate?: string; r?: string } | undefined);
          const value = rate?.lastFundingRate ?? rate?.r;
          return value !== undefined ? ([symbol, Number(value)] as const) : null;
        } catch {
          return null;
        }
      }),
    ).then((pairs) => {
      if (cancelled) return;
      const found = pairs.filter((p): p is readonly [string, number] => Boolean(p));
      if (found.length) setFunding((prev) => ({ ...prev, ...Object.fromEntries(found) }));
    });

    return () => {
      cancelled = true;
    };
    // key covers the ranked list; funding is only read to skip refetches
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const cards: DeckCard[] = ranked.map((symbol, i) => {
    const t = tickers[symbol];
    return {
      symbol,
      price: t.last,
      pct: t.pct,
      high: t.high,
      low: t.low,
      funding: funding[symbol] ?? Number.NaN,
      markPrice: t.last,
      quoteVolume: t.quoteVolume,
      rank: i + 1,
    };
  });

  return cards;
}
