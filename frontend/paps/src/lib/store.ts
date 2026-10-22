import { useMemo, useReducer } from 'react';
import { liquidationPrice, notionalOf, roundTo, type Position, type Side } from './order';

export type OrderKind = 'market' | 'limit';
export type OrderStatus = 'open' | 'filled' | 'cancelled';

export type WorkingOrder = {
  id: string;
  symbol: string;
  side: Side;
  kind: OrderKind;
  price: number;
  size: number;
  filled: number;
  status: OrderStatus;
  createdAt: number;
};

export type Fill = {
  id: string;
  symbol: string;
  side: Side;
  price: number;
  size: number;
  fee: number;
  time: number;
};

export type State = {
  equity: number;
  positions: Position[];
  orders: WorkingOrder[];
  fills: Fill[];
  /** Behavioural counters. Progress is earned by how trades end, not how many. */
  stats: {
    cleanCloses: number;
    liquidations: number;
    best: number;
    worst: number;
    peak: number;
  };
};

type Action =
  | {
      type: 'place';
      symbol: string;
      side: Side;
      kind: OrderKind;
      price: number;
      size: number;
      leverage: number;
      mark: number;
      step: number;
      id?: string;
    }
  | { type: 'undo'; id: string }
  | { type: 'cancel'; id: string }
  | { type: 'close'; id: string; mark: number; fraction?: number }
  | { type: 'closeAll'; mark: number }
  | { type: 'liquidate'; ids: string[] }
  | { type: 'hydrate'; state: Partial<State> }
  | { type: 'fund'; symbol: string; rate: number; mark: number };

export const START_EQUITY = 10_000;
const TAKER_FEE = 0.0005;
const LIQUIDATION_FEE = 0.01; // exchangeInfo reports 1%

const uid = () => Math.random().toString(36).slice(2, 10);

/**
 * Paper account. Market orders fill immediately at the mark, limit orders rest and
 * fill when the mark crosses them. Every fill moves margin and equity, so the blotter
 * is arithmetic rather than decoration.
 */
export function reduce(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      // Replace the whole ledger with a stored one; anything missing keeps its default.
      return {
        equity: action.state.equity ?? state.equity,
        positions: action.state.positions ?? [],
        orders: action.state.orders ?? [],
        fills: action.state.fills ?? [],
        stats: action.state.stats ?? state.stats,
      };

    case 'place': {
      const { symbol, side, kind, price, size, leverage, mark, step } = action;
      const fills: Fill[] = [];
      let orders = state.orders;
      let positions = state.positions;
      let equity = state.equity;

      const executed = kind === 'market' || (kind === 'limit' && (side === 'LONG' ? mark <= price : mark >= price));

      if (executed) {
        const entry = kind === 'market' ? mark : price;
        const notional = notionalOf(entry, size);
        const margin = notional / leverage;
        const fee = notional * TAKER_FEE;

        const existing = positions.find((p) => p.symbol === symbol && p.side === side);
        if (existing) {
          const newSize = existing.size + size;
          positions = positions.map((p) =>
            p.id === existing.id
              ? {
                  ...p,
                  size: newSize,
                  entry: (p.entry * p.size + entry * size) / newSize,
                  margin: p.margin + margin,
                }
              : p,
          );
        } else {
          positions = [
            {
              id: action.id ?? uid(),
              symbol,
              side,
              entry,
              size,
              leverage,
              margin,
              openedAt: Date.now(),
            },
            ...positions,
          ];
        }
        equity -= fee;
        fills.push({ id: uid(), symbol, side, price: entry, size, fee, time: Date.now() });
      } else {
        orders = [
          {
            id: uid(),
            symbol,
            side,
            kind,
            price: roundTo(price, step),
            size,
            filled: 0,
            status: 'open',
            createdAt: Date.now(),
          },
          ...orders,
        ];
      }

      return { ...state, orders, positions, equity, fills: [...fills, ...state.fills] };
    }

    case 'undo': {
      // A swipe is immediate and reversible for two seconds: the position goes, the
      // fee goes with it, and any fill it produced is removed from the history.
      const position = state.positions.find((p) => p.id === action.id);
      if (!position) return state;
      const notional = notionalOf(position.entry, position.size);
      return {
        ...state,
        positions: state.positions.filter((p) => p.id !== action.id),
        equity: state.equity + notional * TAKER_FEE,
        fills: state.fills.filter((f) => !(f.price === position.entry && f.size === position.size)),
      };
    }

    case 'cancel':
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.id ? { ...o, status: 'cancelled' } : o)),
      };

    case 'fund': {
      // Longs pay shorts when the rate is positive, and receive when it is negative.
      // Charged against equity and recorded on the position, because a perp that never
      // pays funding is not a perp — it is a free carry.
      const { symbol, rate, mark } = action;
      if (!Number.isFinite(rate) || !mark) return state;

      let equity = state.equity;
      const positions = state.positions.map((p) => {
        if (p.symbol !== symbol) return p;
        const notional = Math.abs(p.size) * mark;
        const flow = (p.side === 'LONG' ? -1 : 1) * notional * rate;
        equity += flow;
        return { ...p, funding: (p.funding ?? 0) + flow };
      });

      if (equity === state.equity) return state;
      return { ...state, equity, positions };
    }

    case 'close': {
      const position = state.positions.find((p) => p.id === action.id);
      if (!position) return state;
      const { mark } = action;
      const fraction = Math.min(1, Math.max(0, action.fraction ?? 1));
      const closedSize = position.size * fraction;
      const pnl =
        position.side === 'LONG'
          ? (mark - position.entry) * closedSize
          : (position.entry - mark) * closedSize;
      const fee = notionalOf(mark, closedSize) * TAKER_FEE;
      const remaining = position.size - closedSize;

      const stats = {
        cleanCloses: state.stats.cleanCloses + (pnl > 0 ? 1 : 0),
        liquidations: state.stats.liquidations,
        best: Math.max(state.stats.best, pnl),
        worst: Math.min(state.stats.worst, pnl),
        peak: Math.max(state.stats.peak, state.equity + pnl - fee),
      };

      return {
        ...state,
        stats,
        positions:
          remaining <= 0
            ? state.positions.filter((p) => p.id !== action.id)
            : state.positions.map((p) =>
                p.id === action.id
                  ? { ...p, size: remaining, margin: p.margin * (1 - fraction) }
                  : p,
              ),
        equity: state.equity + pnl - fee,
        fills: [
          {
            id: uid(),
            symbol: position.symbol,
            side: position.side === 'LONG' ? 'SHORT' : 'LONG',
            price: mark,
            size: closedSize,
            fee,
            time: Date.now(),
          },
          ...state.fills,
        ],
      };
    }

    case 'closeAll': {
      if (!state.positions.length) return state;
      return state.positions.reduce(
        (acc, p) => reduce(acc, { type: 'close', id: p.id, mark: action.mark }),
        state,
      );
    }

    case 'liquidate': {
      // Liquidation is not a favour: it closes the position at the mark and charges the
      // venue's 1% liquidation fee, which is what exchangeInfo reports.
      if (!action.ids.length) return state;
      return action.ids.reduce((acc, id) => {
        const position = acc.positions.find((p) => p.id === id);
        if (!position) return acc;
        const mark = position.entry;
        const closed = reduce(acc, { type: 'close', id, mark });
        const penalty = notionalOf(mark, position.size) * LIQUIDATION_FEE;
        return {
          ...closed,
          equity: closed.equity - penalty,
          stats: { ...closed.stats, liquidations: closed.stats.liquidations + 1 },
        };
      }, state);
    }
  }
}

export const initial: State = {
  equity: START_EQUITY,
  positions: [],
  orders: [],
  fills: [],
  stats: { cleanCloses: 0, liquidations: 0, best: 0, worst: 0, peak: START_EQUITY },
};
export const TAKER_FEE_BPS = TAKER_FEE;
export const LIQUIDATION_FEE_RATE = LIQUIDATION_FEE;

export function usePaperAccount() {
  const [state, dispatch] = useReducer(reduce, initial);

  const actions = useMemo(
    () => ({
      place: (a: Omit<Action & { type: 'place' }, 'type'>) => dispatch({ type: 'place', ...a }),
      undo: (id: string) => dispatch({ type: 'undo', id }),
      cancel: (id: string) => dispatch({ type: 'cancel', id }),
      close: (id: string, mark: number, fraction = 1) => dispatch({ type: 'close', id, mark, fraction }),
      closeAll: (mark: number) => dispatch({ type: 'closeAll', mark }),
      liquidate: (ids: string[]) => dispatch({ type: 'liquidate', ids }),
      hydrate: (state: Partial<State>) => dispatch({ type: 'hydrate', state }),
      fund: (a: { symbol: string; rate: number; mark: number }) => dispatch({ type: 'fund', ...a }),
    }),
    [],
  );

  return { ...state, ...actions };
}

export const marginOf = (p: Position): number => p.margin;
export { liquidationPrice };

/** What a caller needs to persist this ledger. */
export const snapshot = (state: State): State => state;
