import { useEffect, useRef, useState } from 'react';
import { socket } from '../lib/ws';
import type { MarkPrice, Trade } from '../lib/types';
import { get } from '../lib/api';

/**
 * Mark price, funding and last trades. Mark price is what the PnL maths uses, so it
 * is streamed rather than polled: a stale mark makes the liquidation price lie.
 */
export function useMarkPrice(symbol: string) {
  const [state, setState] = useState<{ mark: MarkPrice | null; lastAt: number }>({
    mark: null,
    lastAt: 0,
  });

  useEffect(() => {
    socket.connect();
    socket.subscribe('markPrice', symbol);
    const off = socket.on('markPrice', (msg) => {
      const m = msg as {
        e: string;
        s: string;
        p: string;
        i: string;
        P?: string;
        r: string;
        T: number;
      };
      if (m.e !== 'markPriceUpdate' || m.s !== symbol) return;
      setState({
        mark: {
          symbol: m.s,
          markPrice: m.p,
          indexPrice: m.i,
          estimatedSettlePrice: m.P,
          lastFundingRate: m.r,
          nextFundingTime: m.T,
          time: Date.now(),
        },
        lastAt: Date.now(),
      });
    });
    return () => {
      off();
      socket.unsubscribe('markPrice', symbol);
    };
  }, [symbol]);

  return state;
}

export function useTrades(symbol: string, limit = 18) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const frame = useRef<number | null>(null);
  const pending = useRef<Trade[]>([]);

  useEffect(() => {
    setTrades([]);
    const ac = new AbortController();

    const flush = () => {
      frame.current = null;
      if (!pending.current.length) return;
      const fresh = pending.current;
      pending.current = [];
      setTrades((prev) => [...fresh.reverse(), ...prev].slice(0, limit));
    };

    socket.connect();
    socket.subscribe('trade', symbol);
    const off = socket.on('trade', (msg) => {
      const t = msg as { e: string; s: string; t: number; T: number; p: string; q: string; m: boolean };
      if (t.e !== 'trade' || t.s !== symbol) return;
      pending.current.push({ id: t.t, time: t.T, price: t.p, qty: t.q, isBuyerMaker: t.m });
      if (frame.current === null) frame.current = requestAnimationFrame(flush);
    });

    get<Trade[]>(`/trades?symbol=${symbol}&limit=${limit}`, ac.signal)
      .then((rows) => setTrades((prev) => (prev.length ? prev : rows)))
      .catch(() => {
        /* the tape simply starts empty */
      });

    return () => {
      off();
      ac.abort();
      socket.unsubscribe('trade', symbol);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [symbol, limit]);

  return trades;
}
