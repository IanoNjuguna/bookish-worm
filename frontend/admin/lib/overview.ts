import { apiBase } from './api';

export type Overview = {
  days: number;
  fans: { collectors: number; listeners: number; total: number; zeroRevenue: number };
  money: {
    collects: number;
    gmvLovelace: number;
    takeLovelace: number;
    averagePriceLovelace: number | null;
    spendPerFanLovelace: number | null;
    takePerFanLovelace: number | null;
    medianSpendLovelace: number | null;
    topFanShare: number | null;
    unpricedCollects: number;
  };
  levers: { collectsPerFan: number | null; releasesWithCollects: number; releases: number };
  health: { unpricedCollects: number; collectFailed: number; chainFallbacks: number; api5xx: number };
};

/**
 * The metrics endpoint, called server-side with the service key. Returns null when
 * core-api has no /admin/overview yet or the key is missing, so every card can fall
 * back to its empty state instead of inventing a number.
 */
export async function getOverview(days = 30): Promise<Overview | null> {
  const key = process.env.ADMIN_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`${apiBase}/admin/overview?days=${days}`, {
      headers: { 'X-API-Key': key },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Overview;
  } catch {
    return null;
  }
}
