import type { Side } from '../order';
import { isReconnect, strikeGet, VenueError } from './http';
import { readFills, readOpenOrders, type VenueFill, type VenueOrder } from './orders';

/**
 * The venue's user-data routes, read through our signing proxy.
 *
 * Every call goes to `/api/strike/<path>`, never to the venue directly: the API wallet key
 * lives in the Worker, and the session is an HttpOnly cookie, so `credentials` has to be
 * `same-origin` or the proxy answers 401. Our URLs drop the venue's `/v2` prefix — see
 * `src/server/pages.ts` for why.
 *
 * Amounts stay as the strings the venue sent. A position size, an entry price and a
 * funding total are precise decimals, and `Number()` on the way in throws that away for
 * no gain; the display layer formats the string with `lib/format.ts`, which accepts both.
 *
 * Orders and fills live in `orders.ts` — they are what the account *does*, not what it
 * holds — and are re-exported here so a read of the whole account is still one import.
 */

/** The transport's error, re-exported: every caller of this module already catches it. */
export { isReconnect, VenueError };

/* ------------------------------------------------------------------ raw payloads */

export type RawAccount = {
  account_id?: string;
  wallet_balance?: string;
  available_balance?: string;
  copy_reserved_balance?: string;
  unrealized_pnl?: string;
  margin_balance?: string;
  total_margin?: string;
  position_initial_margin?: string;
  maintenance_margin?: string;
  symbol_settings?: Record<
    string,
    { margin_mode?: string; leverage?: number; allow_pre_trade?: boolean }
  >;
  /** The venue sends more than we read; only these fields are normalised. */
  [key: string]: unknown;
};

export type RawPosition = {
  id?: number;
  symbol?: string;
  size?: string;
  entry_price?: string;
  iso_balance?: string;
  accumulated_funding_fees?: string;
  upnl?: string;
  maintenance_margin?: string;
  bankruptcy_price?: string;
  liquidation_price?: string;
  leverage?: number;
  margin_mode?: string;
  create_timestamp?: number;
  update_timestamp?: number;
  [key: string]: unknown;
};

export type RawPositions = { positions?: RawPosition[]; count?: number };

export type RawFundingRow = {
  id?: number;
  symbol?: string;
  position_side?: string;
  position_size?: string;
  funding_rate?: string;
  amount?: string;
  timestamp?: number;
  [key: string]: unknown;
};

export type RawFunding = { funding?: RawFundingRow[]; count?: number };

export type RawTransactionRow = {
  id?: number;
  type?: string;
  amount?: string;
  asset?: string;
  status?: string;
  timestamp?: number;
  [key: string]: unknown;
};

export type RawTransactions = { transactions?: RawTransactionRow[]; count?: number };

/* ------------------------------------------------------------------ normalised */

export type VenueAccount = {
  accountId: string;
  walletBalance: string;
  availableBalance: string;
  unrealizedPnl: string;
  marginBalance: string;
  totalMargin: string;
  maintenanceMargin: string;
  symbolSettings: Record<string, { marginMode: string; leverage: number }>;
};

export type VenuePosition = {
  id: string;
  symbol: string;
  side: Side;
  /** Signed, exactly as the venue sent it: negative is a short. */
  size: string;
  /** The same size without its sign, for display next to the side. */
  absSize: string;
  entryPrice: string;
  isoBalance: string;
  upnl: string;
  maintenanceMargin: string;
  /** Empty when the venue reports 0, i.e. it did not compute one. */
  liquidationPrice: string;
  /** Accumulated funding over the life of the position: positive received, negative paid. */
  funding: string;
  leverage: number;
  marginMode: string;
  openedAt: number;
};

/** Orders and fills are shaped by `orders.ts`; re-exported so a read needs one import. */
export type { VenueFill, VenueOrder };

export type VenueFundingRow = {
  id: string;
  symbol: string;
  side: Side;
  size: string;
  rate: string;
  /** Signed: positive received, negative paid. */
  amount: string;
  at: number;
};

export type VenueTransactionRow = {
  id: string;
  type: string;
  /** Signed. */
  amount: string;
  status: string;
  at: number;
};

export type VenueData = {
  account: VenueAccount;
  positions: VenuePosition[];
  orders: VenueOrder[];
  /** The venue's executions. The only evidence that anything filled. */
  fills: VenueFill[];
  funding: VenueFundingRow[];
  transactions: VenueTransactionRow[];
};

/* ------------------------------------------------------------------ normalisers */

const str = (v: unknown, fallback = ''): string =>
  typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : fallback;

export const sideOf = (size: string): Side => (Number(size) < 0 ? 'SHORT' : 'LONG');

/** Keep the magnitude as a string: re-typing it as a number is where precision dies. */
export const magnitudeOf = (size: string): string => {
  const s = size.trim();
  return s.startsWith('-') ? s.slice(1) : s;
};

export const normaliseAccount = (raw: RawAccount): VenueAccount => ({
  accountId: str(raw.account_id),
  walletBalance: str(raw.wallet_balance, '0'),
  availableBalance: str(raw.available_balance, '0'),
  unrealizedPnl: str(raw.unrealized_pnl, '0'),
  marginBalance: str(raw.margin_balance, '0'),
  totalMargin: str(raw.total_margin, '0'),
  maintenanceMargin: str(raw.maintenance_margin, '0'),
  symbolSettings: Object.fromEntries(
    Object.entries(raw.symbol_settings ?? {}).map(([symbol, s]) => [
      symbol,
      { marginMode: str(s?.margin_mode, 'isolated'), leverage: Number(s?.leverage ?? 1) },
    ]),
  ),
});

export const normalisePosition = (raw: RawPosition): VenuePosition => {
  const size = str(raw.size, '0');
  const liq = str(raw.liquidation_price);
  return {
    id: str(raw.id, `${str(raw.symbol)}-${size}`),
    symbol: str(raw.symbol),
    side: sideOf(size),
    size,
    absSize: magnitudeOf(size),
    entryPrice: str(raw.entry_price, '0'),
    isoBalance: str(raw.iso_balance, '0'),
    upnl: str(raw.upnl, '0'),
    maintenanceMargin: str(raw.maintenance_margin, '0'),
    // The venue sends "0" when a position is far from liquidation, which is not a price.
    liquidationPrice: liq === '0' ? '' : liq,
    funding: str(raw.accumulated_funding_fees, '0'),
    leverage: Number(raw.leverage ?? 1),
    marginMode: str(raw.margin_mode, 'isolated'),
    openedAt: Number(raw.create_timestamp ?? 0),
  };
};

/** A zero-sized row is a closed position the venue has not swept yet; it is not a holding. */
export const normalisePositions = (raw: RawPositions | RawPosition[]): VenuePosition[] => {
  const rows = Array.isArray(raw) ? raw : (raw.positions ?? []);
  return rows
    .map(normalisePosition)
    .filter((p) => p.symbol && Number(p.size) !== 0);
};

export const normaliseFunding = (raw: RawFunding | RawFundingRow[]): VenueFundingRow[] => {
  const rows = Array.isArray(raw) ? raw : (raw.funding ?? []);
  return rows
    .map((r) => ({
      id: str(r.id),
      symbol: str(r.symbol),
      side: r.position_side === 'Short' ? ('SHORT' as Side) : ('LONG' as Side),
      size: str(r.position_size, '0'),
      rate: str(r.funding_rate, '0'),
      amount: str(r.amount, '0'),
      at: Number(r.timestamp ?? 0),
    }))
    .filter((r) => r.symbol);
};

export const normaliseTransactions = (
  raw: RawTransactions | RawTransactionRow[],
): VenueTransactionRow[] => {
  const rows = Array.isArray(raw) ? raw : (raw.transactions ?? []);
  return rows
    .map((r) => ({
      id: str(r.id),
      type: str(r.type, 'unknown'),
      amount: str(r.amount, '0'),
      status: str(r.status, ''),
      at: Number(r.timestamp ?? 0),
    }))
    .filter((r) => r.id);
};

/* ------------------------------------------------------------------ transport */

export const readAccount = async (signal?: AbortSignal): Promise<VenueAccount> =>
  normaliseAccount(await strikeGet<RawAccount>('account', signal));

export const readPositions = async (signal?: AbortSignal): Promise<VenuePosition[]> =>
  normalisePositions(await strikeGet<RawPositions>('positions', signal));

export const readFunding = async (signal?: AbortSignal): Promise<VenueFundingRow[]> =>
  normaliseFunding(await strikeGet<RawFunding>('history/funding?limit=50', signal));

export const readTransactions = async (signal?: AbortSignal): Promise<VenueTransactionRow[]> =>
  normaliseTransactions(await strikeGet<RawTransactions>('history/transaction?limit=50', signal));

/**
 * One read, so a half-refreshed account never renders next to yesterday's positions.
 *
 * Fills are read every time as well: an order that left the working book has to reappear
 * somewhere, and the fill history is the only place paps is allowed to call it filled.
 */
export async function readVenue(signal?: AbortSignal): Promise<VenueData> {
  const [account, positions, orders, fills, funding, transactions] = await Promise.all([
    readAccount(signal),
    readPositions(signal),
    readOpenOrders(signal),
    readFills(signal),
    readFunding(signal),
    readTransactions(signal),
  ]);
  return { account, positions, orders, fills, funding, transactions };
}
