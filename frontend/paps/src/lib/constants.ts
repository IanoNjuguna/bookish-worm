/** Sizes and intervals the UI offers. Values are Strike's own, not invented. */

export const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;
export type Interval = (typeof INTERVALS)[number];

export const LEVERAGES = [1, 2, 3, 5, 10, 20, 25, 50] as const;

export const BOOK_DEPTH = 14;

/** Symbols worth showing first, then everything else alphabetically. */
export const FEATURED = ['BTC-USD', 'ETH-USD', 'ADA-USD', 'SOL-USD'];

export const ENV_LABEL: Record<string, string> = {
  mainnet: 'mainnet',
  testnet: 'testnet',
};
