-- Sealed Strike API wallets. `sealed_key` is AES-GCM ciphertext under MASTER_KEY, so a
-- dump of this table without the secret cannot sign anything.
CREATE TABLE IF NOT EXISTS api_keys (
  session_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  address TEXT NOT NULL,
  api_wallet_id TEXT NOT NULL,
  public_key_hex TEXT NOT NULL,
  sealed_key TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

-- Connect attempts in flight: key sealed, wallet signature not yet exchanged. Deleted on
-- read, so a token replay finds nothing.
CREATE TABLE IF NOT EXISTS pending_challenges (
  token TEXT PRIMARY KEY,
  address TEXT NOT NULL,
  public_key_hex TEXT NOT NULL,
  sealed_key TEXT NOT NULL,
  nonce TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
