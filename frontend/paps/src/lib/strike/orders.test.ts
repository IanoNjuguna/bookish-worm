import { afterEach, describe, expect, it, vi } from 'vitest';
import { VenueError, isReconnect } from './http';
import {
  bodyFor,
  cancelAll,
  cancelOrder,
  dec,
  decimalsFor,
  marketFilters,
  newClientOrderId,
  normaliseFills,
  normaliseOrders,
  PENDING_TTL_MS,
  placeOrder,
  planClose,
  planOrder,
  readFills,
  reconcilePending,
  setLeverage,
  setMarginMode,
  venueSide,
  type PendingOrder,
} from './orders';
import {
  acceptedFixture,
  adaSymbolFixture,
  btcSymbolFixture,
  cancelAllFixture,
  cancelFixture,
  fillsFixture,
  openOrdersFixture,
  rejectionFixture,
} from './order.fixtures';

/**
 * Orders against a fake proxy.
 *
 * The point of asserting the serialised string rather than the object is that the venue
 * parses what we send, not what we meant: a size that arrives as `1e-8`, or a `price` on a
 * market order, is a rejected order in production and an invisible bug in `toEqual`.
 */

type Call = { url: string; init: RequestInit };

const calls: Call[] = [];

const jsonResponse = (status: number, body: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  }) as unknown as Response;

const stubFetch = (status: number, body: unknown): void => {
  calls.length = 0;
  globalThis.fetch = vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return jsonResponse(status, body);
  }) as unknown as typeof fetch;
};

afterEach(() => {
  vi.restoreAllMocks();
});

const ada = marketFilters(adaSymbolFixture);
const btc = marketFilters(btcSymbolFixture);

const plan = (args: Partial<Parameters<typeof planOrder>[0]> = {}) =>
  planOrder({
    symbol: 'ADA-USD',
    side: 'LONG',
    kind: 'market',
    size: 1200.5,
    price: 0.2415,
    filters: ada,
    ...args,
  });

const planOrThrow = (args: Partial<Parameters<typeof planOrder>[0]> = {}) => {
  const result = plan(args);
  if (!result.ok) throw new Error(`plan refused: ${result.reason}`);
  return result.plan;
};

describe('the body a placement puts on the wire', () => {
  it('sends a market order as size only, at the market step, with IOC', async () => {
    stubFetch(201, acceptedFixture);
    const body = bodyFor(planOrThrow(), 'paps-test-1');

    expect(JSON.stringify(body)).toBe(
      '{"client_order_id":"paps-test-1","symbol":"ADA-USD","side":"buy","type":"market","size":"1200.50","time_in_force":"IOC"}',
    );

    await placeOrder(body);

    expect(calls[0].url).toBe('/api/strike/order');
    expect(calls[0].init.method).toBe('POST');
    expect(calls[0].init.credentials).toBe('same-origin');
    expect((calls[0].init.headers as Record<string, string>)['content-type']).toBe('application/json');
    expect(calls[0].init.body).toBe(JSON.stringify(body));
  });

  it('sends a limit order with the price rounded to the tick, GTC', async () => {
    stubFetch(201, acceptedFixture);
    const body = bodyFor(
      planOrThrow({ side: 'SHORT', kind: 'limit', size: 300, price: 0.195048 }),
      'paps-test-2',
    );

    expect(JSON.stringify(body)).toBe(
      '{"client_order_id":"paps-test-2","symbol":"ADA-USD","side":"sell","type":"limit","size":"300.00","price":"0.19505","time_in_force":"GTC"}',
    );
    await placeOrder(body);
    expect(calls[0].init.body).toBe(JSON.stringify(body));
  });

  it('rounds to a coarse step rather than sending what was typed', () => {
    const btcPlan = planOrThrow({
      symbol: 'BTC-USD',
      size: 0.01487,
      price: 64122.34,
      filters: btc,
      kind: 'limit',
    });

    expect(btcPlan.fields.size).toBe('0.015');
    expect(btcPlan.fields.price).toBe('64122.5');
    expect(btcPlan.size).toBe(0.015);
  });

  it('never writes a size in exponent notation', () => {
    expect(dec(0.0000000125, 0.00000001)).toBe('0.00000001');
    expect(dec(0.00000001, 0.00000001)).toBe('0.00000001');
    expect(decimalsFor(0.00001)).toBe(5);
    expect(decimalsFor(0.001)).toBe(3);
    expect(decimalsFor(1)).toBe(0);
  });

  it('maps long to buy and short to sell', () => {
    expect(venueSide('LONG')).toBe('buy');
    expect(venueSide('SHORT')).toBe('sell');
    expect(planOrThrow({ side: 'LONG' }).fields.side).toBe('buy');
    expect(planOrThrow({ side: 'SHORT' }).fields.side).toBe('sell');
  });

  it('refuses locally, without a request, below the market minimum', () => {
    stubFetch(201, acceptedFixture);
    const result = plan({ size: 20, price: 0.2415 }); // $4.83

    expect(result).toEqual({ ok: false, reason: 'minimum order $10' });
    expect(calls).toHaveLength(0);
  });

  it('refuses a size that rounds away, and a limit with no price', () => {
    expect(plan({ size: 0.001, price: 0.2415 })).toEqual({
      ok: false,
      reason: 'size rounds to zero at a 0.01 step',
    });
    expect(plan({ kind: 'limit', price: 0 })).toEqual({ ok: false, reason: 'waiting for a price' });
  });
});

describe('what a placement resolves to', () => {
  it('returns the acceptance envelope, never a fill', async () => {
    stubFetch(201, acceptedFixture);
    const accepted = await placeOrder(bodyFor(planOrThrow(), 'paps-test-1'));

    expect(accepted).toEqual({
      clientOrderId: 'paps-m3k2n1-4f2a1',
      accountId: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
      symbol: 'ADA-USD',
      sequenceId: 4413207,
      messageId: '01J9Z5Q4RN7T2K8V6B0C3DXF9H',
    });
    expect(accepted).not.toHaveProperty('filled');
    expect(accepted).not.toHaveProperty('price');
  });
});

describe('a rejection', () => {
  it('carries the venue message verbatim, and the status', async () => {
    stubFetch(400, rejectionFixture);

    const error = await placeOrder(bodyFor(planOrThrow(), 'paps-test-3')).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(VenueError);
    expect((error as VenueError).message).toBe('insufficient margin to open this position');
    expect((error as VenueError).status).toBe(400);
    expect((error as VenueError).code).toBe('INSUFFICIENT_MARGIN');
    expect(isReconnect(error)).toBe(false);
  });

  it('keeps a 401 a reconnect, whatever the venue called it', async () => {
    stubFetch(401, { error: 'reconnect' });
    const error = await placeOrder(bodyFor(planOrThrow(), 'paps-test-4')).catch((e: unknown) => e);

    expect(isReconnect(error)).toBe(true);
  });
});

describe('closing a position', () => {
  const short = { symbol: 'ADA-USD', side: 'LONG' as const, absSize: '1200.5' };

  it('sends the other side, reduce_only, for the whole position', () => {
    const result = planClose({ position: short, fraction: 1, mark: 0.2415, filters: ada });
    if (!result.ok) throw new Error(result.reason);

    expect(JSON.stringify(bodyFor(result.plan, 'paps-close-1'))).toBe(
      '{"client_order_id":"paps-close-1","symbol":"ADA-USD","side":"sell","type":"market","size":"1200.50","time_in_force":"IOC","reduce_only":true}',
    );
  });

  it('halves it for a half close, and never sends a short size', () => {
    const result = planClose({
      position: { symbol: 'BTC-USD', side: 'SHORT', absSize: '0.015' },
      fraction: 0.5,
      mark: 64122.5,
      filters: btc,
    });
    if (!result.ok) throw new Error(result.reason);

    expect(result.plan.fields).toMatchObject({ side: 'buy', size: '0.008', reduce_only: true });
  });
});

describe('cancelling', () => {
  it('deletes with a JSON body, because the venue wants one', async () => {
    stubFetch(200, cancelFixture);

    await cancelOrder({ orderId: '7314002', symbol: 'ADA-USD' });

    expect(calls[0].url).toBe('/api/strike/order/cancel');
    expect(calls[0].init.method).toBe('DELETE');
    expect(calls[0].init.body).toBe('{"order_id":7314002,"symbol":"ADA-USD"}');
  });

  it('treats a bodyless 204 as a cancel that landed', async () => {
    stubFetch(204, {});

    await expect(cancelOrder({ orderId: '7314002' })).resolves.toBeUndefined();
    expect(calls[0].init.body).toBe('{"order_id":7314002}');
  });

  it('surfaces a cancel the venue refused', async () => {
    stubFetch(400, { error: 'order does not exist' });

    const error = await cancelOrder({ orderId: '1' }).catch((e: unknown) => e);

    expect((error as VenueError).message).toBe('order does not exist');
  });

  it('cancels all, filtered or not', async () => {
    stubFetch(200, cancelAllFixture);
    await expect(cancelAll('ADA-USD')).resolves.toBe(2);
    expect(calls[0].url).toBe('/api/strike/order/cancel-all');
    expect(calls[0].init.body).toBe('{"symbol":"ADA-USD"}');

    stubFetch(200, { canceled_count: -1 });
    await expect(cancelAll()).resolves.toBe(-1);
    expect(calls[0].init.body).toBe('{}');
  });
});

describe('the per-symbol setters', () => {
  it('sends the documented leverage body', async () => {
    stubFetch(200, { leverage: 10, symbol: 'ADA-USD' });

    await expect(setLeverage({ symbol: 'ADA-USD', leverage: 10 })).resolves.toBe(10);
    expect(calls[0].url).toBe('/api/strike/leverage');
    expect(calls[0].init.body).toBe('{"symbol":"ADA-USD","leverage":10}');
  });

  it('sends the documented margin mode body', async () => {
    stubFetch(200, { marginMode: 'isolated', symbol: 'ADA-USD' });

    await expect(setMarginMode({ symbol: 'ADA-USD', marginMode: 'isolated' })).resolves.toBe(
      'isolated',
    );
    expect(calls[0].url).toBe('/api/strike/marginMode');
    expect(calls[0].init.body).toBe('{"symbol":"ADA-USD","marginMode":"isolated"}');
  });
});

describe('reading what the venue holds', () => {
  it('keeps the client order id, which is how a pending row reconciles', async () => {
    stubFetch(200, openOrdersFixture);
    const orders = normaliseOrders(openOrdersFixture);

    expect(orders.map((o) => o.clientOrderId)).toEqual(['paps-m3k2n1-4f2a1', 'paps-m3k2n2-9ab77']);
    expect(orders[0]).toMatchObject({ side: 'SHORT', type: 'limit', reduceOnly: true, size: '300' });
    expect(orders[1]).toMatchObject({ side: 'LONG', type: 'market', reduceOnly: false });
    await readFills();
    expect(calls[0].url).toBe('/api/strike/history/fill?limit=50');
  });

  it('reads fills with the venue fee and a liquidation reason', () => {
    const fills = normaliseFills(fillsFixture);

    expect(fills).toHaveLength(2);
    expect(fills[0]).toMatchObject({
      id: '8802',
      orderId: '7314003',
      symbol: 'BTC-USD',
      side: 'LONG',
      role: 'taker',
      price: '64122.50',
      fee: '0.481',
      realizedPnl: '0',
      autoCloseType: '',
    });
    expect(fills[1]).toMatchObject({ side: 'SHORT', realizedPnl: '-52.86', fee: '-0.118' });
    expect(fills[1].autoCloseType).toBe('liquidation');
  });
});

describe('reconciling an accepted order', () => {
  const pending: PendingOrder = {
    clientOrderId: 'paps-m3k2n1-4f2a1',
    symbol: 'ADA-USD',
    side: 'SHORT',
    type: 'limit',
    size: '300.00',
    price: '0.19505',
    notional: 58.5,
    sequenceId: 4413207,
    acceptedAt: 5_000,
  };

  const keep = (args: Partial<Parameters<typeof reconcilePending>[0]> = {}) =>
    reconcilePending({ pending: [pending], open: [], fills: [], now: 6_000, ...args });

  it('keeps the row while the venue has not answered for it yet', () => {
    expect(keep()).toHaveLength(1);
  });

  it('drops it as soon as the venue lists it as working', () => {
    expect(keep({ open: normaliseOrders(openOrdersFixture) })).toHaveLength(0);
  });

  it('drops it once a fill lands in that market after the send', () => {
    expect(keep({ fills: normaliseFills(fillsFixture) })).toHaveLength(0);
  });

  it('ignores a fill that predates the send, and one in another market', () => {
    const old = { ...normaliseFills(fillsFixture)[0], at: pending.acceptedAt - 60_000 };
    const elsewhere = { ...normaliseFills(fillsFixture)[0], symbol: 'BTC-USD', at: pending.acceptedAt + 1_000 };

    expect(keep({ fills: [old, elsewhere] })).toHaveLength(1);
  });

  it('gives up after one poll window, because the venue has had two chances by then', () => {
    expect(keep({ now: pending.acceptedAt + PENDING_TTL_MS - 1 })).toHaveLength(1);
    expect(keep({ now: pending.acceptedAt + PENDING_TTL_MS })).toHaveLength(0);
  });
});

describe('client order ids', () => {
  it('is prefixed and unique enough for two clicks in one millisecond', () => {
    let n = 0;
    const id = () => newClientOrderId(1_792_674_600_000, () => n++ / 10);

    expect(id()).toMatch(/^paps-[0-9a-z]+-[0-9a-z]+$/);
    expect(id()).not.toBe('paps-m3k2n1-4f2a1');
    expect(newClientOrderId(1_792_674_600_000, () => 0.1)).not.toBe(
      newClientOrderId(1_792_674_600_000, () => 0.9),
    );
  });
});
