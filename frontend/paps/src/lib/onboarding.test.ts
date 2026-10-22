import { beforeEach, describe, expect, it } from 'vitest';
import { hasSeenOnboarding, markOnboarded } from './onboarding';

/** Minimal in-memory localStorage: the flag must behave with real storage semantics. */
const store = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() {
    return store.size;
  },
} as Storage;

describe('onboarding flag', () => {
  beforeEach(() => store.clear());

  it('is unseen on a fresh browser', () => {
    expect(hasSeenOnboarding()).toBe(false);
  });

  it('is seen once marked, and stays seen', () => {
    markOnboarded();
    expect(hasSeenOnboarding()).toBe(true);
    expect(store.get('paps.onboarded.v1')).toBe('1');
  });

  it('does not throw when storage is blocked, and never walls the app', () => {
    const original = globalThis.localStorage;
    (globalThis as unknown as { localStorage: Storage }).localStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;

    expect(() => markOnboarded()).not.toThrow();
    // A blocked quota reports "seen" so a trader is not stuck behind a sheet they cannot dismiss.
    expect(hasSeenOnboarding()).toBe(true);

    (globalThis as unknown as { localStorage: Storage }).localStorage = original;
  });
});
