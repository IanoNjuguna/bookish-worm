/** Number formatting for a trading surface: fixed decimals, no floating-point drift. */

export const usd = (v: number | string, dp = 2): string => {
  const n = typeof v === 'string' ? Number(v) : v;
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
};

/** Prices carry more decimals than dollars once they are below a dollar. */
export const price = (v: number | string): string => {
  const n = typeof v === 'string' ? Number(v) : v;
  if (!Number.isFinite(n)) return '—';
  const dp = n >= 1000 ? 1 : n >= 1 ? 2 : n >= 0.01 ? 5 : 6;
  return usd(n, dp);
};

export const qty = (v: number | string, dp = 2): string =>
  usd(v, typeof v === 'string' && v.includes('.') ? Math.min(6, v.split('.')[1].length) : dp);

export const compact = (v: number | string): string => {
  const n = typeof v === 'string' ? Number(v) : v;
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(2);
};

export const signed = (v: number, dp = 2): string => `${v >= 0 ? '+' : '−'}${usd(Math.abs(v), dp)}`;

/** Money that carries a direction, which funding always does: it is a credit or a charge. */
export const signedUsd = (v: number, dp = 2): string =>
  `${v < 0 ? '−' : '+'}$${usd(Math.abs(v), dp)}`;

export const pct = (v: number, dp = 2): string => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(dp)}%`;

export const clock = (ms: number): string =>
  new Date(ms).toLocaleTimeString('en-GB', { hour12: false });

/** Strike settles funding hourly, so the annualised figure multiplies by 24 windows a day. */
export const fundingApr = (rate: number): string => `${(rate * 24 * 365 * 100).toFixed(1)}%`;
