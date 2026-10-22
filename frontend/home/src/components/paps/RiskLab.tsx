import { useEffect, useMemo, useState } from 'react';

const API = 'https://api.strikefinance.org/price/v2';
const MMR = 0.005; // maintenance margin ratio, same default the app trades with
const TAKER_FEE = 0.0005;

/**
 * The liquidation maths is copied from the app (`frontend/paps/src/lib/order.ts`) rather
 * than approximated, because a landing page that quotes a different number from the
 * product it advertises is a lie with a nice font.
 *
 *   LP = (entry − (isolatedBalance + MA) / (direction × size)) / (1 − direction × MMR)
 */
function liquidationPrice(leverage: number, entry: number): number {
  if (entry <= 0) return 0;
  const margin = entry / leverage; // per unit of size
  const lp = (entry - margin / 1) / (1 - MMR);
  return lp > 0 && lp < entry ? lp : 0;
}

const amounts = [50, 100, 250, 500];
const leverages = [2, 3, 5, 10, 20];

export function RiskLab() {
  const [price, setPrice] = useState<number | null>(null);
  const [amount, setAmount] = useState(100);
  const [leverage, setLeverage] = useState(5);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // The symbol query returns a single object on this endpoint, not a list, so the
        // whole board is fetched and searched — the same call the live strip makes.
        const res = await fetch(`${API}/ticker/24hr`);
        if (!res.ok) throw new Error(String(res.status));
        const rows = (await res.json()) as { symbol: string; lastPrice: string }[];
        const ada = rows.find((r) => r.symbol === 'ADA-USD');
        if (ada && !cancelled) setPrice(Number(ada.lastPrice));
      } catch {
        /* the widget shows dashes rather than a made-up price */
      }
    };
    void load();
    const id = window.setInterval(load, 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const numbers = useMemo(() => {
    if (!price) return null;
    const notional = amount * leverage;
    const size = notional / price;
    const liq = liquidationPrice(leverage, price);
    const distance = liq ? ((price - liq) / price) * 100 : 0;
    const fee = notional * TAKER_FEE;
    return { notional, size, liq, distance, fee };
  }, [amount, leverage, price]);

  return (
    <div className="rounded-lg border border-paps-line bg-paps-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[15px] text-paps-fg">Try it with ADA</h3>
        <span className="font-mono text-[12px] text-paps-muted">
          mark {price ? `$${price.toFixed(4)}` : '—'}
        </span>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <div className="flex items-baseline justify-between text-[12px] text-paps-muted">
            <span>you risk</span>
            <span className="font-mono text-paps-fg">${amount}</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {amounts.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`flex-1 rounded-md py-2 text-[12px] transition-colors ${
                  a === amount ? 'bg-paps-fg text-paps-canvas' : 'bg-paps-panel2 text-paps-muted hover:text-paps-fg'
                }`}
              >
                ${a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between text-[12px] text-paps-muted">
            <span>at leverage</span>
            <span className="font-mono text-paps-fg">{leverage}×</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {leverages.map((l) => (
              <button
                key={l}
                onClick={() => setLeverage(l)}
                className={`flex-1 rounded-md py-2 text-[12px] transition-colors ${
                  l === leverage ? 'bg-paps-fg text-paps-canvas' : 'bg-paps-panel2 text-paps-muted hover:text-paps-fg'
                }`}
              >
                {l}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-paps-line pt-4">
        {[
          { k: 'position', v: numbers ? `$${numbers.notional.toLocaleString('en-US')}` : '—' },
          { k: 'liquidated at', v: numbers?.liq ? `$${numbers.liq.toFixed(4)}` : '—' },
          { k: 'that is', v: numbers ? `${numbers.distance.toFixed(1)}% away` : '—' },
        ].map((s) => (
          <div key={s.k}>
            <p className="text-[10px] uppercase tracking-[0.1em] text-paps-muted">{s.k}</p>
            <p className="mt-1 font-mono text-[14px] text-paps-fg">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-paps-line pt-4">
        <p className="text-[10px] uppercase tracking-[0.1em] text-paps-muted">
          distance to liquidation, same formula
        </p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
          {[2, 5, 10, 20, 50].map((l) => {
            const lp = price ? liquidationPrice(l, price) : 0;
            const d = price && lp ? ((price - lp) / price) * 100 : 0;
            return (
              <span key={l} className="font-mono text-[12px] text-paps-muted">
                {l}× <span className="text-paps-fg">{d ? `${d.toFixed(1)}%` : '—'}</span>
              </span>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-paps-muted">
        {numbers ? (
          <>
            If ADA falls to <span className="font-mono text-paps-fg">${numbers.liq.toFixed(4)}</span>, the
            position closes on its own and you have lost{' '}
            <span className="font-mono text-paps-fg">${amount.toFixed(2)}</span>. Not more. That is the
            whole point of knowing the number before you tap.
          </>
        ) : (
          'Waiting for a live mark from Strike. The numbers stay blank rather than guessed.'
        )}
      </p>
    </div>
  );
}
