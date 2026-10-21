import { useEffect, useRef, useState } from 'react';
import { fetchDepthSnapshot } from '../lib/api';
import { socket } from '../lib/ws';
import { OrderBook } from '../lib/book';
import type { DepthSnapshot, DepthUpdate } from '../lib/types';

type Levels = ReturnType<OrderBook['levels']>;
export type BookStatus = 'syncing' | 'live' | 'down';

const EMPTY: Levels = { bids: [], asks: [] };
const crossed = (l: Levels) =>
  l.bids.length > 0 && l.asks.length > 0 && Number(l.bids[0][0]) >= Number(l.asks[0][0]);

/**
 * Snapshot plus deltas, with a retry loop and a periodic resync.
 *
 * The mount-time fetch is retried rather than attempted once: a single failed request
 * used to leave the panel on "syncing" forever, which is the failure mode a trader
 * would misread as an empty book.
 */
export function useDepth(symbol: string) {
  const [levels, setLevels] = useState<Levels>(EMPTY);
  const [status, setStatus] = useState<BookStatus>('syncing');
  const book = useRef(new OrderBook());
  const frame = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    let retry: ReturnType<typeof setTimeout> | null = null;

    book.current.reset();
    setLevels(EMPTY);
    setStatus('syncing');

    const flush = () => {
      frame.current = null;
      const next = book.current.levels(15);
      setLevels(next);
      setStatus(crossed(next) ? 'syncing' : 'live');
      if (crossed(next)) void sync();
    };

    const schedule = () => {
      if (frame.current === null) frame.current = requestAnimationFrame(flush);
    };

    const sync = async (attempt = 0): Promise<void> => {
      if (!alive) return;
      try {
        const snap = await fetchDepthSnapshot<DepthSnapshot>(`/depth?symbol=${symbol}&limit=100`);
        if (!alive) return;
        book.current.applySnapshot(snap);
        schedule();
      } catch {
        if (!alive) return;
        setStatus('down');
        if (attempt < 5) {
          retry = setTimeout(() => void sync(attempt + 1), 400 * 2 ** attempt);
        }
      }
    };

    socket.connect();
    socket.subscribe('depth', symbol);

    const off = socket.on('depth', (msg) => {
      const d = msg as DepthUpdate;
      if (d.e !== 'depthUpdate' || d.s !== symbol) return;
      book.current.applyUpdate(d);
      if (book.current.ready) schedule();
    });

    void sync();

    return () => {
      alive = false;
      off();
      socket.unsubscribe('depth', symbol);
      if (retry) clearTimeout(retry);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [symbol]);

  return { ...levels, status, ready: status !== 'syncing' };
}
