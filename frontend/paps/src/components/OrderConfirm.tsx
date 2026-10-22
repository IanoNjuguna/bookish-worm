import { cn } from '../lib/cn';
import { price, qty, usd } from '../lib/format';
import type { TradeApi } from '../hooks/useVenueTrade';

/**
 * The second half of the two-click rule.
 *
 * This panel is the whole of what is about to be sent: the symbol, the side as the venue
 * will read it, the entry type and price, the size at the market's step, the notional, and
 * both fees — the builder's cut and Strike's taker rate — before a live order exists.
 * Nothing here can send twice: while `busy` the button is off, and `confirm` itself
 * refuses when a send is in flight.
 */
export function OrderConfirm({ trade, mark }: { trade: TradeApi; mark?: number }) {
  const intent = trade.intent;

  // A refusal before anything was armed: there is no order to describe, only a reason.
  if (!intent) {
    if (!trade.message) return null;
    return (
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="order refused"
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center"
      >
        <div className="w-full max-w-[420px] border border-line bg-panel p-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-brand">nothing was sent</p>
          <p className="mt-1 text-[13px]">{trade.message}</p>
          <button
            onClick={trade.discard}
            className="mt-3 w-full border border-line py-2 text-[12px] text-muted hover:text-fg"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  const { draft, body, notional } = intent;
  const base = draft.symbol.split('-')[0];
  const fees = trade.fees;
  const settled = trade.stage === 'accepted' && trade.lastAccepted;
  const sending = trade.stage === 'sending';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="confirm live order"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center"
    >
      <div className="w-full max-w-[420px] border border-line bg-panel">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <span className="text-[10px] uppercase tracking-[0.12em] text-brand">
            {settled ? 'accepted' : 'live order · real money'}
          </span>
          <span className="num text-[10px] text-muted">{body.client_order_id}</span>
        </div>

        <div className="px-3 py-2">
          <h3 className="text-[15px] font-semibold">
            {draft.side === 'LONG' ? 'Buy' : 'Sell'} {base}
          </h3>
          <dl className="mt-2 space-y-1 text-[11px]">
            <Line k="symbol" v={draft.symbol} />
            <Line k="side" v={body.side} />
            <Line k="type" v={body.type} />
            {body.price ? (
              <Line k="limit price" v={`$${price(body.price)}`} />
            ) : (
              <Line k="reference" v={mark ? `$${price(mark)}` : 'mark'} />
            )}
            <Line k="size" v={`${qty(body.size)} ${base}`} />
            <Line k="notional" v={`$${usd(notional)}`} />
            <Line k="time in force" v={body.time_in_force ?? 'GTC'} />
            {draft.leverage ? <Line k="leverage" v={`${draft.leverage}×`} /> : null}
            {body.reduce_only ? <Line k="reduce only" v="yes" /> : null}
            {fees && (
              <>
                <Line
                  k={`builder fee ${(fees.builderBps / 100).toFixed(1)}% (paps)`}
                  v={`$${usd(fees.builder)}`}
                />
                <Line
                  k={
                    fees.known
                      ? `strike taker ${fees.takerBps.toFixed(1)} bps`
                      : 'strike taker (5 bps fallback)'
                  }
                  v={`$${usd(fees.strike)}`}
                />
                <Line k="fees total" v={`$${usd(fees.total)}`} strong />
              </>
            )}
          </dl>
        </div>

        {trade.message && trade.stage === 'rejected' && (
          <p className="mx-3 mb-2 border border-short/40 bg-short/10 px-2 py-1 text-[11px] text-short">
            {trade.message}
          </p>
        )}

        {settled && (
          <p className="mx-3 mb-2 text-[11px] text-muted">
            accepted · seq {settled.sequenceId} — this is not a fill. It fills when the venue says so.
          </p>
        )}

        {trade.block && !settled && (
          <p className="mx-3 mb-2 text-[11px] text-short">{trade.block}</p>
        )}

        <div className="grid grid-cols-2 gap-1.5 p-3 pt-0">
          <button
            onClick={trade.discard}
            className="border border-line py-2 text-[12px] text-muted hover:text-fg"
          >
            {settled ? 'Close' : 'Cancel'}
          </button>
          <button
            onClick={trade.confirm}
            disabled={sending || trade.busy || Boolean(trade.block) || Boolean(settled)}
            className={cn(
              'py-2 text-[12px] font-semibold text-black transition-opacity',
              draft.side === 'LONG' ? 'bg-long' : 'bg-short',
              (sending || trade.busy || trade.block) && 'opacity-40',
            )}
          >
            {settled
              ? 'Accepted'
              : sending
                ? 'Sending…'
                : trade.stage === 'rejected'
                  ? 'Retry live order'
                  : 'Send live order'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Line({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className={cn('num', strong && 'text-fg')}>{v}</dd>
    </div>
  );
}
