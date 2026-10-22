import { clock, price, qty, signedUsd } from '../lib/format';
import type { VenueFill } from '../lib/strike/orders';
import { Empty, Td, Th } from './Table';

/**
 * The venue's executions.
 *
 * This table is the only place in paps allowed to say a position filled, which is why it
 * shows the venue's own fee and realised PnL rather than anything recomputed here. An
 * `auto_close_type` is kept visible: a liquidation and a trader's own close read very
 * differently in a post-mortem.
 */
export function VenueFills({ fills }: { fills: VenueFill[] }) {
  return (
    <table className="w-full text-[11px] [&_td]:px-2 [&_th]:px-2">
      <thead className="sticky top-0 bg-panel text-muted">
        <Th cols={['Time', 'Market', 'Side', 'Role', 'Price', 'Size', 'Fee', 'PnL']} />
      </thead>
      <tbody>
        {fills.map((f) => {
          const pnl = Number(f.realizedPnl);
          return (
            <tr key={`${f.id}-${f.orderId}`} className="border-b border-line/50">
              <Td num muted>{f.at ? clock(f.at) : '—'}</Td>
              <Td>
                <span className="whitespace-nowrap">{f.symbol}</span>
              </Td>
              <Td tone={f.side === 'LONG' ? 'long' : 'short'}>{f.side}</Td>
              <Td muted>
                {f.role}
                {f.autoCloseType ? ` · ${f.autoCloseType}` : ''}
              </Td>
              <Td num>{price(f.price)}</Td>
              <Td num>{qty(f.size)}</Td>
              <Td num muted>{signedUsd(f.fee)}</Td>
              <Td num tone={pnl === 0 ? undefined : pnl > 0 ? 'long' : 'short'}>
                {signedUsd(f.realizedPnl)}
              </Td>
            </tr>
          );
        })}
        {!fills.length && <Empty cols={8} text="No fills on this account yet." />}
      </tbody>
    </table>
  );
}
