import * as ed from '@noble/ed25519';
import { describe, expect, it } from 'vitest';
import { sha256Hex, toHex } from './crypto';
import { canonicalMessage, publicKeyOf, signMessage, signedHeaders, verifyMessage } from './sign';

const KEY = toHex(ed.utils.randomPrivateKey());

describe('API wallet signatures', () => {
  it('builds METHOD:PATH:TIMESTAMP:NONCE:BODYHASH exactly', () => {
    expect(
      canonicalMessage({
        method: 'post',
        path: '/v2/order',
        timestamp: '1700',
        nonce: 'abc',
        bodyHash: 'dead',
      }),
    ).toBe('POST:/v2/order:1700:abc:dead');
  });

  it('signs the body, so a different body is a different signature', async () => {
    const base = { privateKeyHex: KEY, method: 'POST', path: '/v2/order', now: 1700, nonce: 'n1' };
    const a = await signedHeaders({ ...base, body: '{"size":"1"}' });
    const b = await signedHeaders({ ...base, body: '{"size":"2"}' });
    expect(a['X-API-Wallet-Signature']).not.toBe(b['X-API-Wallet-Signature']);
  });

  it('emits a signature that verifies over the empty-body hash for a GET', async () => {
    const headers = await signedHeaders({
      privateKeyHex: KEY,
      method: 'GET',
      path: '/v2/positions?symbol=ADA-USD',
      now: 1700,
      nonce: 'n2',
    });
    const message = canonicalMessage({
      method: 'GET',
      path: '/v2/positions?symbol=ADA-USD',
      timestamp: headers['X-API-Wallet-Timestamp'],
      nonce: headers['X-API-Wallet-Nonce'],
      bodyHash: await sha256Hex(''),
    });
    expect(
      verifyMessage(message, headers['X-API-Wallet-Signature'], headers['X-API-Wallet-Public-Key']),
    ).toBe(true);
  });

  it('publishes the 64-hex key that verifies its own signatures', async () => {
    const headers = await signedHeaders({ privateKeyHex: KEY, method: 'GET', path: '/v2/account' });
    expect(headers['X-API-Wallet-Public-Key']).toBe(publicKeyOf(KEY));
    expect(headers['X-API-Wallet-Public-Key']).toMatch(/^[0-9a-f]{64}$/);
  });

  it('rejects a signature presented for another message', () => {
    const signature = signMessage('one', KEY);
    expect(verifyMessage('two', signature, publicKeyOf(KEY))).toBe(false);
  });
});
