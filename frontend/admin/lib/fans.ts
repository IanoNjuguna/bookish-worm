import { apiBase } from './api';
import type { FanRow } from './summary';

/**
 * Collectors by value. Null when the endpoint or the key is missing, so the card
 * shows its empty state rather than an empty list that reads as "nobody collected".
 */
export async function getFans(days = 30): Promise<FanRow[] | null> {
  const key = process.env.ADMIN_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`${apiBase}/admin/fans?days=${days}`, {
      headers: { 'X-API-Key': key },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { fans?: FanRow[] };
    return Array.isArray(body.fans) ? body.fans : null;
  } catch {
    return null;
  }
}
