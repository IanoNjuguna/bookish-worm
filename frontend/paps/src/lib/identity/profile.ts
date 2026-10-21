import { DEFAULT_PROFILE, type Profile } from './types';

/**
 * Profile storage, keyed by address. There is no backend in paps, so preferences live
 * in the browser and travel with the address rather than with a session — switching
 * wallets switches traders, which is what you want when demoing two accounts.
 */

const KEY = 'paps.profile.';

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
};

export const loadProfile = (address: string | null): Profile => {
  if (!address) return read(KEY + 'anon', DEFAULT_PROFILE);
  return read(KEY + address, DEFAULT_PROFILE);
};

export const saveProfile = (address: string | null, profile: Profile): void => {
  try {
    localStorage.setItem(KEY + (address ?? 'anon'), JSON.stringify(profile));
  } catch {
    /* a blocked storage quota should not break trading */
  }
};

export const toggleWatch = (profile: Profile, symbol: string): Profile => {
  const watching = profile.watchlist.includes(symbol);
  return {
    ...profile,
    watchlist: watching
      ? profile.watchlist.filter((s) => s !== symbol)
      : [...profile.watchlist, symbol].slice(0, 12),
  };
};
