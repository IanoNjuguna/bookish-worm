/** Identity: who is trading, and what they like. Deliberately small. */

import type { Stats } from '../progress';

export type Profile = {
  /** What the trader wants to be called on their own cards. */
  handle: string;
  /** Default risk per swipe, in USD. */
  riskUsd: number;
  /** Default leverage for swipe and lite. */
  leverage: number;
  /** Where the app should open. */
  defaultView: 'pro' | 'lite' | 'swipe';
  /** Markets this trader cares about; the deck puts them first. */
  watchlist: string[];
  /** Mode the ticket uses in Lite (market or limit). */
  liteOrderKind: 'market' | 'limit';
  /** Progression: earned by how trades end, not by how many. */
  stats: Stats;
};

export const DEFAULT_PROFILE: Profile = {
  handle: '',
  riskUsd: 100,
  leverage: 5,
  defaultView: 'swipe',
  watchlist: [],
  liteOrderKind: 'market',
  stats: { xp: 0, cleanCloses: 0, liquidations: 0, rounds: 0, best: 0, worst: 0, peak: 10_000 },
};

export type IdentityProvider = 'cip30' | 'utxos';

export type Identity = {
  provider: IdentityProvider;
  /** Bech32 address; the only stable identifier this app has. */
  address: string;
  /** Wallet name as the user knows it, e.g. "Eternl". */
  wallet: string;
};

export const shortAddress = (address: string, head = 8, tail = 6): string =>
  address.length <= head + tail + 1 ? address : `${address.slice(0, head)}…${address.slice(-tail)}`;
