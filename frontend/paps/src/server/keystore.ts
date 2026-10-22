import { refill } from './rateLimit';
import type { D1Like, KeyRecord, PendingChallenge, RateLimitStore, Store } from './types';

/**
 * Where sealed keys live, and where rate-limit counters live.
 *
 * Two drivers for each: D1 for production and an in-memory one for tests and for a Worker
 * with no binding, which keeps the handlers testable without a database. Pending
 * challenges are single use, so `takePending` deletes as it reads.
 */

export const CREATE_PENDING = `CREATE TABLE IF NOT EXISTS pending_challenges (
  token TEXT PRIMARY KEY,
  address TEXT NOT NULL,
  public_key_hex TEXT NOT NULL,
  sealed_key TEXT NOT NULL,
  nonce TEXT NOT NULL,
  expires_at INTEGER NOT NULL
)`;

export const CREATE_ACCOUNTS = `CREATE TABLE IF NOT EXISTS api_keys (
  session_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  address TEXT NOT NULL,
  api_wallet_id TEXT NOT NULL,
  public_key_hex TEXT NOT NULL,
  sealed_key TEXT NOT NULL,
  expires_at INTEGER NOT NULL
)`;

export function memoryStore(now: () => number = Date.now): Store {
  const pending = new Map<string, PendingChallenge>();
  const accounts = new Map<string, KeyRecord>();
  return {
    async putPending(token, value) {
      pending.set(token, value);
    },
    async takePending(token) {
      const found = pending.get(token) ?? null;
      pending.delete(token);
      if (!found) return null;
      if (found.expiresAt <= now()) return null;
      return found;
    },
    async putAccount(hash, record) {
      accounts.set(hash, record);
    },
    async getAccount(hash) {
      return accounts.get(hash) ?? null;
    },
    async deleteAccount(hash) {
      accounts.delete(hash);
    },
  };
}

type PendingRow = {
  address: string;
  public_key_hex: string;
  sealed_key: string;
  nonce: string;
  expires_at: number;
};

type AccountRow = {
  account_id: string;
  address: string;
  api_wallet_id: string;
  public_key_hex: string;
  sealed_key: string;
  expires_at: number;
};

export function d1Store(db: D1Like): Store {
  return {
    async putPending(token, value) {
      await db
        .prepare(
          'INSERT OR REPLACE INTO pending_challenges (token, address, public_key_hex, sealed_key, nonce, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
        )
        .bind(token, value.address, value.publicKeyHex, value.sealedKey, value.nonce, value.expiresAt)
        .run();
    },
    async takePending(token) {
      const row = await db
        .prepare('SELECT address, public_key_hex, sealed_key, nonce, expires_at FROM pending_challenges WHERE token = ?')
        .bind(token)
        .first<PendingRow>();
      if (!row) return null;
      await db.prepare('DELETE FROM pending_challenges WHERE token = ?').bind(token).run();
      return {
        address: row.address,
        publicKeyHex: row.public_key_hex,
        sealedKey: row.sealed_key,
        nonce: row.nonce,
        expiresAt: row.expires_at,
      };
    },
    async putAccount(hash, record) {
      await db
        .prepare(
          'INSERT OR REPLACE INTO api_keys (session_hash, account_id, address, api_wallet_id, public_key_hex, sealed_key, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        )
        .bind(
          hash,
          record.accountId,
          record.address,
          record.apiWalletId,
          record.publicKeyHex,
          record.sealedKey,
          record.expiresAt,
        )
        .run();
    },
    async getAccount(hash) {
      const row = await db
        .prepare(
          'SELECT account_id, address, api_wallet_id, public_key_hex, sealed_key, expires_at FROM api_keys WHERE session_hash = ?',
        )
        .bind(hash)
        .first<AccountRow>();
      if (!row) return null;
      return {
        accountId: row.account_id,
        address: row.address,
        apiWalletId: row.api_wallet_id,
        publicKeyHex: row.public_key_hex,
        sealedKey: row.sealed_key,
        expiresAt: row.expires_at,
      };
    },
    async deleteAccount(hash) {
      await db.prepare('DELETE FROM api_keys WHERE session_hash = ?').bind(hash).run();
    },
  };
}

export const CREATE_RATE_LIMITS = `CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  bucket TEXT PRIMARY KEY,
  tokens REAL NOT NULL,
  updated_at INTEGER NOT NULL
)`;

type Bucket = { tokens: number; updatedAt: number };

/**
 * Counters for one process, using the same refill maths as the D1 driver below.
 *
 * Correct for tests and for a Worker with no binding, and useless as a limit in
 * production: every isolate would start full, and a restart would hand back a full
 * allowance. `d1RateLimitStore` is the one that counts when it matters.
 */
export function memoryRateLimitStore(): RateLimitStore {
  const buckets = new Map<string, Bucket>();
  return {
    async take(key, spec, now) {
      const held = buckets.get(key);
      const tokens = held ? refill(held.tokens, held.updatedAt, now, spec) : spec.capacity;
      if (tokens < 1) return false;
      buckets.set(key, { tokens: tokens - 1, updatedAt: now });
      return true;
    },
  };
}

/**
 * Refill and spend as one statement, so two isolates cannot both take the last token.
 *
 * SQLite refills from the row's own `updated_at` inside the update, and the `WHERE` on the
 * conflict target means an empty bucket writes nothing at all: the upsert reports zero
 * changed rows and the caller answers 429. `?4` is tokens per millisecond, and
 * `MAX(0, now - updated_at)` matches `refill()`, where a clock that went backwards must
 * not take tokens away.
 */
const TAKE_TOKEN = `INSERT INTO rate_limit_buckets (bucket, tokens, updated_at)
VALUES (?1, ?2 - 1, ?3)
ON CONFLICT(bucket) DO UPDATE SET
  tokens = MIN(?2, MAX(0.0, rate_limit_buckets.tokens + MAX(0, ?3 - rate_limit_buckets.updated_at) * ?4)) - 1,
  updated_at = ?3
WHERE MIN(?2, MAX(0.0, rate_limit_buckets.tokens + MAX(0, ?3 - rate_limit_buckets.updated_at) * ?4)) >= 1`;

/** Counters in D1: the row is the only state, so an isolate restart cannot reset a limit. */
export function d1RateLimitStore(db: D1Like): RateLimitStore {
  return {
    async take(key, spec, now) {
      const result = await db
        .prepare(TAKE_TOKEN)
        .bind(key, spec.capacity, now, spec.capacity / spec.perMs)
        .run();
      return result.meta.changes > 0;
    },
  };
}
