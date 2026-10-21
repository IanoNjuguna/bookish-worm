import { useEffect, useState } from 'react';
import { get } from '../lib/api';
import { socket } from '../lib/ws';
import type { Kline } from '../lib/types';

export type Bar = { time: number; open: number; high: number; low: number; close: number };

const toBar = (k: Kline): Bar => ({
  time: Math.floor(k[0] / 1000),
  open: Number(k[1]),
  high: Number(k[2]),
  low: Number(k[3]),
  close: Number(k[4]),
});

/** Historical bars plus the live bar from the kline stream. */
export function useKlines(symbol: string, interval: string) {
  const [bars, setBars] = useState<Bar[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setBars([]);
    setError(null);

    get<Kline[]>(`/klines?symbol=${symbol}&interval=${interval}&limit=500`, ac.signal)
      .then((rows) => setBars(rows.map(toBar)))
      .catch((e: unknown) => {
        if ((e as Error).name !== 'AbortError') setError((e as Error).message);
      });

    socket.connect();
    socket.subscribe(`kline_${interval}`, symbol);
    const off = socket.on(`kline_${interval}`, (msg) => {
      const m = msg as {
        e: string;
        k?: { s: string; t: number; o: string; h: string; l: string; c: string };
      };
      if (m.e !== 'kline' || !m.k || m.k.s !== symbol) return;
      const bar = toBar([m.k.t, m.k.o, m.k.h, m.k.l, m.k.c, '0', 0]);
      setBars((prev) => {
        if (!prev.length) return [bar];
        const last = prev[prev.length - 1];
        if (bar.time === last.time) return [...prev.slice(0, -1), bar];
        if (bar.time > last.time) return [...prev, bar];
        return prev;
      });
    });

    return () => {
      off();
      ac.abort();
      socket.unsubscribe(`kline_${interval}`, symbol);
    };
  }, [symbol, interval]);

  return { bars, error };
}
