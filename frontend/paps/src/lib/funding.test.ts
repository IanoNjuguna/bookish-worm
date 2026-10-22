import { describe, expect, it } from 'vitest';
import { fundingCashFlow, fundingWindowKey } from './funding';

describe('funding', () => {
  it('makes a long pay a positive rate and a short receive it', () => {
    expect(fundingCashFlow('LONG', 0.0001, 10_000)).toBeCloseTo(-1, 9);
    expect(fundingCashFlow('SHORT', 0.0001, 10_000)).toBeCloseTo(1, 9);
  });

  it('flips the sign for a negative rate', () => {
    expect(fundingCashFlow('LONG', -0.0002, 10_000)).toBeCloseTo(2, 9);
    expect(fundingCashFlow('SHORT', -0.0002, 10_000)).toBeCloseTo(-2, 9);
  });

  it('charges notional rather than margin, so leverage does not change it', () => {
    expect(fundingCashFlow('LONG', 0.0003, 5_000)).toBeCloseTo(
      fundingCashFlow('LONG', 0.0003, 10_000) / 2,
      9,
    );
  });

  it('is exactly zero at a zero rate', () => {
    expect(fundingCashFlow('LONG', 0, 10_000)).toBe(0);
    expect(fundingCashFlow('SHORT', 0, 10_000)).toBe(0);
  });

  it('keys a settlement by market and window, so two windows are two charges', () => {
    expect(fundingWindowKey('ADA-USD', 1_700_000_000_000)).not.toBe(
      fundingWindowKey('ADA-USD', 1_700_028_800_000),
    );
    expect(fundingWindowKey('ADA-USD', 1)).not.toBe(fundingWindowKey('BTC-USD', 1));
  });
});
