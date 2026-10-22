import { useCallback, useMemo, useRef, useState } from 'react';
import { type Side } from '../lib/order';
import {
  IDLE_PLACE,
  accepted as markAccepted,
  arm,
  canConfirm,
  discard as discardPlace,
  refuse,
  rejected,
  sending,
  tradeBlock,
  type OrderIntent,
  type PlaceStage,
  type PlaceState,
  type TradeDraft,
} from '../lib/strike/intent';
import {
  bodyFor,
  cancelAll,
  cancelOrder,
  newClientOrderId,
  placeOrder,
  planClose,
  planOrder,
  reconcilePending,
  setLeverage,
  type MarketFilters,
  type OrderBody,
  type PendingOrder,
  type VenueOrder,
} from '../lib/strike/orders';
import type { VenuePosition } from '../lib/strike/venue';
import type { VenueState } from '../lib/strike/venue-client';
import { useFeeRate } from './useFeeRate';

/**
 * Placing, closing and cancelling, wired to the venue.
 *
 * The rules this hook exists to enforce:
 *
 * - Two clicks, one order. The first arms an intent and shows exactly what will be sent;
 *   only the second sends, and while it is sending the CTA is off rather than merely slow.
 * - A failed placement is never retried here. The intent survives with its
 *   `client_order_id`, so a retry the trader asks for is the same order to the venue.
 * - An accepted order is `accepted · seq N` until a read taken after it lands. It is never
 *   optimistically filled: fills come from the venue's fill history or not at all.
 * - No session state but `live` may send anything, and a connected account never falls back
 *   to the paper engine.
 */

export type TradeFees = {
  builderBps: number;
  /** The venue's taker rate in basis points, and whether it is the real schedule. */
  takerBps: number;
  known: boolean;
  builder: number;
  strike: number;
  total: number;
};

export type LastAccepted = { clientOrderId: string; sequenceId: number; symbol: string };

export type TradeApi = {
  stage: PlaceStage;
  intent: OrderIntent | null;
  /** Why this intent was refused, in the venue's words when it had any. */
  message: string | null;
  /** Why the CTA is off. Null when it may spend money. */
  block: string | null;
  /** Anything the panels could not do: a refused cancel, a close the venue rejected. */
  notice: string | null;
  busy: boolean;
  pending: PendingOrder[];
  lastAccepted: LastAccepted | null;
  fees: TradeFees | null;
  place: (draft: TradeDraft) => void;
  confirm: () => void;
  discard: () => void;
  dismissNotice: () => void;
  cancel: (order: VenueOrder) => void;
  cancelEvery: (symbol?: string) => void;
  close: (position: VenuePosition, fraction: 1 | 0.5, mark: number) => void;
};

type Options = {
  session: boolean;
  venue: VenueState;
  refresh: () => void;
  /** The builder's cut from the connect consent. 100 is the 1% paps charges. */
  builderBps: number;
  filtersFor: (symbol: string) => MarketFilters;
};

const messageOf = (e: unknown): string =>
  e instanceof Error && e.message ? e.message : 'the venue did not answer';

export function useVenueTrade(opts: Options): TradeApi | null {
  const { session, venue, refresh, builderBps, filtersFor } = opts;
  const [place, setPlace] = useState<PlaceState>(IDLE_PLACE);
  const [pending, setPending] = useState<PendingOrder[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [last, setLast] = useState<LastAccepted | null>(null);
  const [busy, setBusy] = useState(false);

  // A ref, not the state: two clicks in one tick both read `busy === false` otherwise.
  const inFlight = useRef(false);
  const feeRate = useFeeRate();

  const block = tradeBlock(venue.status);
  const settings = venue.data?.account.symbolSettings;

  /**
   * The ticket's margin and liquidation price are computed for the leverage it shows, so the
   * venue has to be at that leverage before the order exists. Sent once per placement, and
   * only when it differs from the account's own setting.
   */
  const ensureLeverage = useCallback(
    async (symbol: string, leverage?: number) => {
      if (!leverage) return;
      const current = settings?.[symbol]?.leverage;
      if (current && Math.round(current) === Math.round(leverage)) return;
      try {
        await setLeverage({ symbol, leverage });
      } catch (e) {
        // Say which call was refused: otherwise the trader blames the order they just confirmed.
        throw new Error(`could not set ${symbol} leverage to ${leverage}× — ${messageOf(e)}`);
      }
    },
    [settings],
  );

  // The local echo of a send, until the venue's own read takes the row over.
  const live = reconcilePending({
    pending,
    open: venue.data?.orders ?? [],
    fills: venue.data?.fills ?? [],
    now: Date.now(),
  });

  const send = useCallback(
    async (
      body: OrderBody,
      meta: Omit<PendingOrder, 'clientOrderId' | 'sequenceId' | 'acceptedAt'>,
      leverage?: number,
    ) => {
      if (inFlight.current) throw new Error('the previous order is still in flight');
      inFlight.current = true;
      setBusy(true);
      try {
        // The ticket priced this order at its own leverage, so the venue has to agree before
        // the order exists. A refusal here stops the placement; nothing has been sent.
        await ensureLeverage(body.symbol, leverage);
        const ack = await placeOrder(body);
        const clientOrderId = ack.clientOrderId || body.client_order_id;
        setPending((prev) =>
          [
            {
              ...meta,
              clientOrderId,
              sequenceId: ack.sequenceId,
              acceptedAt: Date.now(),
            },
            ...prev.filter((p) => p.clientOrderId !== clientOrderId),
          ].slice(0, 10),
        );
        setLast({ clientOrderId, sequenceId: ack.sequenceId, symbol: body.symbol });
        refresh();
      } finally {
        inFlight.current = false;
        setBusy(false);
      }
    },
    [refresh, ensureLeverage],
  );

  const confirm = useCallback(() => {
    const intent = place.intent;
    if (!intent || !canConfirm(place, block)) return;
    setPlace(sending);
    void send(
      intent.body,
      {
        symbol: intent.body.symbol,
        side: intent.draft.side,
        type: intent.draft.kind,
        size: intent.body.size,
        price: intent.body.price ?? '',
        notional: intent.notional,
      },
      intent.draft.leverage,
    )
      .then(() => setPlace(markAccepted))
      .catch((e: unknown) => setPlace((prev) => rejected(prev, messageOf(e))));
  }, [place, block, send]);

  const placeOrderFor = useCallback(
    (draft: TradeDraft) => {
      if (block) {
        setPlace(refuse(block));
        return;
      }
      const result = planOrder({ ...draft, filters: filtersFor(draft.symbol) });
      if (!result.ok) {
        setPlace(refuse(result.reason));
        return;
      }
      setNotice(null);
      setPlace((prev) => arm(prev, draft, result.plan, newClientOrderId));
    },
    [block, filtersFor],
  );

  const close = useCallback(
    (position: VenuePosition, fraction: 1 | 0.5, mark: number) => {
      if (block) {
        setNotice(block);
        return;
      }
      const result = planClose({ position, fraction, mark, filters: filtersFor(position.symbol) });
      if (!result.ok) {
        setNotice(result.reason);
        return;
      }
      setNotice(null);
      const side: Side = position.side === 'LONG' ? 'SHORT' : 'LONG';
      void send(bodyFor(result.plan, newClientOrderId()), {
        symbol: position.symbol,
        side,
        type: 'market',
        size: result.plan.fields.size,
        price: '',
        notional: result.plan.notional,
      }).catch((e: unknown) => setNotice(messageOf(e)));
    },
    [block, filtersFor, send],
  );

  const cancel = useCallback(
    (order: VenueOrder) => {
      if (block) {
        setNotice(block);
        return;
      }
      setNotice(null);
      void cancelOrder({ orderId: order.id, symbol: order.symbol })
        .then(refresh)
        .catch((e: unknown) => setNotice(messageOf(e)));
    },
    [block, refresh],
  );

  const cancelEvery = useCallback(
    (symbol?: string) => {
      if (block) {
        setNotice(block);
        return;
      }
      setNotice(null);
      void cancelAll(symbol)
        .then(refresh)
        .catch((e: unknown) => setNotice(messageOf(e)));
    },
    [block, refresh],
  );

  const fees: TradeFees | null = useMemo(() => {
    if (!place.intent) return null;
    const notional = place.intent.notional;
    const builder = (notional * builderBps) / 10_000;
    const strike = notional * feeRate.taker;
    return {
      builderBps,
      takerBps: feeRate.taker * 10_000,
      known: feeRate.known,
      builder,
      strike,
      total: builder + strike,
    };
  }, [place.intent, builderBps, feeRate]);

  if (!session) return null;

  return {
    stage: place.stage,
    intent: place.intent,
    message: place.message,
    block,
    notice,
    busy,
    pending: live,
    lastAccepted: last,
    fees,
    place: placeOrderFor,
    confirm,
    discard: () => setPlace(discardPlace()),
    dismissNotice: () => setNotice(null),
    cancel,
    cancelEvery,
    close,
  };
}
