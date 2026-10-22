import { describe, expect, it } from 'vitest';
import {
  fromBase64,
  fromHex,
  masterKey,
  openKey,
  randomHex,
  sealKey,
  sha256Hex,
  toBase64,
  toHex,
} from './crypto';

const MASTER = masterKey(toBase64(new Uint8Array(32).fill(7)));
const OTHER = masterKey(toBase64(new Uint8Array(32).fill(9)));

describe('sealing the API wallet key', () => {
  it('round-trips a private key byte for byte', async () => {
    const key = fromHex(randomHex(32));
    expect(toHex(await openKey(MASTER, await sealKey(MASTER, key)))).toBe(toHex(key));
  });

  it('produces different ciphertext every time, so two equal keys are two records', async () => {
    const key = fromHex(randomHex(32));
    expect(await sealKey(MASTER, key)).not.toBe(await sealKey(MASTER, key));
  });

  it('rejects a tampered record', async () => {
    const sealed = fromBase64(await sealKey(MASTER, fromHex(randomHex(32))));
    sealed[sealed.length - 1] ^= 0xff;
    await expect(openKey(MASTER, toBase64(sealed))).rejects.toThrow();
  });

  it('rejects a record sealed under a different master key', async () => {
    const sealed = await sealKey(OTHER, fromHex(randomHex(32)));
    await expect(openKey(MASTER, sealed)).rejects.toThrow();
  });

  it('refuses a master key that is missing or the wrong length', () => {
    expect(() => masterKey(undefined)).toThrow(/not set/);
    expect(() => masterKey(toBase64(new Uint8Array(16)))).toThrow(/32 bytes/);
  });

  it('round-trips base64 and hex', () => {
    const bytes = fromHex(randomHex(48));
    expect(toHex(fromBase64(toBase64(bytes)))).toBe(toHex(bytes));
  });

  it('hashes an empty body to the digest the venue expects for GETs', async () => {
    expect(await sha256Hex('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});
