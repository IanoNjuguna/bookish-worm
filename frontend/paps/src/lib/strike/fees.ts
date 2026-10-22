import { ORIGIN } from '../api';

/**
 * The venue's base taker rate, not a guess.
 *
 * `/v2/fee-tiers` is public, so the ticket can show the fee the venue would charge. Five
 * basis points remains the fallback, but only when the schedule genuinely did not parse —
 * the surfaces say so rather than presenting a made-up number as the rate.
 *
 * The documented schema is camelCase (`takerRate`) and the live endpoint answers PascalCase
 * (`TakerRate`). Both are read here, because a silently ignored payload looks exactly like
 * a network failure and would quietly pin every user to the fallback.
 */

export const FALLBACK_TAKER = 0.0005;

export type FeeRate = {
  /** Decimal, not percent: 0.0005 is 5 bps. */
  taker: number;
  maker: number;
  /** False when this is the fallback and not the venue's schedule. */
  known: boolean;
};

export const UNKNOWN_FEE: FeeRate = { taker: FALLBACK_TAKER, maker: 0, known: false };

type TierRow = {
  tier?: number;
  Tier?: number;
  minVolume?: number;
  MinVolume?: number;
  takerRate?: number;
  TakerRate?: number;
  makerRate?: number;
  MakerRate?: number;
};

const minVolumeOf = (t: TierRow): number => Number(t.minVolume ?? t.MinVolume ?? 0);
const takerOf = (t: TierRow): number => Number(t.takerRate ?? t.TakerRate);
const makerOf = (t: TierRow): number => Number(t.makerRate ?? t.MakerRate);

/** The base tier is the one with the lowest 30-day volume threshold, not the first row. */
export function baseFeeTiers(raw: unknown): FeeRate {
  const tiers = (raw as { feeTiers?: TierRow[] } | null)?.feeTiers;
  if (!Array.isArray(tiers) || !tiers.length) return UNKNOWN_FEE;

  const base = [...tiers].sort((a, b) => minVolumeOf(a) - minVolumeOf(b))[0];
  const taker = takerOf(base);
  if (!Number.isFinite(taker) || taker <= 0) return UNKNOWN_FEE;

  const maker = makerOf(base);
  return { taker, maker: Number.isFinite(maker) ? maker : 0, known: true };
}

let pending: Promise<FeeRate> | null = null;

export function readBaseFee(): Promise<FeeRate> {
  pending ??= fetch(`${ORIGIN}/v2/fee-tiers`, { headers: { accept: 'application/json' } })
    .then((res) => {
      if (!res.ok) throw new Error(`fee-tiers ${res.status}`);
      return res.json() as Promise<unknown>;
    })
    .then(baseFeeTiers)
    .catch(() => {
      // Let the next mount try again rather than caching a failure for the session.
      pending = null;
      return UNKNOWN_FEE;
    });

  return pending;
}

/** Rate as a label a human reads: `5.0 bps`. */
export const bps = (rate: number): string => `${(rate * 10_000).toFixed(1)} bps`;
