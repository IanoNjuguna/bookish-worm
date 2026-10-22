import type { State } from './store';

/**
 * The paper ledger, persisted.
 *
 * Without this, a refresh returns the trader to $10,000 with no positions — which a
 * judge will do mid-demo, and which makes "your progress carries with your wallet" a
 * promise the engine cannot keep.
 *
 * Versioned by key: a shape change resets cleanly instead of rendering nonsense.
 */

const VERSION = 'v1';
const key = (who: string) => `paps.ledger.${VERSION}.${who}`;

const MAX_FILLS = 50;

/** Who owns a ledger: a wallet address, or the guest bucket on this device. */
export const ledgerOwner = (address: string | null): string => address ?? 'anon';

export function saveLedger(who: string, state: State): void {
  try {
    localStorage.setItem(
      key(who),
      JSON.stringify({
        equity: state.equity,
        positions: state.positions,
        orders: state.orders.slice(0, 20),
        fills: state.fills.slice(0, MAX_FILLS),
        stats: state.stats,
      }),
    );
  } catch {
    /* a full quota should not stop trading */
  }
}

export function loadLedger(who: string): Partial<State> | null {
  try {
    const raw = localStorage.getItem(key(who));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<State>;
    // Reject anything that is not shaped like a ledger rather than half-load it.
    if (typeof parsed.equity !== 'number' || !Array.isArray(parsed.positions)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const hasLedger = (who: string): boolean => loadLedger(who) !== null;

/** True when the ledger has no trading history, so adopting another one is harmless. */
export const isFresh = (who: string): boolean => {
  const l = loadLedger(who);
  return !l || ((l.positions?.length ?? 0) === 0 && (l.fills?.length ?? 0) === 0);
};
