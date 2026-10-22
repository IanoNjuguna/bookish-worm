import type { D1Like, KeyRecord, PendingChallenge, Store } from './types';

/**
 * Where sealed keys live.
 *
 * Two drivers: D1 for production and an in-memory one for tests and for a Worker with
 * no binding, which keeps the handlers testable without a database. Pending challenges
 * are single use, so `takePending` deletes as it reads.
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
