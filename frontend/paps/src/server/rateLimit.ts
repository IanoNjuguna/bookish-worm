import { HttpError, type RateLimitStore, type RateSpec, type ServerEnv } from './types';

/**
 * How fast a held signing key may be spent.
 *
 * The bucket itself lives in the store (`keystore.ts`), because a counter held in a Worker
 * isolate is not a limit: every isolate would start full and the fleet would admit
 * `capacity × isolates`. There is only policy in this file.
 *
 * Reads and writes get separate buckets per session. The terminal polls positions, orders
 * and history while the user has a ticket open, so a poll loop must never eat the
 * allowance for an order, and one session must never be able to spend another's.
 */

export type Limits = {
  /** Per session, for GET and HEAD through the proxy. */
  read: RateSpec;
  /** Per session, for anything that changes state: orders, leverage, margin mode. */
  write: RateSpec;
  /** Per client IP, for `/api/connect/*`: sign-in is the expensive, unauthenticated one. */
  connect: RateSpec;
};

/** A bucket holds one minute's allowance and refills over that minute. */
export const perMinute = (count: number): RateSpec => ({ capacity: count, perMs: 60_000 });

/**
 * Chosen so that a busy Pro layout (book, positions, orders, history on a two second poll)
 * stays inside the read bucket, while a script driving the key at venue-scary speed does
 * not. Ten signs-in a minute per IP is generous for a human and useless for a bot.
 */
export const DEFAULT_LIMITS: Limits = {
  read: perMinute(240),
  write: perMinute(30),
  connect: perMinute(10),
};

/**
 * A limit has to be a positive whole number of calls per minute. Anything else — absent,
 * zero, negative, a typo — falls back to the default rather than silently disabling the
 * control, because "the limit is off" is the failure nobody notices until the venue
 * notices for us.
 */
const perMinuteOr = (raw: string | undefined, fallback: RateSpec): RateSpec => {
  const count = Number(raw);
  return Number.isInteger(count) && count > 0 ? perMinute(count) : fallback;
};

export function limitsFrom(
  env: Pick<ServerEnv, 'RATE_READ_PER_MIN' | 'RATE_WRITE_PER_MIN' | 'RATE_CONNECT_PER_MIN'>,
): Limits {
  return {
    read: perMinuteOr(env.RATE_READ_PER_MIN, DEFAULT_LIMITS.read),
    write: perMinuteOr(env.RATE_WRITE_PER_MIN, DEFAULT_LIMITS.write),
    connect: perMinuteOr(env.RATE_CONNECT_PER_MIN, DEFAULT_LIMITS.connect),
  };
}

const clamp = (tokens: number, spec: RateSpec): number => Math.min(spec.capacity, Math.max(0, tokens));

/** Tokens available at `now`, given a bucket last written at `updatedAt`. */
export function refill(tokens: number, updatedAt: number, now: number, spec: RateSpec): number {
  // A clock that went backwards must not take tokens away; it just refills nothing.
  if (now <= updatedAt) return clamp(tokens, spec);
  return clamp(tokens + (now - updatedAt) * (spec.capacity / spec.perMs), spec);
}

/**
 * Seconds until one token is certain.
 *
 * One token is worth at most `perMs / capacity` ms of refill, and an empty bucket is never
 * more than one token short, so this holds without reading the row back — which keeps the
 * deny path to a single statement.
 */
export const retryAfterSeconds = (spec: RateSpec): number =>
  Math.max(1, Math.ceil(spec.perMs / Math.max(1, spec.capacity) / 1000));

/** Bucket keys. A session is addressed by the hash the store already holds, never the token. */
export const sessionBucket = (sessionHash: string, kind: 'read' | 'write'): string =>
  `sess:${sessionHash}:${kind}`;

export const ipBucket = (ip: string): string => `ip:${ip}`;

/** Everything that is not a read. Cancel and amend are writes, and so is anything new. */
export const isWrite = (method: string): boolean =>
  !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());

export type EnforceArgs = {
  store: RateLimitStore;
  key: string;
  spec: RateSpec;
  now: number;
};

/**
 * Spend one token, or refuse with a stated cooldown.
 *
 * Callers must throw this before the key is opened and before anything is sent upstream: a
 * limit checked after the call is not a limit on the call.
 */
export async function enforce(args: EnforceArgs): Promise<void> {
  if (await args.store.take(args.key, args.spec, args.now)) return;
  const wait = retryAfterSeconds(args.spec);
  throw new HttpError(429, 'rate_limited', `too many requests: try again in ${wait}s`, wait);
}
