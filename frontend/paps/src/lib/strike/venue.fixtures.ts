import type { RawAccount, RawFunding, RawOrders, RawPositions, RawTransactions } from './venue';

/**
 * Recorded venue payloads, test-only.
 *
 * Shapes come from the published OpenAPI (docs.strikefinance.org, user-data REST API 2.2.0):
 * amounts are strings, positions carry a signed `size`, orders use PascalCase field names,
 * and a position far from liquidation reports `liquidation_price: "0"`.
 */

export const accountFixture: RawAccount = {
  account_id: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
  blockchain: 'cardano',
  blockchain_address: 'addr1q9x4k2m8p0s7d5f3g1h9j2k4l6n8p0q2r4s6t8u',
  wallet_balance: '1240.55',
  available_balance: '612.30',
  copy_reserved_balance: '0',
  unrealized_pnl: '-18.42',
  margin_balance: '1222.13',
  total_margin: '628.25',
  position_initial_margin: '625.00',
  maintenance_margin: '12.60',
  symbol_settings: {
    'ADA-USD': { margin_mode: 'isolated', leverage: 5, allow_pre_trade: true },
    'BTC-USD': { margin_mode: 'cross', leverage: 10, allow_pre_trade: true },
  },
};

/** A long ADA and a short BTC: the short is the one with a negative `size`. */
export const positionsFixture: RawPositions = {
  positions: [
    {
      id: 41,
      margin_mode: 'isolated',
      leverage: 5,
      size: '1200.5',
      entry_price: '0.24150000',
      iso_balance: '57.98000000',
      accumulated_funding_fees: '-0.41250000',
      create_timestamp: 1791000000000,
      update_timestamp: 1792675000000,
      symbol: 'ADA-USD',
      upnl: '3.24600000',
      maintenance_margin: '0.28900000',
      bankruptcy_price: '0.19340000',
      liquidation_price: '0.19730000',
    },
    {
      id: 42,
      margin_mode: 'isolated',
      leverage: 10,
      size: '-0.015',
      entry_price: '64120.50',
      iso_balance: '96.18000000',
      accumulated_funding_fees: '0.88000000',
      create_timestamp: 1792500000000,
      update_timestamp: 1792675000000,
      symbol: 'BTC-USD',
      upnl: '-22.65000000',
      maintenance_margin: '4.80900000',
      bankruptcy_price: '68500.00',
      liquidation_price: '68210.00000000',
    },
    {
      // A row the venue has not swept yet: zero size, so it is not a holding.
      id: 40,
      margin_mode: 'isolated',
      leverage: 5,
      size: '0',
      entry_price: '0.23610000',
      iso_balance: '0',
      accumulated_funding_fees: '0',
      create_timestamp: 1790000000000,
      update_timestamp: 1790100000000,
      symbol: 'ADA-USD',
      upnl: '0',
      maintenance_margin: '0',
      bankruptcy_price: '0',
      liquidation_price: '0',
    },
  ],
  count: 3,
};

export const openOrdersFixture: RawOrders = {
  orders: [
    {
      ID: 7314002,
      ClientOrderID: 'paps-1',
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
  ],
  count: 1,
};

export const fundingFixture: RawFunding = {
  funding: [
    {
      id: 9001,
      transaction_id: 55012,
      account_id: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
      position_id: 42,
      symbol: 'BTC-USD',
      position_size: '0.015',
      position_side: 'Short',
      funding_rate: '0.00001250',
      amount: '0.88000000',
      timestamp: 1792674000000,
    },
    {
      id: 9000,
      transaction_id: 55011,
      account_id: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
      position_id: 41,
      symbol: 'ADA-USD',
      position_size: '1200.5',
      position_side: 'Long',
      funding_rate: '0.00007435',
      amount: '-0.41250000',
      timestamp: 1792670400000,
    },
  ],
  count: 2,
};

export const transactionsFixture: RawTransactions = {
  transactions: [
    {
      id: 55012,
      request_id: 'req-1',
      account_id: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
      type: 'funding',
      amount: '0.88000000',
      asset: 'USD',
      blockchain: '',
      blockchain_address: '',
      tx_hash: null,
      recipient_address: null,
      status: 'completed',
      timestamp: 1792674000000,
    },
    {
      id: 55010,
      request_id: 'req-0',
      account_id: '8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71',
      type: 'fee',
      amount: '-0.06000000',
      asset: 'USD',
      blockchain: '',
      blockchain_address: '',
      tx_hash: null,
      recipient_address: null,
      status: 'completed',
      timestamp: 1792670000000,
    },
  ],
  count: 2,
};

/** Recorded from GET api.strikefinance.org/v2/fee-tiers: PascalCase, out of order. */
export const feeTiersFixture = {
  feeTiers: [
    { Tier: 1, MinVolume: 100_000, TakerRate: 0.00045, MakerRate: -0.00005 },
    { Tier: 0, MinVolume: 0, TakerRate: 0.0005, MakerRate: -0.00005 },
  ],
};

/** The shape the docs publish, camelCase, in case the venue ever returns it. */
export const documentedFeeTiersFixture = {
  feeTiers: [
    { tier: 0, minVolume: 0, takerRate: 0.0005, makerRate: -0.00005 },
    { tier: 1, minVolume: 100_000, takerRate: 0.00045, makerRate: -0.00005 },
  ],
};
