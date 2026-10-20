/// <reference types="bun-types" />
import { beforeEach, describe, expect, test } from 'bun:test';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import { localJwks, verifyAccessJwt, type AccessConfig } from './access';

const TEAM = 'https://doba.cloudflareaccess.com';
const AUD = 'a'.repeat(64);

let privateKey: CryptoKey;
let jwks: ReturnType<typeof localJwks>;
const config: AccessConfig = { teamDomain: TEAM, audience: AUD };

async function issue(overrides: { aud?: string; iss?: string; exp?: number; email?: string } = {}) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ email: overrides.email ?? 'ian@doba.world' })
    .setProtectedHeader({ alg: 'RS256', kid: 'test-key' })
    .setIssuer(overrides.iss ?? TEAM)
    .setAudience(overrides.aud ?? AUD)
    .setIssuedAt(now)
    .setExpirationTime(overrides.exp ?? now + 600)
    .sign(privateKey);
}

beforeEach(async () => {
  if (!privateKey) {
    const pair = await generateKeyPair('RS256');
    privateKey = pair.privateKey;
    const jwk = await exportJWK(pair.publicKey);
    jwks = localJwks({ keys: [{ ...jwk, kid: 'test-key', alg: 'RS256', use: 'sig' }] });
  }
});

describe('verifyAccessJwt', () => {
  test('accepts a token Access would have issued', async () => {
    const result = await verifyAccessJwt(await issue(), config, jwks);
    expect(result).toEqual({ ok: true, email: 'ian@doba.world' });
  });

  test('rejects a missing header', async () => {
    const result = await verifyAccessJwt(null, config, jwks);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('missing-token');
  });

  test('rejects another application in the same team', async () => {
    const result = await verifyAccessJwt(await issue({ aud: 'b'.repeat(64) }), config, jwks);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('wrong-audience');
  });

  test('rejects a token from a different team', async () => {
    const result = await verifyAccessJwt(
      await issue({ iss: 'https://evil.cloudflareaccess.com' }),
      config,
      jwks,
    );
    expect(result.ok).toBe(false);
  });

  test('rejects an expired token', async () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    const result = await verifyAccessJwt(await issue({ exp: past }), config, jwks);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('expired');
  });

  test('rejects a token signed by a key that is not in the JWKS', async () => {
    const other = await generateKeyPair('RS256');
    const forged = await new SignJWT({ email: 'attacker@example.com' })
      .setProtectedHeader({ alg: 'RS256', kid: 'test-key' })
      .setIssuer(TEAM)
      .setAudience(AUD)
      .setExpirationTime(Math.floor(Date.now() / 1000) + 600)
      .sign(other.privateKey);

    const result = await verifyAccessJwt(forged, config, jwks);
    expect(result.ok).toBe(false);
  });
});
