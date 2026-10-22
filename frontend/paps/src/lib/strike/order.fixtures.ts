import type { RawFill, RawFills, RawOrder, RawOrders } from './orders';
import type { SymbolInfo } from '../types';

/**
 * Recorded order payloads, test-only.
 *
 * Shapes come from the published OpenAPI (docs.strikefinance.org, trade REST API 2.2.0 and
 * user-data REST API 2.3.0): the create response is an acceptance envelope with no fill
 * fields at all, orders in responses use PascalCase, fills are snake_case with the venue's
 * fee and realised PnL, and a refusal carries its message in `error`.
 */

/** 201 from POST /v2/order: accepted into the engine. Nothing here says "filled". */
export const acceptedFixture = {
  client_order_id: 'paps-m3k2n1-4f2a1',
  account_id: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
  symbol: 'ADA-USD',
  sequence_id: 4413207,
  message_id: '01J9Z5Q4RN7T2K8V6B0C3DXF9H',
};

export const cancelFixture = {
  order_id: 7314002,
  symbol: 'ADA-USD',
  sequence_id: 4413219,
  message_id: '01J9Z5Q5TQ8M4N1P0J7H6G5F4D',
};

export const cancelAllFixture = {
  account_id: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
  symbol: 'ADA-USD',
  canceled_count: 2,
  sequence_id: 4413221,
  message_id: '01J9Z5Q6B1C2D3E4F5G6H7J8K9',
};

/** A rejection as the venue writes it: one sentence a trader can act on. */
export const rejectionFixture = {
  error: 'insufficient margin to open this position',
  code: 'INSUFFICIENT_MARGIN',
};

/** GET /v2/openOrders — the client id is echoed back, which is how a pending row reconciles. */
export const openOrdersFixture: RawOrders = {
  orders: [
    {
      ID: 7314002,
      ClientOrderID: 'paps-m3k2n1-4f2a1',
      AccountID: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
      Symbol: 'ADA-USD',
      Side: 'sell',
      Status: 'open',
      Type: 'limit',
      TimeInForce: 'GTC',
      Size: '300',
      Filled: '0',
      Price: '0.1950',
      ReduceOnly: true,
      CreateTimestamp: 1792674600000,
    },
    {
      ID: 7314003,
      ClientOrderID: 'paps-m3k2n2-9ab77',
      AccountID: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
      Symbol: 'BTC-USD',
      Side: 'buy',
      Status: 'open',
      Type: 'market',
      TimeInForce: 'IOC',
      Size: '0.015',
      Filled: '0',
      Price: '0',
      ReduceOnly: false,
      CreateTimestamp: 1792674700000,
    },
  ],
  count: 2,
};

/** GET /v2/history/fill — the only source of the word "filled" in the app. */
export const fillsFixture: RawFills = {
  fills: [
    {
      id: 8802,
      trade_id: 4471190,
      order_id: 7314003,
      account_id: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
      symbol: 'BTC-USD',
      side: 'buy',
      role: 'taker',
      price: '64122.50',
      size: '0.015',
      realized_pnl: '0',
      fee: '0.481',
      fee_type: 'commission',
      timestamp: 1792674704321,
      auto_close_type: null,
    },
    {
      id: 8801,
      trade_id: 4471002,
      order_id: 7312001,
      account_id: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
      symbol: 'ADA-USD',
      side: 'sell',
      role: 'maker',
      price: '0.1973',
      size: '1200.5',
      realized_pnl: '-52.86',
      fee: '-0.118',
      fee_type: 'commission',
      liquidation_fee: '2.37',
      timestamp: 1792612000000,
      auto_close_type: 'liquidation',
    },
  ],
  count: 2,
};

/** What a rejected resend of an already-accepted intent looks like at the proxy. */
export const duplicateFixture: RawOrder = {
  ID: 7314002,
  ClientOrderID: 'paps-m3k2n1-4f2a1',
  Symbol: 'ADA-USD',
  Side: 'sell',
  Status: 'open',
  Type: 'limit',
  Size: '300',
  Filled: '0',
  Price: '0.1950',
  ReduceOnly: true,
  CreateTimestamp: 1792674600000,
};

/** The filters ADA-USD publishes on GET /v2/exchangeInfo. */
export const adaSymbolFixture: SymbolInfo = {
  symbol: 'ADA-USD',
  status: 'trading',
  pricePrecision: 5,
  quantityPrecision: 2,
  baseAsset: 'ADA',
  quoteAsset: 'USD',
  contractType: 'perpetual',
  liquidationFee: '0.01',
  filters: [
    { filterType: 'PRICE_FILTER', tickSize: '0.00001', minPrice: '0.00001', maxPrice: '1000' },
    { filterType: 'LOT_SIZE', stepSize: '0.01', minQty: '0.01', maxQty: '1000000' },
    { filterType: 'MIN_NOTIONAL', notional: '10' },
  ],
};

/** A market with coarse steps, to prove the rounding actually rounds. */
export const btcSymbolFixture: SymbolInfo = {
  symbol: 'BTC-USD',
  status: 'trading',
  pricePrecision: 1,
  quantityPrecision: 3,
  baseAsset: 'BTC',
  quoteAsset: 'USD',
  contractType: 'perpetual',
  liquidationFee: '0.01',
  filters: [
    { filterType: 'PRICE_FILTER', tickSize: '0.5', minPrice: '0.5', maxPrice: '1000000' },
    { filterType: 'LOT_SIZE', stepSize: '0.001', minQty: '0.001', maxQty: '1000' },
    { filterType: 'MIN_NOTIONAL', notional: '10' },
  ],
};

export const fillFixture: RawFill = fillsFixture.fills![0];
