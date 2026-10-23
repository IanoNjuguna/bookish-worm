import { describe, expect, it } from 'vitest';
import { countdown, fullHash } from './format';

describe('the quote countdown', () => {
  it('reads as m:ss, always two digits on the seconds', () => {
    expect(countdown(0)).toBe('0:00');
    expect(countdown(9_000)).toBe('0:09');
    expect(countdown(59_000)).toBe('0:59');
    expect(countdown(60_000)).toBe('1:00');
    expect(countdown(272_000)).toBe('4:32');
  });

  it('grows an hours field rather than counting past 60 minutes', () => {
    expect(countdown(3_600_000)).toBe('1:00:00');
    expect(countdown(3_723_000)).toBe('1:02:03');
  });

  it('never counts backwards, even when the clock is past the expiry', () => {
    expect(countdown(-5_000)).toBe('0:00');
  });

  it('prints a hash whole, because the receipt is the only copy', () => {
    const hash = 'ab'.repeat(32);
    expect(fullHash(hash)).toBe(hash);
  });
});
