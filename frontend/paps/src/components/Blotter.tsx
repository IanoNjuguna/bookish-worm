import { useState } from 'react';
import { cn } from '../lib/cn';
import { price, signedUsd, usd } from '../lib/format';
import { liquidationPrice, roe, unrealised, type Position } from '../lib/order';
import type { Fill, WorkingOrder } from '../lib/store';

type Props = {
  positions: Position[];
  orders: WorkingOrder[];
  fills: Fill[];
  equity: number;
  mark: number;
  marks: Record<string, number>;
  symbol: string;
  onClose: (id: string, mark: number, fraction?: number) => void;
  onCloseAll: (mark: number) => void;
  onCancel: (id: string) => void;
};

type TabKey = 'positions' | 'orders' | 'history' | 'balances';

/** The blotter: what you hold, what is working, what happened, what you have. */
export function Blotter({
  positions,
  orders,
  fills,
  equity,
  mark,
  marks,
  symbol,
  onClose,
  onCloseAll,
  onCancel,
}: Props) {
  const [tab, setTab] = useState<TabKey>('positions');
  const open = orders.filter((o) => o.status === 'open');

  const pnl = positions.reduce((n, p) => n + unrealised(p, mark), 0);
  const margin = positions.reduce((n, p) => n + p.margin, 0);

  const tabs: { key: TabKey; label: string; short: string; n?: number }[] = [
    { key: 'positions', label: 'Positions', short: 'Positions', n: positions.length },
    { key: 'orders', label: 'Open orders', short: 'Orders', n: open.length },
    { key: 'history', label: 'Order history', short: 'History', n: fills.length },
    { key: 'balances', label: 'Balances', short: 'Balance' },
  ];

  return (
    <section className="flex h-full min-h-0 flex-col border-t border-line bg-panel">
      <div className="flex items-center gap-3 overflow-x-auto border-b border-line px-1 scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn('tab whitespace-nowrap', tab === t.key && 'tab-active')}
          >
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.short}</span>
            {t.n !== undefined && <span className="ml-1 text-muted">({t.n})</span>}
          </button>
        ))}
        {positions.length > 0 && (
          <button
            onClick={() => onCloseAll(mark)}
            className="ml-auto border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-muted hover:text-fg"
          >
            close all
          </button>
        )}
        <span className={cn('pr-2 text-[10px] text-muted', positions.length ? '' : 'ml-auto')}>{symbol}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'positions' && (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-panel text-muted">
              <Th cols={['Market', 'Side', 'Size', 'Entry', 'Mark', 'Liq.', 'Margin', 'Funding', 'uPnL', 'ROE', '']} />
            </thead>
            <tbody>
              {positions.map((p) => {
                const pMark = marks[p.symbol] ?? mark;
                const up = unrealised(p, pMark);
                const liq = liquidationPrice(p.side, p.entry, p.margin, p.size);
                return (
                  <tr key={p.id} className="border-b border-line/50">
                    <Td>{p.symbol}</Td>
                    <Td>
                      <span className={cn('px-1.5 py-0.5 text-[10px]', p.side === 'LONG' ? 'bg-long/15 text-long' : 'bg-short/15 text-short')}>
                        {p.side}
                      </span>
                    </Td>
                    <Td num>{p.size.toLocaleString('en-US')}</Td>
                    <Td num>{price(p.entry)}</Td>
                    <Td num>{price(pMark)}</Td>
                    <Td num muted>{liq ? price(liq) : '—'}</Td>
                    <Td num>${usd(p.margin)}</Td>
                    <Td
                      num
                      muted={!p.funding}
                      tone={p.funding > 0 ? 'long' : p.funding < 0 ? 'short' : undefined}
                    >
                      {p.funding ? signedUsd(p.funding) : '—'}
                    </Td>
                    <Td num tone={up >= 0 ? 'long' : 'short'}>
                      {up >= 0 ? '+' : '−'}${usd(Math.abs(up))}
                    </Td>
                    <Td num tone={up >= 0 ? 'long' : 'short'}>{roe(p, pMark).toFixed(1)}%</Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onClose(p.id, pMark, 0.5)}
                          className="border border-line px-1.5 py-0.5 text-[10px] text-muted hover:text-fg"
                          title="close half"
                        >
                          ½
                        </button>
                        <button
                          onClick={() => onClose(p.id, pMark, 1)}
                          className="border border-line px-1.5 py-0.5 text-[10px] text-muted hover:text-fg"
                        >
                          close
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {!positions.length && <Empty cols={11} text="No positions. Open a paper position to see it marked live." />}
            </tbody>
          </table>
        )}

        {tab === 'orders' && (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-panel text-muted">
              <Th cols={['Market', 'Side', 'Type', 'Price', 'Size', 'Filled', 'Time', '']} />
            </thead>
            <tbody>
              {open.map((o) => (
                <tr key={o.id} className="border-b border-line/50">
                  <Td>{o.symbol}</Td>
                  <Td tone={o.side === 'LONG' ? 'long' : 'short'}>{o.side}</Td>
                  <Td muted>{o.kind}</Td>
                  <Td num>{price(o.price)}</Td>
                  <Td num>{o.size.toLocaleString('en-US')}</Td>
                  <Td num muted>0</Td>
                  <Td num muted>{new Date(o.createdAt).toLocaleTimeString('en-GB', { hour12: false })}</Td>
                  <Td>
                    <button
                      onClick={() => onCancel(o.id)}
                      className="border border-line px-2 py-0.5 text-[10px] text-muted hover:text-fg"
                    >
                      cancel
                    </button>
                  </Td>
                </tr>
              ))}
              {!open.length && <Empty cols={8} text="No working orders." />}
            </tbody>
          </table>
        )}

        {tab === 'history' && (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-panel text-muted">
              <Th cols={['Time', 'Market', 'Side', 'Price', 'Size', 'Fee']} />
            </thead>
            <tbody>
              {fills.map((f) => (
                <tr key={f.id} className="border-b border-line/50">
                  <Td num muted>{new Date(f.time).toLocaleTimeString('en-GB', { hour12: false })}</Td>
                  <Td>{f.symbol}</Td>
                  <Td tone={f.side === 'LONG' ? 'long' : 'short'}>{f.side}</Td>
                  <Td num>{price(f.price)}</Td>
                  <Td num>{f.size.toLocaleString('en-US')}</Td>
                  <Td num muted>${usd(f.fee)}</Td>
                </tr>
              ))}
              {!fills.length && <Empty cols={6} text="No fills yet." />}
            </tbody>
          </table>
        )}

        {tab === 'balances' && (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-panel text-muted">
              <Th cols={['Asset', 'Equity', 'Used margin', 'Free', 'uPnL']} />
            </thead>
            <tbody>
              <tr className="border-b border-line/50">
                <Td>USD (paper)</Td>
                <Td num>${usd(equity + pnl)}</Td>
                <Td num>${usd(margin)}</Td>
                <Td num>${usd(equity + pnl - margin)}</Td>
                <Td num tone={pnl >= 0 ? 'long' : 'short'}>
                  {pnl >= 0 ? '+' : '−'}${usd(Math.abs(pnl))}
                </Td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

const Th = ({ cols }: { cols: string[] }) => (
  <tr className="border-b border-line">
    {cols.map((c) => (
      <th key={c} className="px-3 py-1.5 text-left font-normal first:pl-3">
        {c}
      </th>
    ))}
  </tr>
);

const Td = ({
  children,
  num,
  muted,
  tone,
}: {
  children: React.ReactNode;
  num?: boolean;
  muted?: boolean;
  tone?: 'long' | 'short';
}) => (
  <td
    className={cn(
      'px-3 py-1.5',
      num && 'num',
      muted && 'text-muted',
      tone === 'long' && 'text-long',
      tone === 'short' && 'text-short',
    )}
  >
    {children}
  </td>
);

const Empty = ({ cols, text }: { cols: number; text: string }) => (
  <tr>
    <td colSpan={cols} className="px-3 py-6 text-center text-[11px] text-muted">
      {text}
    </td>
  </tr>
);
