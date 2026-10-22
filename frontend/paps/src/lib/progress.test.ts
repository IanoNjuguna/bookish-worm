import { describe, expect, it } from 'vitest';
import {
  EMPTY_STATS,
  drawdownPct,
  effectiveClean,
  grade,
  nextTier,
  objectiveFor,
  objectiveMet,
  tierFor,
  type RoundOutcome,
  type Stats,
} from './progress';

const stats = (patch: Partial<Stats> = {}): Stats => ({ ...EMPTY_STATS, ...patch });

describe('progression', () => {
  it('starts everyone at 3x and three positions', () => {
    const t = tierFor(stats());
    expect(t.maxLeverage).toBe(3);
    expect(t.maxPositions).toBe(3);
  });

  it('unlocks 5x after three clean closes', () => {
    expect(tierFor(stats({ cleanCloses: 2 })).maxLeverage).toBe(3);
    expect(tierFor(stats({ cleanCloses: 3 })).maxLeverage).toBe(5);
  });

  it('lets a liquidation hold progress back by one, not erase it', () => {
    expect(effectiveClean(stats({ cleanCloses: 5, liquidations: 1 }))).toBe(4);
    expect(tierFor(stats({ cleanCloses: 5, liquidations: 1 })).level).toBe(2);
    expect(tierFor(stats({ cleanCloses: 9, liquidations: 1 })).level).toBe(3);
  });

  it('reports the next tier', () => {
    expect(nextTier(stats({ cleanCloses: 3 }))?.level).toBe(3);
    expect(nextTier(stats({ cleanCloses: 20 }))).toBeNull();
  });

  it('deals objectives deterministically by round', () => {
    expect(objectiveFor(0).id).toBe(objectiveFor(5).id);
    expect(objectiveFor(0).id).not.toBe(objectiveFor(1).id);
  });

  it('evaluates every objective kind', () => {
    const outcome: RoundOutcome = {
      swipes: 2,
      closesInProfit: 1,
      liquidations: 0,
      openNow: 1,
      minLiqDistance: 14,
    };
    for (let r = 0; r < 5; r += 1) expect(objectiveMet(objectiveFor(r), outcome)).toBe(true);

    const bad: RoundOutcome = { swipes: 9, closesInProfit: 0, liquidations: 1, openNow: 0, minLiqDistance: 2 };
    for (let r = 0; r < 5; r += 1) expect(objectiveMet(objectiveFor(r), bad)).toBe(false);
  });

  it('grades risk behaviour, not luck', () => {
    expect(grade(stats({ cleanCloses: 4, liquidations: 1 }), 0)).toBe('D');
    expect(grade(stats({ cleanCloses: 1 }), 2)).toBe('B');
    expect(grade(stats({ cleanCloses: 3 }), 2)).toBe('A');
    expect(grade(stats({ cleanCloses: 3 }), 12)).toBe('C');
  });

  it('computes drawdown from the peak', () => {
    expect(drawdownPct(stats({ peak: 10_000 }), 9_500)).toBeCloseTo(5, 6);
    expect(drawdownPct(stats({ peak: 0 }), 9_500)).toBe(0);
  });
});
