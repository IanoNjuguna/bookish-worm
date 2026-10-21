import { useEffect, useState } from 'react';
import { socket } from '../lib/ws';

export type MiniTicker = {
  last: number;
  open: number;
  pct: number;
  high: number;
  low: number;
  quoteVolume: number;
};

type Raw = {
  e: string;
  s: string;
  c: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
};

/**
 * One subscription covers every market, which is what makes a 31-row sidebar cheap.
 * The channel pushes an array or a single ticker depending on the batch.
 */
export function useMiniTickers() {
  const [bySymbol, setBySymbol] = useState<Record<string, MiniTicker>>({});

  useEffect(() => {
    socket.connect();
    socket.subscribe('!miniTicker@arr', '');
    const off = socket.on('!miniTicker@arr', (msg) => {
      const raw = msg as unknown as Raw | Raw[];
      const rows = Array.isArray(raw) ? raw : [raw];
      setBySymbol((prev) => {
        const next = { ...prev };
        for (const r of rows) {
          if (!r?.s) continue;
          const last = Number(r.c);
          const open = Number(r.o);
          next[r.s] = {
            last,
            open,
            pct: open ? ((last - open) / open) * 100 : 0,
            high: Number(r.h),
            low: Number(r.l),
            quoteVolume: Number(r.q),
          };
        }
        return next;
      });
    });
    return () => {
      off();
      socket.unsubscribe('!miniTicker@arr', '');
    };
  }, []);

  return bySymbol;
}
