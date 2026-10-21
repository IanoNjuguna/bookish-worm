export type Level = [price: string, qty: string];

export type DepthSnapshot = {
  lastUpdateId: number | string;
  E: number;
  T: number;
  bids: Level[];
  asks: Level[];
};

export type DepthUpdate = {
  e: 'depthUpdate';
  s: string;
  u: number | string;
  b: Level[];
  a: Level[];
};

export type BookTicker = {
  symbol: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  time: number;
};

export type MarkPrice = {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  estimatedSettlePrice?: string;
  lastFundingRate: string;
  nextFundingTime: number;
  time: number;
};

export type Trade = {
  id: number;
  price: string;
  qty: string;
  time: number;
  isBuyerMaker?: boolean;
  isBestMatch?: boolean;
};

/** Klines arrive as Binance-shaped tuples: [openTime, o, h, l, c, vol, closeTime, ...] */
export type Kline = [number, string, string, string, string, string, number, ...unknown[]];

export type Filter = {
  filterType: string;
  tickSize?: string;
  stepSize?: string;
  minQty?: string;
  maxQty?: string;
  notional?: string;
  minPrice?: string;
  maxPrice?: string;
};

export type SymbolInfo = {
  symbol: string;
  status: string;
  pricePrecision: number;
  quantityPrecision?: number;
  baseAsset?: string;
  quoteAsset?: string;
  contractType?: string;
  liquidationFee?: string;
  filters?: Filter[];
};

export type ExchangeInfo = {
  timezone: string;
  serverTime: number;
  rateLimits: { rateLimitType: string; interval: string; limit: number }[];
  symbols: SymbolInfo[];
};

export type WsEnvelope =
  | { id?: number; result?: unknown; error?: { code: number; msg: string } }
  | DepthUpdate
  | { e: 'markPriceUpdate'; s: string; p: string; r: string; T: number }
  | { e: 'trade'; s: string; p: string; q: string; T: number; m: boolean }
  | { e: string; [k: string]: unknown };
