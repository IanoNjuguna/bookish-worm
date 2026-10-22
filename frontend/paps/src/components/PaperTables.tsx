import { price, usd } from '../lib/format';
import { liquidationPrice, roe, unrealised, type Position, type Side } from '../lib/order';
import type { Fill, WorkingOrder } from '../lib/store';
import { Empty, Td, Th } from './Table';

/** The paper ledger's tables, unchanged: this is what an unconnected account sees. */

/** Paper money, signed, at two decimals — the format this surface has always used. */
const signed2 = (v: number): string => `${v >= 0 ? '+' : '−'}$${usd(Math.abs(v))}`;

export function PaperPositions({
  positions,
  marks,
  mark,
  onClose,
}: {
  positions: Position[];
  marks: Record<string, number>;
  mark: number;
  onClose: (id: string, mark: number, fraction?: number) => void;
}) {
  return (
    <table className="w-full text-[11px]">
      <thead className="sticky top-0 bg-panel text-muted">
        <Th cols={['Market', 'Side', 'Size', 'Entry', 'Mark', 'Liq.', 'Margin', 'uPnL', 'ROE', '']} />
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
                <span className={sideClass(p.side)}>{p.side}</span>
              </Td>
              <Td num>{p.size.toLocaleString('en-US')}</Td>
              <Td num>{price(p.entry)}</Td>
              <Td num>{price(pMark)}</Td>
              <Td num muted>{liq ? price(liq) : '—'}</Td>
              <Td num>${usd(p.margin)}</Td>
              <Td num tone={up >= 0 ? 'long' : 'short'}>{signed2(up)}</Td>
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
        {!positions.length && <Empty cols={10} text="No positions. Open a paper position to see it marked live." />}
      </tbody>
    </table>
  );
}

export function PaperOrders({
  orders,
  onCancel,
}: {
  orders: WorkingOrder[];
  onCancel: (id: string) => void;
}) {
  return (
    <table className="w-full text-[11px]">
      <thead className="sticky top-0 bg-panel text-muted">
        <Th cols={['Market', 'Side', 'Type', 'Price', 'Size', 'Filled', 'Time', '']} />
      </thead>
      <tbody>
        {orders.map((o) => (
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
        {!orders.length && <Empty cols={8} text="No working orders." />}
      </tbody>
    </table>
  );
}

export function PaperHistory({ fills }: { fills: Fill[] }) {
  return (
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
  );
}

export function PaperBalances({
  equity,
  margin,
  pnl,
}: {
  equity: number;
  margin: number;
  pnl: number;
}) {
  return (
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
          <Td num tone={pnl >= 0 ? 'long' : 'short'}>{signed2(pnl)}</Td>
        </tr>
      </tbody>
    </table>
  );
}

const sideClass = (side: Side): string =>
  `px-1.5 py-0.5 text-[10px] ${side === 'LONG' ? 'bg-long/15 text-long' : 'bg-short/15 text-short'}`;
