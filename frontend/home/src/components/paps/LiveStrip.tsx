import { useEffect, useState } from 'react';

const MARKETS = ['ADA-USD', 'ETH-USD', 'BTC-USD'];
const API = 'https://api.strikefinance.org/price/v2';

type Row = { symbol: string; last: number; pct: number };

const fmt = (v: number) =>
  v >= 1000 ? v.toLocaleString('en-US', { maximumFractionDigits: 0 }) : v.toFixed(v >= 1 ? 2 : 4);

/**
 * The one animation on this page that is not decoration: real marks off Strike's public
 * endpoint, ticking. If the network or the endpoint is unavailable the strip says so
 * rather than showing invented numbers.
 */
export function LiveStrip() {
  const [rows, setRows] = useState<Row[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`${API}/ticker/24hr`);
        if (!res.ok) throw new Error(String(res.status));
        const all = (await res.json()) as { symbol: string; lastPrice: string; priceChangePercent: string }[];
        const picked = MARKETS.map((m) => all.find((r) => r.symbol === m)).filter(Boolean) as typeof all;

        if (!cancelled) {
          setRows(
            picked.map((r) => ({
              symbol: r.symbol,
              last: Number(r.lastPrice),
              pct: Number(r.priceChangePercent),
            })),
          );
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    void load();
    const id = window.setInterval(load, 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-paps-line/70 py-3 text-[12px] text-paps-muted">
      <span className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-paps-long" aria-hidden="true" />
        live from Strike
      </span>

      {failed && <span>prices unavailable right now</span>}

      {rows.map((r) => (
        <span key={r.symbol} className="flex items-baseline gap-2">
          <span className="text-paps-fg/80">{r.symbol.replace('-USD', '')}</span>
          <span className="font-mono tabular-nums text-paps-fg">{fmt(r.last)}</span>
          <span className={r.pct >= 0 ? 'font-mono tabular-nums text-paps-long' : 'font-mono tabular-nums text-paps-short'}>
            {r.pct >= 0 ? '+' : '−'}
            {Math.abs(r.pct).toFixed(2)}%
          </span>
        </span>
      ))}

      {!rows.length && !failed && <span>loading marks…</span>}
    </div>
  );
}
