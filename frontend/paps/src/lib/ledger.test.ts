import { beforeEach, describe, expect, it } from 'vitest';
import { hasLedger, isFresh, loadLedger, saveLedger } from './ledger';
import { initial, reduce, type State } from './store';

// Minimal localStorage so the module can be tested without a browser.
const store = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: (i: number) => Array.from(store.keys())[i] ?? null,
  get length() {
    return store.size;
  },
} as Storage;

const opened = (): State =>
  reduce(initial, {
    type: 'place',
    symbol: 'ADA-USD',
    side: 'LONG',
    kind: 'market',
    price: 0.25,
    size: 400,
    leverage: 5,
    mark: 0.25,
    step: 1,
    id: 'p1',
  });

describe('paper ledger persistence', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips equity, positions and stats', () => {
    saveLedger('anon', opened());
    const back = loadLedger('anon');
    expect(back?.equity).toBeCloseTo(9_999.95, 4);
    expect(back?.positions).toHaveLength(1);
    expect(back?.stats).toBeDefined();
  });

  it('keeps addresses separate', () => {
    saveLedger('anon', opened());
    expect(hasLedger('anon')).toBe(true);
    expect(hasLedger('addr1test')).toBe(false);
  });

  it('treats a ledger with no trades as fresh, so adoption is safe', () => {
    expect(isFresh('nobody')).toBe(true);
    saveLedger('anon', initial);
    expect(isFresh('anon')).toBe(true);
    saveLedger('anon', opened());
    expect(isFresh('anon')).toBe(false);
  });

  it('refuses a shape it does not recognise instead of half-loading it', () => {
    localStorage.setItem('paps.ledger.v1.anon', JSON.stringify({ equity: 'lots' }));
    expect(loadLedger('anon')).toBeNull();
  });
});
