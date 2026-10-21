import { useEffect, useState } from 'react';
import { get } from '../lib/api';
import type { ExchangeInfo, SymbolInfo } from '../lib/types';

export function useSymbols() {
  const [symbols, setSymbols] = useState<SymbolInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    get<ExchangeInfo>('/exchangeInfo', ac.signal)
      .then((info) => setSymbols(info.symbols.filter((s) => s.status === 'trading')))
      .catch((e: unknown) => {
        if ((e as Error).name !== 'AbortError') setError((e as Error).message);
      });
    return () => ac.abort();
  }, []);

  return { symbols, error };
}

export const symbolInfo = (symbols: SymbolInfo[], symbol: string): SymbolInfo | undefined =>
  symbols.find((s) => s.symbol === symbol);
