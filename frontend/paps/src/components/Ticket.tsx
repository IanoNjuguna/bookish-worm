import { useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { LEVERAGES } from '../lib/constants';
import { price, usd } from '../lib/format';
import { bps } from '../lib/strike/fees';
import { useFeeRate } from '../hooks/useFeeRate';
import { DEFAULT_TIER, liquidationPrice, notionalOf, sizeForNotional, type Side } from '../lib/order';
import type { SymbolInfo } from '../lib/types';

type Props = {
  symbol: string;
  info: SymbolInfo | undefined;
  mark: number;
  picked: string;
  equity: number;
  /** A Strike session exists, so the CTA has to say that it still does not trade. */
  session?: boolean;
  onPlace: (o: { side: Side; kind: 'limit' | 'market'; price: number; size: number; leverage: number }) => void;
};

/** OKX-shaped ticket: type tabs, margin mode and leverage above, cost below. */
export function Ticket({ symbol, info, mark, picked, equity, session = false, onPlace }: Props) {
  const [kind, setKind] = useState<'limit' | 'market'>('limit');
  const [priceInput, setPriceInput] = useState('');
  const [notional, setNotional] = useState('500');
  const [leverage, setLeverage] = useState(10);
  const [pctOfEquity, setPct] = useState(25);
  const [error, setError] = useState<string | null>(null);

  const f = useMemo(() => {
    const filters = info?.filters ?? [];
    const find = (t: string) => filters.find((x) => x.filterType === t);
    return {
      tick: Number(find('PRICE_FILTER')?.tickSize ?? 0.0001),
      step: Number(find('LOT_SIZE')?.stepSize ?? 1),
      minNotional: Number(find('MIN_NOTIONAL')?.notional ?? 10),
    };
  }, [info]);

  const typed = Number(priceInput || picked || 0);
  const entry = kind === 'market' || !typed ? mark : typed;
  const size = sizeForNotional(Number(notional || 0), entry, f.step);
  const notionalValue = notionalOf(entry, size);
  const margin = notionalValue / leverage;
  const feeRate = useFeeRate();
  const fee = notionalValue * feeRate.taker;
  const base = symbol.split('-')[0];

  const submit = (side: Side) => {
    setError(null);
    if (!entry) return setError('waiting for a price');
    if (notionalValue < f.minNotional) return setError(`minimum order $${f.minNotional}`);
    onPlace({ side, kind, price: entry, size, leverage });
  };

  return (
    <section className="flex w-[292px] shrink-0 flex-col border-l border-line bg-panel">
      <div className="flex items-center border-b border-line px-1">
        {(['limit', 'market'] as const).map((k) => (
          <button key={k} onClick={() => setKind(k)} className={cn('tab capitalize', k === kind && 'tab-active')}>
            {k}
          </button>
        ))}
        <span className="ml-auto pr-2 text-[10px] uppercase tracking-[0.1em] text-brand">
          {session ? 'paper · not sent' : 'paper'}
        </span>
      </div>

      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="text-[11px] text-muted">Isolated</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted">Leverage</span>
          <span className="num text-[12px]">{leverage}×</span>
        </div>
      </div>

      <div className="flex gap-1 border-b border-line px-2 py-1.5">
        {LEVERAGES.map((l) => (
          <button
            key={l}
            onClick={() => setLeverage(l)}
            className={cn(
              'num flex-1 py-1 text-[10px] transition-colors',
              l === leverage ? 'bg-panel-2 text-fg' : 'text-muted hover:bg-panel-2/60',
            )}
          >
            {l}×
          </button>
        ))}
      </div>

      <div className="space-y-2.5 p-3">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] text-muted">Price</span>
            <span className="text-[10px] text-muted">USD</span>
          </div>
          <input
            value={kind === 'market' ? price(mark) : priceInput || picked}
            disabled={kind === 'market'}
            onChange={(e) => setPriceInput(e.target.value)}
            inputMode="decimal"
            placeholder={price(mark)}
            className="field num disabled:text-muted"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] text-muted">Size</span>
            <span className="text-[10px] text-muted">USD</span>
          </div>
          <input
            value={notional}
            onChange={(e) => setNotional(e.target.value)}
            inputMode="decimal"
            className="field num"
          />
          <input
            type="range"
            min={0}
            max={100}
            step={25}
            value={pctOfEquity}
            onChange={(e) => {
              const pct = Number(e.target.value);
              setPct(pct);
              const budget = (equity * leverage * pct) / 100;
              setNotional(String(Math.max(f.minNotional, Math.round(budget))));
            }}
            className="mt-2.5"
          />
          <div className="mt-1 flex justify-between text-[9px] text-muted">
            {[0, 25, 50, 75, 100].map((p) => (
              <span key={p}>{p}%</span>
            ))}
          </div>
        </div>

        <dl className="space-y-1 border-t border-line pt-2 text-[11px]">
          <Row k="qty" v={`${size.toLocaleString('en-US')} ${base}`} />
          <Row k="notional" v={`$${usd(notionalValue)}`} />
          <Row k="margin" v={`$${usd(margin)}`} />
          <Row
            k="liq. long / short"
            v={`${fmtLiq('LONG', entry, margin, size)} / ${fmtLiq('SHORT', entry, margin, size)}`}
          />
          <Row
            k={feeRate.known ? `fee (taker ${bps(feeRate.taker)})` : 'fee (taker, 5 bps fallback)'}
            v={`$${usd(fee)}`}
          />
        </dl>

        {error && <p className="text-[11px] text-short">{error}</p>}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-1.5 p-3 pt-0">
        <button
          onClick={() => submit('LONG')}
          className="flex flex-col items-center bg-long py-2 text-black transition-opacity hover:opacity-90"
        >
          <span className="text-[12px] font-semibold">Open long</span>
          <span className="text-[9px] uppercase tracking-[0.12em] text-black/60">
            {session ? 'still paper' : 'paper'}
          </span>
        </button>
        <button
          onClick={() => submit('SHORT')}
          className="flex flex-col items-center bg-short py-2 text-black transition-opacity hover:opacity-90"
        >
          <span className="text-[12px] font-semibold">Open short</span>
          <span className="text-[9px] uppercase tracking-[0.12em] text-black/60">
            {session ? 'still paper' : 'paper'}
          </span>
        </button>
      </div>
    </section>
  );
}

const fmtLiq = (side: Side, entry: number, margin: number, size: number): string => {
  const lp = liquidationPrice(side, entry, margin, size, DEFAULT_TIER);
  return lp ? price(lp) : '—';
};

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className="num">{v}</dd>
    </div>
  );
}
