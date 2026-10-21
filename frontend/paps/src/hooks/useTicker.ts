import { useEffect, useState } from 'react';
import { get } from '../lib/api';

export type Ticker24h = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openPrice?: string;
};

/** 24h stats move on a slow clock; polling beats a stream here. */
export function useTicker(symbol: string) {
  const [ticker, setTicker] = useState<Ticker24h | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    let alive = true;

    const load = () => {
      get<Ticker24h>(`/ticker/24hr?symbol=${symbol}`, ac.signal)
        .then((t) => alive && setTicker(t))
        .catch((e: unknown) => {
          if ((e as Error).name !== 'AbortError' && alive) setError((e as Error).message);
        });
    };

    setTicker(null);
    setError(null);
    load();
    const id = setInterval(load, 5_000);

    return () => {
      alive = false;
      ac.abort();
      clearInterval(id);
    };
  }, [symbol]);

  return { ticker, error };
}
