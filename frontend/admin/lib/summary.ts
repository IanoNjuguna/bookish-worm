/** Ratios the Overview shows, guarded so a card can say "unknown" instead of lying. */

export type FanRow = {
  address: string;
  collects: number;
  spendLovelace: number;
  feeLovelace: number;
  share: number;
};

/** Realised fee rate: what we kept out of what fans spent. Null when nothing was spent. */
export function feeRate(takeLovelace: number, gmvLovelace: number): number | null {
  if (!Number.isFinite(takeLovelace) || !Number.isFinite(gmvLovelace) || gmvLovelace <= 0) {
    return null;
  }
  return takeLovelace / gmvLovelace;
}

/** A per-fan average, null rather than Infinity when there is no population. */
export function perFan(totalLovelace: number, fans: number): number | null {
  if (!Number.isFinite(totalLovelace) || !Number.isFinite(fans) || fans <= 0) return null;
  return Math.round(totalLovelace / fans);
}

/**
 * Collector-per-listener conversion, but only when it means something. A window can
 * hold more collectors than listeners (people who collected before they listened),
 * and a 200% conversion reads as growth when it is an artefact.
 */
export function conversion(collectors: number, listeners: number): number | null {
  if (!Number.isFinite(collectors) || !Number.isFinite(listeners) || listeners <= 0) return null;
  const rate = collectors / listeners;
  return rate > 1 ? null : rate;
}

/** 0xabc…def, for lists where the full address would dominate the row. */
export function shortenAddress(address: string, keep = 6): string {
  if (address.length <= keep * 2 + 1) return address;
  return `${address.slice(0, keep)}…${address.slice(-4)}`;
}
