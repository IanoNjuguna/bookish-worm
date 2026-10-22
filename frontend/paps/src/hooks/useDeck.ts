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

export type Round = {
  cards: DeckCard[];
  /** What this round is about, shown in the deck header. */
  label: string;
};

/**
 * Rounds, not one finite deck.
 *
 * Markets are infinite and attention is not, so each round of ten draws from a
 * different bucket. Rounds rotate, so the deck never dead-ends and no two consecutive
 * rounds are the same list.
 *
 * The first round is the calm one on purpose: a stranger's first card should teach the
 * gesture, not hand them a market that moved 12% today. Movement comes second, once the
 * deck is a place they know how to be.
 */
const BUCKETS = ['calm', 'movers', 'volume', 'range', 'cheap'] as const;
type Bucket = (typeof BUCKETS)[number];

const LABELS: Record<Bucket, string> = {
  calm: 'the calm ones',
  movers: 'by movement',
  volume: 'by volume',
  range: 'by range position',
  cheap: 'by price',
};

export function useDeck(
  symbols: SymbolInfo[],
  tickers: Record<string, MiniTicker>,
  take = 10,
  pinned: string[] = [],
  round = 0,
): Round {
  const [funding, setFunding] = useState<Record<string, number>>({});

  const bucket = BUCKETS[round % BUCKETS.length];

  const cards = useMemo(() => {
    const rows = symbols
      .map((s) => ({ symbol: s.symbol, t: tickers[s.symbol] }))
      .filter((r): r is { symbol: string; t: MiniTicker } => Boolean(r.t))
      // A market with no traded volume is not calm, it is dead, and it is the worst
      // possible first card: no fill, no spread, nothing to learn from.
      .filter((r) => r.t.quoteVolume > 0);

    const score = (r: { symbol: string; t: MiniTicker }): number => {
      const rangePos = r.t.high > r.t.low ? (r.t.last - r.t.low) / (r.t.high - r.t.low) : 0.5;
      switch (bucket) {
        case 'movers':
          return Math.abs(r.t.pct);
        case 'volume':
          return r.t.quoteVolume;
        case 'range':
          return Math.abs(rangePos - 0.5);
        case 'cheap':
          return 1 / Math.max(r.t.last, 1e-9);
        case 'calm': {
          // Calm is two things: the day's move and the day's range. Sorting on the move
          // alone put a market that closed flat after swinging 6% at the top of the deck,
          // which is not what a first card should be.
          const width = r.t.last > 0 ? ((r.t.high - r.t.low) / r.t.last) * 100 : 0;
          return -(Math.abs(r.t.pct) * 0.6 + width * 0.4);
        }
      }
    };

    const watched = pinned.filter((p) => rows.some((r) => r.symbol === p));
    const sorted = rows
      .filter((r) => !watched.includes(r.symbol))
      .sort((a, b) => score(b) - score(a))
      .map((r) => r.symbol);

    return [...watched, ...sorted].slice(0, Math.max(take, watched.length));
  }, [symbols, tickers, take, pinned, bucket]);

  const key = cards.join(',');

  useEffect(() => {
    const missing = cards.filter((s) => funding[s] === undefined);
    if (!missing.length) return;

    let cancelled = false;

    void Promise.all(
      missing.map(async (symbol) => {
        try {
          const rows = await get<MarkPrice[] | MarkPrice>(`/markPrice?symbol=${symbol}`);
          const row = Array.isArray(rows) ? rows[0] : rows;
          // This endpoint answers in the websocket event shape (r), not the documented
          // REST shape (lastFundingRate).
          const rate = row as { lastFundingRate?: string; r?: string } | undefined;
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
    // key covers the card list; funding is read only to skip refetches
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return {
    label: `round ${round + 1} · ${LABELS[bucket]}`,
    cards: cards.map((symbol, i) => {
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
    }),
  };
}
