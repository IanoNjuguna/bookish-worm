import { describe, expect, it } from 'vitest';
import { price, signedUsd } from '../format';
import { baseFeeTiers, FALLBACK_TAKER } from './fees';
import {
  normaliseAccount,
  normaliseFunding,
  normaliseOrders,
  normalisePositions,
  normaliseTransactions,
  sideOf,
} from './venue';
import {
  accountFixture,
  documentedFeeTiersFixture,
  feeTiersFixture,
  fundingFixture,
  openOrdersFixture,
  positionsFixture,
  transactionsFixture,
} from './venue.fixtures';

describe('venue account', () => {
  it('keeps the venue amounts as the precise strings it sent', () => {
    const a = normaliseAccount(accountFixture);

    expect(a.accountId).toBe('8f14e45f-ceea-4c3f-a2e0-1b6f5a2d9b71');
    expect(a.marginBalance).toBe('1222.13');
    expect(a.walletBalance).toBe('1240.55');
    expect(a.availableBalance).toBe('612.30');
    expect(a.unrealizedPnl).toBe('-18.42');
    expect(a.totalMargin).toBe('628.25');
    expect(a.maintenanceMargin).toBe('12.60');
  });

  it('maps per-symbol settings, which is where leverage per market lives', () => {
    const a = normaliseAccount(accountFixture);

    expect(a.symbolSettings['ADA-USD']).toEqual({ marginMode: 'isolated', leverage: 5 });
    expect(a.symbolSettings['BTC-USD']).toEqual({ marginMode: 'cross', leverage: 10 });
  });

  it('fills a missing balance with zero rather than an empty cell', () => {
    expect(normaliseAccount({}).marginBalance).toBe('0');
  });
});

describe('venue positions', () => {
  const positions = normalisePositions(positionsFixture);

  it('drops a zero-size row the venue has not swept yet', () => {
    expect(positions).toHaveLength(2);
    expect(positions.map((p) => p.symbol)).toEqual(['ADA-USD', 'BTC-USD']);
  });

  it('reads a long from a positive size without touching the entry price', () => {
    const ada = positions[0];

    expect(ada.side).toBe('LONG');
    expect(ada.size).toBe('1200.5');
    expect(ada.absSize).toBe('1200.5');
    // Precision is the point of keeping the string: the trailing zeros survive.
    expect(ada.entryPrice).toBe('0.24150000');
    expect(ada.upnl).toBe('3.24600000');
    expect(ada.funding).toBe('-0.41250000');
    expect(ada.liquidationPrice).toBe('0.19730000');
    expect(ada.marginMode).toBe('isolated');
    expect(ada.leverage).toBe(5);
    expect(ada.openedAt).toBe(1791000000000);
  });

  it('reads a short from a negative size, and shows its magnitude for the column', () => {
    const btc = positions[1];

    expect(btc.side).toBe('SHORT');
    expect(btc.size).toBe('-0.015');
    expect(btc.absSize).toBe('0.015');
    expect(btc.entryPrice).toBe('64120.50');
    expect(btc.upnl).toBe('-22.65000000');
    expect(btc.funding).toBe('0.88000000');
    expect(btc.liquidationPrice).toBe('68210.00000000');
  });

  it('treats a zero liquidation price as an unknown value, not as zero', () => {
    const [row] = normalisePositions({
      positions: [{ ...positionsFixture.positions![0], liquidation_price: '0' }],
    });

    expect(row.liquidationPrice).toBe('');
  });

  it('classifies a size by its sign only', () => {
    expect(sideOf('-2')).toBe('SHORT');
    expect(sideOf('2')).toBe('LONG');
    expect(sideOf('0')).toBe('LONG');
  });
});

describe('venue history and orders', () => {
  it('keeps funding signed, and reads the position side as the venue names it', () => {
    const [short, long] = normaliseFunding(fundingFixture);

    expect(short.side).toBe('SHORT');
    expect(short.amount).toBe('0.88000000');
    expect(short.rate).toBe('0.00001250');
    expect(long.side).toBe('LONG');
    expect(long.amount).toBe('-0.41250000');
    expect(signedUsd(short.amount)).toBe('+$0.88');
    expect(signedUsd(long.amount)).toBe('−$0.41');
  });

  it('maps PascalCase order fields and a sell side to SHORT', () => {
    const [order] = normaliseOrders(openOrdersFixture);

    expect(order.id).toBe('7314002');
    expect(order.symbol).toBe('ADA-USD');
    expect(order.side).toBe('SHORT');
    expect(order.type).toBe('limit');
    expect(order.reduceOnly).toBe(true);
    expect(order.price).toBe('0.1950');
    expect(order.createdAt).toBe(1792674600000);
  });

  it('maps a buy side to LONG', () => {
    const [order] = normaliseOrders({ orders: [{ ...openOrdersFixture.orders![0], Side: 'buy' }] });
    expect(order.side).toBe('LONG');
  });

  it('reads transaction rows with their signed amount', () => {
    const rows = normaliseTransactions(transactionsFixture);

    expect(rows).toHaveLength(2);
    expect(rows[0].type).toBe('funding');
    expect(rows[0].amount).toBe('0.88000000');
    expect(rows[1].amount).toBe('-0.06000000');
  });
});

describe('venue formatting', () => {
  it('formats the venue strings with the shared helpers', () => {
    const btc = normalisePositions(positionsFixture)[1];

    expect(price(btc.entryPrice)).toBe('64,120.5');
    expect(signedUsd(btc.upnl)).toBe('−$22.65');
  });
});

describe('the base taker rate', () => {
  it('reads the recorded PascalCase schedule the endpoint actually sends', () => {
    const fee = baseFeeTiers(feeTiersFixture);

    expect(fee.known).toBe(true);
    expect(fee.taker).toBe(0.0005);
    expect(fee.maker).toBe(-0.00005);
  });

  it('also reads the camelCase shape the docs publish', () => {
    expect(baseFeeTiers(documentedFeeTiersFixture)).toEqual({
      taker: 0.0005,
      maker: -0.00005,
      known: true,
    });
  });

  it('takes the lowest-volume tier, not the first row it sees', () => {
    // The fixture lists tier 1 first; the base rate is tier 0.
    expect(baseFeeTiers(feeTiersFixture).taker).toBe(0.0005);
  });

  it('falls back to 5 bps and says it does not know', () => {
    expect(baseFeeTiers(undefined)).toEqual({ taker: FALLBACK_TAKER, maker: 0, known: false });
    expect(baseFeeTiers({ feeTiers: [] }).known).toBe(false);
    expect(baseFeeTiers({ feeTiers: [{ Tier: 0, MinVolume: 0 }] }).known).toBe(false);
  });
});
