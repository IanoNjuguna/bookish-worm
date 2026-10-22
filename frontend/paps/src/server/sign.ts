import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import { fromHex, randomHex, sha256Hex, toHex } from './crypto';

/**
 * Strike's API wallet signature: `METHOD:PATH:TIMESTAMP:NONCE:SHA256(body)`.
 *
 * The body hash is the digest of the exact JSON bytes sent, so the body must be
 * serialised once and reused for both the signature and the request. Re-serialising
 * with different key order produces a valid-looking call that the venue rejects.
 */

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export type SignedHeaders = {
  'X-API-Wallet-Public-Key': string;
  'X-API-Wallet-Signature': string;
  'X-API-Wallet-Timestamp': string;
  'X-API-Wallet-Nonce': string;
};

export const canonicalMessage = (args: {
  method: string;
  path: string;
  timestamp: string;
  nonce: string;
  bodyHash: string;
}): string => `${args.method.toUpperCase()}:${args.path}:${args.timestamp}:${args.nonce}:${args.bodyHash}`;

export const publicKeyOf = (privateKeyHex: string): string =>
  toHex(ed.getPublicKey(fromHex(privateKeyHex)));

/** Deterministic for a given message, which is what makes it testable. */
export const signMessage = (message: string, privateKeyHex: string): string =>
  toHex(ed.sign(new TextEncoder().encode(message), fromHex(privateKeyHex)));

export const verifyMessage = (message: string, signatureHex: string, publicKeyHex: string): boolean => {
  try {
    return ed.verify(fromHex(signatureHex), new TextEncoder().encode(message), fromHex(publicKeyHex));
  } catch {
    return false;
  }
};

export async function signedHeaders(args: {
  privateKeyHex: string;
  method: string;
  path: string;
  body?: string;
  now?: number;
  nonce?: string;
}): Promise<SignedHeaders> {
  const timestamp = String(args.now ?? Date.now());
  const nonce = args.nonce ?? randomHex(16);
  const bodyHash = await sha256Hex(args.body ?? '');
  const message = canonicalMessage({
    method: args.method,
    path: args.path,
    timestamp,
    nonce,
    bodyHash,
  });
  return {
    'X-API-Wallet-Public-Key': publicKeyOf(args.privateKeyHex),
    'X-API-Wallet-Signature': signMessage(message, args.privateKeyHex),
    'X-API-Wallet-Timestamp': timestamp,
    'X-API-Wallet-Nonce': nonce,
  };
}
