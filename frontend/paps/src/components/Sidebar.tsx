import { useMemo, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import type { SymbolInfo } from '../lib/types';
import { FEATURED } from '../lib/constants';
import type { MiniTicker } from '../hooks/useMiniTickers';
import { price, pct } from '../lib/format';
import { cn } from '../lib/cn';

type Props = {
  symbols: SymbolInfo[];
  tickers: Record<string, MiniTicker>;
  value: string;
  onPick: (s: string) => void;
};

const order = (symbols: SymbolInfo[]) => {
  const featured = FEATURED.map((f) => symbols.find((s) => s.symbol === f)).filter(
    (s): s is SymbolInfo => Boolean(s),
  );
  return [...featured, ...symbols.filter((s) => !FEATURED.includes(s.symbol))];
};

/** Markets rail: every listed market, priced, in one scan. */
export function Sidebar({ symbols, tickers, value, onPick }: Props) {
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const list = order(symbols);
    return q ? list.filter((s) => s.symbol.toLowerCase().includes(q.toLowerCase())) : list;
  }, [symbols, q]);

  return (
    <aside className="flex w-[212px] shrink-0 flex-col border-r border-line bg-panel">
      <div className="flex items-center gap-2 border-b border-line px-2.5 py-2">
        <IconSearch size={13} className="text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search market"
          className="w-full bg-transparent text-[12px] outline-none placeholder:text-muted"
        />
      </div>

      <div className="flex items-center justify-between px-2.5 py-1.5">
        <span className="label">perpetuals</span>
        <span className="label">{rows.length}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.map((s) => {
          const t = tickers[s.symbol];
          return (
            <button
              key={s.symbol}
              onClick={() => onPick(s.symbol)}
              className={cn(
                'flex w-full items-center justify-between px-2.5 py-1.5 text-left transition-colors',
                s.symbol === value ? 'bg-panel-2' : 'hover:bg-panel-2/60',
              )}
            >
              <span className="flex flex-col">
                <span className={cn('text-[12px]', s.symbol === value ? 'text-fg' : 'text-fg/90')}>
                  {s.symbol}
                </span>
                <span className="text-[10px] text-muted">perp</span>
              </span>
              <span className="flex flex-col items-end">
                <span className="num text-[12px]">{t ? price(t.last) : '—'}</span>
                <span
                  className={cn('num text-[10px]', (t?.pct ?? 0) >= 0 ? 'text-long' : 'text-short')}
                >
                  {t ? pct(t.pct) : '—'}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
