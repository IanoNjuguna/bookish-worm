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

export async function getReleases(): Promise<Release[]> {
  const res = await fetch(`${API}/songs`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`core-api returned ${res.status} for /songs`);
  const body = (await res.json()) as Release[] | { songs: Release[] };
  return Array.isArray(body) ? body : body.songs;
}
