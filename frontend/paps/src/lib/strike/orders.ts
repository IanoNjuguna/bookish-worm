import { decimalsFor, notionalOf, roundTo, type Side } from '../order';
import type { Filter } from '../types';
import { strikeGet, strikeSend } from './http';

/**
 * Orders: the part of paps that spends money.
 *
 * Three rules hold this file together.
 *
 * 1. A 201 from `POST /v2/order` is acceptance, not a fill. Nothing here ever reports a
 *    fill; fills come back from `/v2/history/fill` and nowhere else.
 * 2. `client_order_id` is the idempotency key. It is minted once per intent by the caller
 *    and reused by every retry of that intent, so a resent request cannot become a second
 *    position.
 * 3. Sizes and prices are the market's decimals, not the browser's. They are rounded to the
 *    `stepSize` and `tickSize` that `exchangeInfo` publishes, with the same helpers the
 *    paper path uses, and sent as decimal strings so a float never reaches the wire.
 */

/* ------------------------------------------------------------------ wire shapes */

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'limit' | 'market';
export type TimeInForce = 'GTC' | 'IOC' | 'FOK';

/** `POST /v2/order`. Amounts are decimal strings; `price` is required for limits only. */
export type OrderBody = {
  client_order_id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  size: string;
  price?: string;
  time_in_force?: TimeInForce;
  reduce_only?: boolean;
};

/** What the venue accepts an order into the engine with. Not a fill. */
export type AcceptedOrder = {
  clientOrderId: string;
  accountId: string;
  symbol: string;
  sequenceId: number;
  messageId: string;
};

type RawAccepted = {
  client_order_id?: string;
  account_id?: string;
  symbol?: string;
  sequence_id?: number;
  message_id?: string;
};

export type RawOrder = {
  ID?: number;
  ClientOrderID?: string;
  Symbol?: string;
  Side?: string;
  Type?: string;
  Status?: string;
  Size?: string;
  Filled?: string;
  Price?: string;
  ReduceOnly?: boolean;
  CreateTimestamp?: number;
  [key: string]: unknown;
};

export type RawOrders = { orders?: RawOrder[]; count?: number };

export type RawFill = {
  id?: number;
  trade_id?: number;
  order_id?: number;
  symbol?: string;
  side?: string;
  role?: string;
  price?: string;
  size?: string;
  realized_pnl?: string;
  fee?: string;
  fee_type?: string;
  auto_close_type?: string | null;
  timestamp?: number;
  [key: string]: unknown;
};

export type RawFills = { fills?: RawFill[]; count?: number };

/** An order the venue has working, as it reports it. */
export type VenueOrder = {
  id: string;
  clientOrderId: string;
  symbol: string;
  side: Side;
  type: string;
  status: string;
  size: string;
  filled: string;
  price: string;
  reduceOnly: boolean;
  createdAt: number;
};

/** An execution the venue reported. The only thing in paps allowed to say "filled". */
export type VenueFill = {
  id: string;
  orderId: string;
  symbol: string;
  side: Side;
  role: string;
  price: string;
  size: string;
  realizedPnl: string;
  fee: string;
  /** `liquidation`, `adl`, `bankrupt`, … or empty for an ordinary fill. */
  autoCloseType: string;
  at: number;
};

/* ------------------------------------------------------------------ normalisers */

const str = (v: unknown, fallback = ''): string =>
  typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : fallback;

export const normaliseOrder = (raw: RawOrder): VenueOrder => ({
  id: str(raw.ID),
  clientOrderId: str(raw.ClientOrderID),
  symbol: str(raw.Symbol),
  side: raw.Side === 'sell' ? 'SHORT' : 'LONG',
  type: str(raw.Type, 'limit'),
  status: str(raw.Status, 'open'),
  size: str(raw.Size, '0'),
  filled: str(raw.Filled, '0'),
  price: str(raw.Price, '0'),
  reduceOnly: Boolean(raw.ReduceOnly),
  createdAt: Number(raw.CreateTimestamp ?? 0),
});

export const normaliseOrders = (raw: RawOrders | RawOrder[]): VenueOrder[] => {
  const rows = Array.isArray(raw) ? raw : (raw.orders ?? []);
  return rows.map(normaliseOrder).filter((o) => o.symbol);
};

export const normaliseFill = (raw: RawFill): VenueFill => ({
  id: str(raw.id, str(raw.trade_id)),
  orderId: str(raw.order_id),
  symbol: str(raw.symbol),
  // A fill's side is the direction of the trade, so `buy` is the long half of either.
  side: raw.side === 'sell' ? 'SHORT' : 'LONG',
  role: str(raw.role, 'taker'),
  price: str(raw.price, '0'),
  size: str(raw.size, '0'),
  realizedPnl: str(raw.realized_pnl, '0'),
  fee: str(raw.fee, '0'),
  autoCloseType: str(raw.auto_close_type),
  at: Number(raw.timestamp ?? 0),
});

export const normaliseFills = (raw: RawFills | RawFill[]): VenueFill[] => {
  const rows = Array.isArray(raw) ? raw : (raw.fills ?? []);
  return rows.map(normaliseFill).filter((f) => f.symbol && f.id);
};

const normaliseAccepted = (raw: RawAccepted, clientOrderId: string): AcceptedOrder => ({
  clientOrderId: str(raw.client_order_id, clientOrderId),
  accountId: str(raw.account_id),
  symbol: str(raw.symbol),
  sequenceId: Number(raw.sequence_id ?? 0),
  messageId: str(raw.message_id),
});

/* ------------------------------------------------------------------ reads */

export async function readOpenOrders(signal?: AbortSignal, symbol?: string): Promise<VenueOrder[]> {
  const query = symbol ? `?symbol=${encodeURIComponent(symbol)}` : '';
  return normaliseOrders(await strikeGet<RawOrders>(`openOrders${query}`, signal));
}

/** The venue's executions, newest first. Fees and realised PnL are the venue's numbers. */
export async function readFills(signal?: AbortSignal, limit = 50): Promise<VenueFill[]> {
  return normaliseFills(await strikeGet<RawFills>(`history/fill?limit=${limit}`, signal));
}

/* ------------------------------------------------------------------ writes */

/**
 * Place one order. Resolves to the accepted envelope; never to a fill.
 *
 * A 4xx throws `VenueError` whose `message` is the venue's own text — the ticket shows it
 * verbatim, because "insufficient margin" is worth more to a trader than a status code.
 */
export async function placeOrder(body: OrderBody): Promise<AcceptedOrder> {
  const raw = await strikeSend<RawAccepted>('POST', 'order', body);
  return normaliseAccepted(raw, body.client_order_id);
}

/** `DELETE /v2/order/cancel` is a DELETE with a JSON body; the proxy forwards it as one. */
export async function cancelOrder(args: { orderId: string; symbol?: string }): Promise<void> {
  const orderId = Number(args.orderId);
  if (!Number.isFinite(orderId)) throw new Error(`not an order id: ${args.orderId}`);
  await strikeSend('DELETE', 'order/cancel', {
    order_id: orderId,
    ...(args.symbol ? { symbol: args.symbol } : {}),
  });
}

/** `canceled_count` is -1 when the engine answers asynchronously; the caller refetches either way. */
export async function cancelAll(symbol?: string): Promise<number> {
  const raw = await strikeSend<{ canceled_count?: number }>(
    'DELETE',
    'order/cancel-all',
    symbol ? { symbol } : {},
  );
  return Number(raw.canceled_count ?? 0);
}

/** `POST /v2/leverage` — documented body `{ symbol, leverage }`; affects new positions only. */
export async function setLeverage(args: { symbol: string; leverage: number }): Promise<number> {
  const raw = await strikeSend<{ leverage?: number }>('POST', 'leverage', {
    symbol: args.symbol,
    leverage: Math.round(args.leverage),
  });
  return Number(raw.leverage ?? args.leverage);
}

/** `POST /v2/marginMode` — documented body `{ symbol, marginMode }`; refused while a position is open. */
export async function setMarginMode(args: {
  symbol: string;
  marginMode: 'cross' | 'isolated';
}): Promise<string> {
  const raw = await strikeSend<{ marginMode?: string }>('POST', 'marginMode', {
    symbol: args.symbol,
    marginMode: args.marginMode,
  });
  return str(raw.marginMode, args.marginMode);
}

/* ------------------------------------------------------------------ building a body */

/** The three filters an order has to satisfy, read the way every surface reads them. */
export type MarketFilters = { stepSize: number; tickSize: number; minNotional: number };

export const marketFilters = (info?: { filters?: Filter[] }): MarketFilters => {
  const find = (t: string) => info?.filters?.find((f) => f.filterType === t);
  return {
    stepSize: Number(find('LOT_SIZE')?.stepSize ?? 1) || 1,
    tickSize: Number(find('PRICE_FILTER')?.tickSize ?? 0.0001) || 0.0001,
    minNotional: Number(find('MIN_NOTIONAL')?.notional ?? 10),
  };
};

/** Decimals a step implies, from its own written form: `0.001` is three, `1` is none. */
export { decimalsFor } from '../order';

/**
 * A number as the venue wants it: rounded to the market's step, then written at that step's
 * precision. `String(0.00000001)` is `1e-8`, which is not a size the venue can parse.
 */
export const dec = (value: number, step: number): string =>
  roundTo(value, step).toFixed(decimalsFor(step));

export const venueSide = (side: Side): OrderSide => (side === 'LONG' ? 'buy' : 'sell');

/**
 * A fresh idempotency key. The `paps-` prefix keeps our orders greppable in the venue's
 * history, and the timestamp makes two clicks at the same millisecond unlikely to collide.
 */
export const newClientOrderId = (now = Date.now(), rand = Math.random): string =>
  `paps-${now.toString(36)}-${Math.floor(rand() * 1e8).toString(36)}`;

/** A body minus its idempotency key: the part that is decided by the market, not the click. */
export type OrderFields = Omit<OrderBody, 'client_order_id'>;

export type OrderPlan = {
  fields: OrderFields;
  /** Rounded size in base units, for display and for the notional check. */
  size: number;
  /** The price the order is judged at: the limit price, or the mark for a market order. */
  price: number;
  notional: number;
};

export type PlanResult = { ok: true; plan: OrderPlan } | { ok: false; reason: string };

export const bodyFor = (plan: OrderPlan, clientOrderId: string): OrderBody => ({
  client_order_id: clientOrderId,
  ...plan.fields,
});

type PlanArgs = {
  symbol: string;
  side: Side;
  kind: OrderType;
  /** Base units as typed, and USD notional as intent. `sizeForNotional` already ran. */
  size: number;
  price: number;
  filters: MarketFilters;
  /** A close carries this so the venue refuses it rather than flipping the position. */
  reduceOnly?: boolean;
};

/**
 * The local refusals. A market order is IOC (there is no book to rest in) and a limit is
 * GTC, because a limit that quietly expires is not what a trader asked for.
 */
export function planOrder(args: PlanArgs): PlanResult {
  const { symbol, side, kind, filters } = args;
  const size = roundTo(args.size, filters.stepSize);
  const price = kind === 'limit' ? roundTo(args.price, filters.tickSize) : args.price;

  if (!(price > 0)) return { ok: false, reason: 'waiting for a price' };
  if (!(size > 0)) return { ok: false, reason: `size rounds to zero at a ${filters.stepSize} step` };

  const notional = notionalOf(price, size);
  if (notional < filters.minNotional) {
    return { ok: false, reason: `minimum order $${filters.minNotional}` };
  }

  const fields: OrderFields = {
    symbol,
    side: venueSide(side),
    type: kind,
    size: dec(size, filters.stepSize),
    ...(kind === 'limit' ? { price: dec(price, filters.tickSize) } : {}),
    time_in_force: kind === 'market' ? 'IOC' : 'GTC',
    ...(args.reduceOnly ? { reduce_only: true } : {}),
  };

  return { ok: true, plan: { fields, size, price, notional } };
}

/**
 * A close is the other side of the position, reduce_only, sized to what is actually held.
 * `fraction` is 1 or 0.5 in this issue: half or all, never an arbitrary slice.
 */
export function planClose(args: {
  position: { symbol: string; side: Side; absSize: string };
  fraction: 1 | 0.5;
  mark: number;
  filters: MarketFilters;
}): PlanResult {
  const { position, fraction, mark, filters } = args;
  return planOrder({
    symbol: position.symbol,
    side: position.side === 'LONG' ? 'SHORT' : 'LONG',
    kind: 'market',
    size: Number(position.absSize) * fraction,
    price: mark,
    filters,
    reduceOnly: true,
  });
}

/* ------------------------------------------------------------------ reconciliation */

/**
 * An order we sent and the venue accepted, held only until a read taken *after* the
 * acceptance arrives — or until the venue's own open orders mention it, whichever is first.
 * It is never promoted to a fill here: only `/history/fill` can do that.
 */
export type PendingOrder = {
  clientOrderId: string;
  symbol: string;
  side: Side;
  type: OrderType;
  size: string;
  price: string;
  notional: number;
  sequenceId: number;
  acceptedAt: number;
};

export function reconcilePending(
  pending: PendingOrder[],
  readAt: number,
  open: VenueOrder[],
): PendingOrder[] {
  return pending.filter(
    (p) =>
      p.acceptedAt >= readAt && !open.some((o) => o.clientOrderId === p.clientOrderId),
  );
}
