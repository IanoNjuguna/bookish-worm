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

type State = {
  equity: number;
  positions: Position[];
  orders: WorkingOrder[];
  fills: Fill[];
};

type Action =
  | { type: 'place'; symbol: string; side: Side; kind: OrderKind; price: number; size: number; leverage: number; mark: number; step: number }
  | { type: 'cancel'; id: string }
  | { type: 'close'; id: string; mark: number };

const START_EQUITY = 10_000;
const TAKER_FEE = 0.0005;

const uid = () => Math.random().toString(36).slice(2, 10);

/**
 * Paper account. Market orders fill immediately at the mark, limit orders rest and
 * fill when the mark crosses them. Every fill moves margin and equity, so the blotter
 * is arithmetic rather than decoration.
 */
function reduce(state: State, action: Action): State {
  switch (action.type) {
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
              id: uid(),
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

    case 'cancel':
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.id ? { ...o, status: 'cancelled' } : o)),
      };

    case 'close': {
      const position = state.positions.find((p) => p.id === action.id);
      if (!position) return state;
      const { mark } = action;
      const pnl =
        position.side === 'LONG'
          ? (mark - position.entry) * position.size
          : (position.entry - mark) * position.size;
      const fee = notionalOf(mark, position.size) * TAKER_FEE;
      return {
        ...state,
        positions: state.positions.filter((p) => p.id !== action.id),
        equity: state.equity + pnl - fee,
        fills: [
          { id: uid(), symbol: position.symbol, side: position.side === 'LONG' ? 'SHORT' : 'LONG', price: mark, size: position.size, fee, time: Date.now() },
          ...state.fills,
        ],
      };
    }
  }
}

export const initial: State = { equity: START_EQUITY, positions: [], orders: [], fills: [] };

export function usePaperAccount() {
  const [state, dispatch] = useReducer(reduce, initial);

  const actions = useMemo(
    () => ({
      place: (a: Omit<Action & { type: 'place' }, 'type'>) => dispatch({ type: 'place', ...a }),
      cancel: (id: string) => dispatch({ type: 'cancel', id }),
      close: (id: string, mark: number) => dispatch({ type: 'close', id, mark }),
    }),
    [],
  );

  return { ...state, ...actions };
}

export const marginOf = (p: Position): number => p.margin;
export { liquidationPrice };
