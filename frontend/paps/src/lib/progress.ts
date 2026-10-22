/**
 * Progression: the only gamification worth having on a leverage product.
 *
 * Leverage is unlocked by evidence of discipline, not by volume. Someone who has
 * closed three positions cleanly earns 5×; someone who has been liquidated does not.
 * The reward for good risk management is more rope.
 */

export type Stats = {
  xp: number;
  /** Positions closed in profit, never liquidated. */
  cleanCloses: number;
  liquidations: number;
  rounds: number;
  /** Best and worst single close, in USD. */
  best: number;
  worst: number;
  /** Peak equity reached, for drawdown. */
  peak: number;
};

export const EMPTY_STATS: Stats = {
  xp: 0,
  cleanCloses: 0,
  liquidations: 0,
  rounds: 0,
  best: 0,
  worst: 0,
  peak: 10_000,
};

export type Tier = {
  level: number;
  name: string;
  maxLeverage: number;
  maxPositions: number;
  /** Clean closes needed to reach this tier. */
  needs: number;
};

export const TIERS: Tier[] = [
  { level: 1, name: 'novice', maxLeverage: 3, maxPositions: 3, needs: 0 },
  { level: 2, name: 'steady', maxLeverage: 5, maxPositions: 4, needs: 3 },
  { level: 3, name: 'sized', maxLeverage: 10, maxPositions: 5, needs: 8 },
  { level: 4, name: 'sharp', maxLeverage: 20, maxPositions: 5, needs: 15 },
];

/**
 * A liquidation holds you back one tier's worth of progress; it does not erase it.
 * Punishing a bad trade twice is how you teach people to stop reading the risk line.
 */
export const effectiveClean = (s: Stats): number => Math.max(0, s.cleanCloses - s.liquidations);

export function tierFor(stats: Stats): Tier {
  const clean = effectiveClean(stats);
  return [...TIERS].reverse().find((t) => clean >= t.needs) ?? TIERS[0];
}

export function nextTier(stats: Stats): Tier | null {
  const clean = effectiveClean(stats);
  return TIERS.find((t) => t.needs > clean) ?? null;
}

export type Objective = {
  id: string;
  label: string;
  /** What the trader has to do before the round ends. */
  kind: 'close-in-profit' | 'hold' | 'no-liquidation' | 'keep-liq' | 'few-swipes';
  xp: number;
  /** Parameter for the parametric kinds. */
  value?: number;
};

const OBJECTIVES: Objective[] = [
  { id: 'close-green', label: 'close a position in profit', kind: 'close-in-profit', xp: 20 },
  { id: 'hold', label: 'end the round holding a position', kind: 'hold', xp: 10 },
  { id: 'no-liq', label: 'survive the round without a liquidation', kind: 'no-liquidation', xp: 15 },
  { id: 'room', label: 'keep every position more than 10% from liquidation', kind: 'keep-liq', xp: 25, value: 10 },
  { id: 'patient', label: 'finish the round in at most three swipes', kind: 'few-swipes', xp: 15, value: 3 },
];

/** Deterministic per round: same round always deals the same objective. */
export const objectiveFor = (round: number): Objective => OBJECTIVES[round % OBJECTIVES.length];

export type RoundOutcome = {
  swipes: number;
  closesInProfit: number;
  liquidations: number;
  openNow: number;
  /** Smallest distance to liquidation seen this round, in percent. */
  minLiqDistance: number;
};

export function objectiveMet(o: Objective, outcome: RoundOutcome): boolean {
  switch (o.kind) {
    case 'close-in-profit':
      return outcome.closesInProfit > 0;
    case 'hold':
      return outcome.openNow > 0;
    case 'no-liquidation':
      return outcome.liquidations === 0;
    case 'keep-liq':
      return outcome.minLiqDistance >= (o.value ?? 10);
    case 'few-swipes':
      return outcome.swipes <= (o.value ?? 3);
  }
}

export type Grade = 'A' | 'B' | 'C' | 'D';

/** Graded on risk behaviour, not on luck: PnL is the last input, not the first. */
export function grade(stats: Stats, maxDrawdownPct: number): Grade {
  if (stats.liquidations > 0) return 'D';
  if (maxDrawdownPct > 10) return 'C';
  if (stats.cleanCloses >= 3 && maxDrawdownPct < 3) return 'A';
  return 'B';
}

export function drawdownPct(stats: Stats, equity: number): number {
  if (stats.peak <= 0) return 0;
  return Math.max(0, ((stats.peak - equity) / stats.peak) * 100);
}
