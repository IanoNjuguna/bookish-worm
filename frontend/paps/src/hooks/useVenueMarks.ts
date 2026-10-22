import { useEffect, useState } from 'react';
import { get } from '../lib/api';

type MarkUpdate = { s: string; p: string };

/**
 * A mark per symbol, for positions the venue holds.
 *
 * The blotter's own `marks` map is built from the visible market and the mini tickers, which
 * is not the same set as "every symbol I have a position in". One public call returns every
 * mark, so this asks for all of them and keeps the ones in use.
 */
export function useVenueMarks(symbols: string[], everyMs = 15_000): Record<string, number> {
  // A fresh array every render would restart the poll; the sorted join is the real input.
  const key = symbols.slice().sort().join(',');
  const [marks, setMarks] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!key) {
      setMarks({});
      return;
    }

    const wanted = new Set(key.split(','));
    let alive = true;

    const load = async () => {
      try {
        const rows = await get<MarkUpdate[]>('/markPrice');
        const out: Record<string, number> = {};
        for (const row of rows) if (wanted.has(row.s)) out[row.s] = Number(row.p);
        if (alive) setMarks(out);
      } catch {
        // The venue's upnl is authoritative; a missing mark renders as an em dash.
      }
    };

    void load();
    const id = setInterval(load, everyMs);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [key, everyMs]);

  return marks;
}
