import { describe, expect, it } from 'vitest';
import { memoryRateLimitStore } from './keystore';
import { route } from './pages';
import {
  DEFAULT_LIMITS,
  enforce,
  ipBucket,
  isWrite,
  limitsFrom,
  perMinute,
  refill,
  retryAfterSeconds,
  sessionBucket,
} from './rateLimit';
import { HttpError } from './types';

const NOW = 1_700_000_000_000;

describe('bucket maths', () => {
  it('refills in proportion to elapsed time and never past the bucket', () => {
    const spec = perMinute(60);
    expect(refill(0, NOW, NOW, spec)).toBe(0);
    expect(refill(0, NOW, NOW + 1_000, spec)).toBeCloseTo(1, 6);
    expect(refill(30, NOW, NOW + 15_000, spec)).toBeCloseTo(45, 6);
    // A bucket left alone for a day is full, not overflowing.
    expect(refill(1, NOW, NOW + 86_400_000, spec)).toBe(60);
  });

  it('takes nothing away when the clock goes backwards', () => {
    const spec = perMinute(60);
    expect(refill(10, NOW, NOW - 5_000, spec)).toBe(10);
  });

  it('states a cooldown that buys at least one token', () => {
    expect(retryAfterSeconds(perMinute(60))).toBe(1);
    expect(retryAfterSeconds(perMinute(6))).toBe(10);
    // Sub-second waits still round up to a whole second: `retry-after` has no fraction.
    expect(retryAfterSeconds(perMinute(240))).toBe(1);
  });
});

describe('memory rate limit store', () => {
  const spec = perMinute(3);

  it('admits the capacity and then refuses', async () => {
    const store = memoryRateLimitStore();
    const key = sessionBucket('abc', 'write');
    expect(await store.take(key, spec, NOW)).toBe(true);
    expect(await store.take(key, spec, NOW)).toBe(true);
    expect(await store.take(key, spec, NOW)).toBe(true);
    expect(await store.take(key, spec, NOW)).toBe(false);
  });

  it('keeps buckets apart', async () => {
    const store = memoryRateLimitStore();
    await store.take(sessionBucket('abc', 'write'), perMinute(1), NOW);
    expect(await store.take(sessionBucket('abc', 'write'), perMinute(1), NOW)).toBe(false);
    // Another session, and the same session's read bucket, are both untouched.
    expect(await store.take(sessionBucket('def', 'write'), perMinute(1), NOW)).toBe(true);
    expect(await store.take(sessionBucket('abc', 'read'), perMinute(1), NOW)).toBe(true);
  });

  it('hands tokens back as time passes', async () => {
    const store = memoryRateLimitStore();
    const key = ipBucket('203.0.113.7');
    expect(await store.take(key, perMinute(2), NOW)).toBe(true);
    expect(await store.take(key, perMinute(2), NOW)).toBe(true);
    expect(await store.take(key, perMinute(2), NOW)).toBe(false);
    expect(await store.take(key, perMinute(2), NOW + 15_000)).toBe(false);
    expect(await store.take(key, perMinute(2), NOW + 31_000)).toBe(true);
  });
});

describe('limits per environment', () => {
  it('falls back to the defaults when nothing is set', () => {
    expect(limitsFrom({})).toEqual(DEFAULT_LIMITS);
  });

  it('takes a per-minute number from the environment', () => {
    const limits = limitsFrom({
      RATE_READ_PER_MIN: '600',
      RATE_WRITE_PER_MIN: '12',
      RATE_CONNECT_PER_MIN: '4',
    });
    expect(limits.read).toEqual(perMinute(600));
    expect(limits.write).toEqual(perMinute(12));
    expect(limits.connect).toEqual(perMinute(4));
  });

  it('refuses to read a typo as "no limit"', () => {
    const limits = limitsFrom({
      RATE_READ_PER_MIN: 'lots',
      RATE_WRITE_PER_MIN: '0',
      RATE_CONNECT_PER_MIN: '-5',
    });
    expect(limits).toEqual(DEFAULT_LIMITS);
  });

  it('treats everything but a read as a write', () => {
    expect(isWrite('GET')).toBe(false);
    expect(isWrite('get')).toBe(false);
    expect(isWrite('HEAD')).toBe(false);
    expect(isWrite('POST')).toBe(true);
    expect(isWrite('DELETE')).toBe(true);
    expect(isWrite('PATCH')).toBe(true);
  });
});

describe('refusing a request', () => {
  it('throws a 429 that carries the cooldown', async () => {
    const store = memoryRateLimitStore();
    const args = { store, key: ipBucket('198.51.100.2'), spec: perMinute(1), now: NOW };
    await enforce(args);
    const refused = await enforce(args).catch((e) => e);
    expect(refused).toBeInstanceOf(HttpError);
    expect(refused.status).toBe(429);
    expect(refused.code).toBe('rate_limited');
    expect(refused.retryAfterSeconds).toBe(60);
  });

  it('reaches the client as retry-after and as a body field', async () => {
    const handler = route(async () => {
      throw new HttpError(429, 'rate_limited', 'too many requests: try again in 42s', 42);
    });
    const res = await handler({
      request: new Request('https://paps.test/api/strike/v2/order'),
      env: {},
      params: {},
    });

    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBe('42');
    expect(await res.json()).toMatchObject({ error: 'rate_limited', retryAfterSeconds: 42 });
  });

  it('does not put retry-after on an error that has no cooldown', async () => {
    const handler = route(async () => {
      throw new HttpError(403, 'path_not_allowed');
    });
    const res = await handler({
      request: new Request('https://paps.test/api/strike/v2/withdraw'),
      env: {},
      params: {},
    });

    expect(res.status).toBe(403);
    expect(res.headers.get('retry-after')).toBeNull();
    expect(await res.json()).not.toHaveProperty('retryAfterSeconds');
  });
});
