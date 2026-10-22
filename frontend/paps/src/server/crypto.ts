/**
 * Sealing for the Strike API wallet private key.
 *
 * The key is stored as AES-GCM ciphertext under `MASTER_KEY`, so a dump of the key table
 * without the secret yields nothing usable. Every function here is deliberately
 * plaintext-free in its output: nothing returns a key it did not receive.
 */

const utf8 = new TextEncoder();

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export const toBase64 = (bytes: Uint8Array): string => {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : undefined;
    const c = i + 2 < bytes.length ? bytes[i + 2] : undefined;
    const triple = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);
    out += B64[(triple >> 18) & 63];
    out += B64[(triple >> 12) & 63];
    out += b === undefined ? '=' : B64[(triple >> 6) & 63];
    out += c === undefined ? '=' : B64[triple & 63];
  }
  return out;
};

export const fromBase64 = (value: string): Uint8Array => {
  const clean = value.replace(/=+$/, '');
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let buffer = 0;
  let bits = 0;
  let at = 0;
  for (const ch of clean) {
    const ix = B64.indexOf(ch);
    if (ix < 0) throw new Error('invalid base64');
    buffer = (buffer << 6) | ix;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[at++] = (buffer >> bits) & 0xff;
    }
  }
  return out.subarray(0, at);
};

export const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

export const fromHex = (hex: string): Uint8Array => {
  if (hex.length % 2 !== 0) throw new Error('invalid hex');
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
};

/** 32 random bytes as hex: used for session tokens and signing nonces. */
export const randomHex = (bytes: number): string =>
  toHex(globalThis.crypto.getRandomValues(new Uint8Array(bytes)));

/**
 * WebCrypto in this TypeScript lib only accepts ArrayBuffer-backed views, while our
 * decoders hand back views over ArrayBufferLike. Copy into a plain buffer at the boundary
 * rather than loosening the types of everything downstream.
 */
const bufferOf = (bytes: Uint8Array): ArrayBuffer =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

export async function sha256Hex(input: string | Uint8Array): Promise<string> {
  const data = typeof input === 'string' ? utf8.encode(input) : input;
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bufferOf(data));
  return toHex(new Uint8Array(digest));
}

/** A raw AES-GCM key, imported per request; Workers cannot keep a global handle. */
const aesKey = (master: Uint8Array): Promise<CryptoKey> =>
  globalThis.crypto.subtle.importKey('raw', bufferOf(master), 'AES-GCM', false, [
    'encrypt',
    'decrypt',
  ]);

/**
 * Parse `MASTER_KEY`. A short or malformed secret must fail loudly at the edge: falling
 * back to a default would silently encrypt every user's key with a known value.
 */
export function masterKey(secret: string | undefined): Uint8Array {
  if (!secret) throw new Error('MASTER_KEY is not set');
  const bytes = fromBase64(secret.trim());
  if (bytes.length !== 32) throw new Error('MASTER_KEY must be 32 bytes, base64 encoded');
  return bytes;
}

/** Sealed form is `iv(12) || ciphertext`, base64. */
export async function sealKey(master: Uint8Array, plaintext: Uint8Array): Promise<string> {
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const sealed = new Uint8Array(
    await globalThis.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      await aesKey(master),
      bufferOf(plaintext),
    ),
  );
  const joined = new Uint8Array(iv.length + sealed.length);
  joined.set(iv, 0);
  joined.set(sealed, iv.length);
  return toBase64(joined);
}

/** Throws when the record was tampered with or sealed under a different master key. */
export async function openKey(master: Uint8Array, sealed: string): Promise<Uint8Array> {
  const raw = fromBase64(sealed);
  if (raw.length <= 12) throw new Error('sealed key is truncated');
  const iv = raw.slice(0, 12);
  const ciphertext = raw.slice(12);
  const plain = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    await aesKey(master),
    bufferOf(ciphertext),
  );
  return new Uint8Array(plain);
}
