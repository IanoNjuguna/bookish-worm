import { useEffect, useState } from 'react';
import { get } from '../lib/api';
import type { Kline } from '../lib/types';

/**
 * A sparkline per card, so the card has a hero the way a profile card has a photo.
 * One request per symbol, capped, and only for symbols that are not already loaded.
 */
export function useSparklines(symbols: string[], points = 60) {
  const [lines, setLines] = useState<Record<string, number[]>>({});

  const key = symbols.join(',');

  useEffect(() => {
    const missing = symbols.filter((s) => lines[s] === undefined);
    if (!missing.length) return;

    let cancelled = false;
    void Promise.all(
      missing.map(async (symbol) => {
        try {
          const rows = await get<Kline[]>(`/klines?symbol=${symbol}&interval=1m&limit=${points}`);
          return [symbol, rows.map((r) => Number(r[4]))] as const;
        } catch {
          return null;
        }
      }),
    ).then((pairs) => {
      if (cancelled) return;
      const found = pairs.filter((p): p is readonly [string, number[]] => Boolean(p));
      if (found.length) setLines((prev) => ({ ...prev, ...Object.fromEntries(found) }));
    });

    return () => {
      cancelled = true;
    };
    // key covers the symbol list; lines is read only to skip loaded symbols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return lines;
}

/** Inline SVG path for a series, normalised into a 0..100 box. */
export function sparkPath(values: number[], width = 100, height = 100): string {
  if (values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  // Keep the peak off the top edge, or the stroke gets clipped by the viewBox.
  const pad = height * 0.08;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - pad - ((v - min) / span) * (height - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}
