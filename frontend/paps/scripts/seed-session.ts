/**
 * Write one sealed session straight into the local D1 database.
 *
 * The signing proxy cannot be exercised through a booted Worker without a session, and a
 * real session needs a wallet signature that only Strike can verify. So the row is written
 * here, with the same sealing and hashing the server uses, and the throwaway Ed25519 key
 * inside it is deliberately one the venue has never seen: the point of the smoke test is
 * that the Worker signed and sent the call, not that Strike authorised it.
 *
 * Usage: MASTER_KEY=<base64> bun scripts/seed-session.ts <sql-file>
 * Prints the session token on stdout; writes the INSERT to <sql-file>.
 */
import * as ed from '@noble/ed25519';
import { masterKey, randomHex, sealKey, toHex } from '../src/server/crypto';
import { publicKeyOf } from '../src/server/sign';
import { sessionHash } from '../src/server/session';

const out = process.argv[2];
if (!out) {
  console.error('usage: seed-session.ts <sql-file>');
  process.exit(2);
}

const master = masterKey(process.env.MASTER_KEY);
const privateKey = ed.utils.randomPrivateKey();
const token = randomHex(32);
const sealed = await sealKey(master, privateKey);

// expiresAt 0 means "the venue did not tell us", which the proxy treats as unexpired, so
// the smoke test exercises the allowlist rather than the expiry guard.
const sql = `INSERT OR REPLACE INTO api_keys
  (session_hash, account_id, address, api_wallet_id, public_key_hex, sealed_key, expires_at)
  VALUES ('${await sessionHash(token)}', 'smoke-account', 'addr1qyqqzqsrqszsvpcgpy9qkrqdpc83qygjzv2p29shrqv35xcd6ka2g', 'smoke-api-wallet', '${publicKeyOf(toHex(privateKey))}', '${sealed}', 0);
`;

await Bun.write(out, sql);
console.log(token);
