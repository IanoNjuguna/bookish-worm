import { describe, expect, it } from 'vitest';
import { initial, reduce, type State } from './store';

const open = (): State =>
  reduce(initial, {
    type: 'place',
    symbol: 'ADA-USD',
    side: 'LONG',
    kind: 'market',
    price: 0.25,
    size: 400,
    leverage: 5,
    mark: 0.25,
    step: 1,
    id: 'p1',
  });

describe('paper account exits', () => {
  it('opens with margin and charges the taker fee', () => {
    const s = open();
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].margin).toBeCloseTo(20, 6); // 100 / 5x
    expect(s.equity).toBeCloseTo(10_000 - 100 * 0.0005, 6);
  });

  it('closes half, keeping the other half and its proportional margin', () => {
    const s = reduce(open(), { type: 'close', id: 'p1', mark: 0.26, fraction: 0.5 });
    expect(s.positions).toHaveLength(1);
    expect(s.positions[0].size).toBe(200);
    expect(s.positions[0].margin).toBeCloseTo(10, 6);
    // 200 size × 0.01 move = +2, minus 5 bps on 52 notional
    expect(s.equity).toBeCloseTo(10_000 - 0.05 + 2 - 52 * 0.0005, 6);
  });

  it('flattens everything with closeAll', () => {
    const s = reduce(open(), { type: 'closeAll', mark: 0.24 });
    expect(s.positions).toHaveLength(0);
    expect(s.fills).toHaveLength(2);
  });

  it('liquidates at the mark and charges the 1% venue fee', () => {
    const opened = open();
    const s = reduce(opened, { type: 'liquidate', ids: ['p1'] });
    expect(s.positions).toHaveLength(0);
    // opened (5 bps), closed at entry (5 bps, no PnL), then 1% of 100 notional
    expect(s.equity).toBeCloseTo(10_000 - 0.05 - 0.05 - 1, 6);
  });
});

describe('funding', () => {
  const long = (): State =>
    reduce(initial, {
      type: 'place',
      symbol: 'ADA-USD',
      side: 'LONG',
      kind: 'market',
      price: 0.25,
      size: 400,
      leverage: 5,
      mark: 0.25,
      step: 1,
      id: 'p2',
    });

  it('charges a long when the rate is positive', () => {
    const s = reduce(long(), { type: 'fund', symbol: 'ADA-USD', rate: 0.0001, mark: 0.25 });
    // 400 × 0.25 = 100 notional × 0.0001 = $0.01
    expect(s.equity).toBeCloseTo(9_999.95 - 0.01, 6);
    expect(s.positions[0].funding).toBeCloseTo(-0.01, 6);
  });

  it('pays a short when the rate is positive', () => {
    const opened = reduce(initial, {
      type: 'place',
      symbol: 'ADA-USD',
      side: 'SHORT',
      kind: 'market',
      price: 0.25,
      size: 400,
      leverage: 5,
      mark: 0.25,
      step: 1,
      id: 'p3',
    });
    const s = reduce(opened, { type: 'fund', symbol: 'ADA-USD', rate: 0.0001, mark: 0.25 });
    expect(s.positions[0].funding).toBeCloseTo(0.01, 6);
    expect(s.equity).toBeCloseTo(9_999.95 + 0.01, 6);
  });

  it('leaves other markets alone', () => {
    const s = reduce(long(), { type: 'fund', symbol: 'BTC-USD', rate: 0.001, mark: 80_000 });
    expect(s.equity).toBe(9_999.95);
    expect(s.positions[0].funding).toBeUndefined();
  });
});
