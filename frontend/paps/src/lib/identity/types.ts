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

/**
 * `utxos` is legacy: the embedded wallet it named is no longer shipped, but a session stored
 * in localStorage before it was removed still carries the value, and the deposit gate has to
 * recognise it rather than trying to sign with a wallet that is not there.
 */
export type IdentityProvider = 'cip30' | 'utxos';

export type Identity = {
  provider: IdentityProvider;
  /** Bech32 address; the only stable identifier this app has. */
  address: string;
  /** Wallet name as the user knows it, e.g. "Eternl". */
  wallet: string;
  /** Present when connected through Strike's builder flow. */
  accountId?: string;
  apiWalletId?: string;
  publicKeyHex?: string;
  feeShareBps?: number;
  /** Unix ms when the API wallet stops working; 0 or absent means the venue told us nothing. */
  expiresAt?: number;
};

export const shortAddress = (address: string, head = 8, tail = 6): string =>
  address.length <= head + tail + 1 ? address : `${address.slice(0, head)}…${address.slice(-tail)}`;
