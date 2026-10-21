import { useMemo, useState } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { cn } from '../lib/cn';
import { price, pct } from '../lib/format';
import { FEATURED } from '../lib/constants';
import type { SymbolInfo } from '../lib/types';
import type { MiniTicker } from '../hooks/useMiniTickers';

type Props = {
  open: boolean;
  symbols: SymbolInfo[];
  tickers: Record<string, MiniTicker>;
  watchlist: string[];
  value: string;
  onPick: (s: string) => void;
  onClose: () => void;
};

/**
 * Market picker for Lite, where there is no rail to click. A sheet, not a route: the
 * trader is mid-decision and should not lose the ticket.
 */
export function MarketSheet({ open, symbols, tickers, watchlist, value, onPick, onClose }: Props) {
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const ranked = [...symbols].sort((a, b) => {
      const aw = watchlist.includes(a.symbol) ? 0 : 1;
      const bw = watchlist.includes(b.symbol) ? 0 : 1;
      if (aw !== bw) return aw - bw;
      const af = FEATURED.includes(a.symbol) ? 0 : 1;
      const bf = FEATURED.includes(b.symbol) ? 0 : 1;
      if (af !== bf) return af - bf;
      return Math.abs(tickers[b.symbol]?.pct ?? 0) - Math.abs(tickers[a.symbol]?.pct ?? 0);
    });
    return q ? ranked.filter((s) => s.symbol.toLowerCase().includes(q.toLowerCase())) : ranked;
  }, [symbols, tickers, watchlist, q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button aria-label="close" onClick={onClose} className="flex-1 bg-black/60" />
      <div className="max-h-[72vh] border-t border-line bg-panel">
        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          <IconSearch size={13} className="text-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search market"
            className="w-full bg-transparent text-[12px] outline-none placeholder:text-muted"
          />
          <button onClick={onClose} className="text-muted hover:text-fg">
            <IconX size={14} />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(72vh - 44px)' }}>
          {rows.map((s) => {
            const t = tickers[s.symbol];
            const watching = watchlist.includes(s.symbol);
            return (
              <button
                key={s.symbol}
                onClick={() => {
                  onPick(s.symbol);
                  onClose();
                }}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-left',
                  s.symbol === value ? 'bg-panel-2' : 'hover:bg-panel-2/70',
                )}
              >
                <span className="flex items-center gap-2">
                  {s.symbol === value && <span className="h-3 w-[2px] bg-brand" />}
                  <span className="text-[12px]">{s.symbol}</span>
                  {watching && (
                    <span className="text-[9px] uppercase tracking-[0.08em] text-brand">watch</span>
                  )}
                </span>
                <span className="flex items-center gap-3">
                  <span className="num text-[12px]">{t ? price(t.last) : '—'}</span>
                  <span
                    className={cn('num w-14 text-right text-[11px]', (t?.pct ?? 0) >= 0 ? 'text-long' : 'text-short')}
                  >
                    {t ? pct(t.pct) : '—'}
                  </span>
                </span>
              </button>
            );
          })}
          {!rows.length && <p className="px-3 py-4 text-[11px] text-muted">No market matches that.</p>}
        </div>
      </div>
    </div>
  );
}
