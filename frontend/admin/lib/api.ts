export type Release = {
  token_id: number;
  name: string;
  ticker: string | null;
  price: string | null;
  max_supply: string | null;
  supply_capped: number;
  mint_count: number;
  play_count: number;
  splitter: string | null;
  artist: string;
};

const API = process.env.CORE_API_URL ?? 'https://app.doba.world/api-backend';

export const apiBase = API;

export type ReleasesResult = {
  releases: Release[];
  /** false when core-api is unreachable: the page must render a state, not a 500. */
  available: boolean;
};

/**
 * The public catalogue. Never throws: a dashboard whose job is to report that the
 * API is down cannot itself fail when the API is down.
 */
export async function getReleases(): Promise<ReleasesResult> {
  try {
    const res = await fetch(`${API}/songs`, { next: { revalidate: 60 } });
    if (!res.ok) return { releases: [], available: false };
    const body = (await res.json()) as Release[] | { songs: Release[] };
    const releases = Array.isArray(body) ? body : body.songs;
    return { releases: Array.isArray(releases) ? releases : [], available: true };
  } catch {
    return { releases: [], available: false };
  }
}
