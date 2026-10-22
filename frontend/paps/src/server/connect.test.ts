import { describe, expect, it } from 'vitest';
import { finishConnect, startConnect, type ConnectDeps } from './connect';
import { masterKey, openKey, toBase64, toHex } from './crypto';
import { memoryRateLimitStore, memoryStore } from './keystore';
import { DEFAULT_LIMITS, perMinute } from './rateLimit';
import { publicKeyOf } from './sign';
import { sessionHash } from './session';
import { HttpError } from './types';

const MASTER_B64 = toBase64(new Uint8Array(32).fill(3));
const NOW = 1_700_000_000_000;

type Call = { url: string; body: Record<string, unknown> | null };

/** A Strike that answers the two builder endpoints and records what it was asked. */
function strikeStub(opts: { publicKey?: () => string; expiredAt?: string; fail?: number } = {}) {
  const calls: Call[] = [];
  const doFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const body = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : null;
    calls.push({ url, body });
    if (opts.fail) return new Response(JSON.stringify({ error: 'nope' }), { status: opts.fail });
    if (url.endsWith('/auth/builder/request-signature')) {
      return new Response(
        JSON.stringify({
          nonce: 'nonce-1',
          message_to_sign: 'Connect to Strike via builder "paps".',
        }),
        { status: 200 },
      );
    }
    if (url.endsWith('/auth/builder/verify-signature')) {
      return new Response(
        JSON.stringify({
          account_id: 'account-1',
          api_wallet_id: 42,
          api_wallet_public_key: opts.publicKey ? opts.publicKey() : body?.public_key,
          api_wallet_expired_at: opts.expiredAt,
          fee_share_bps: 0,
        }),
        { status: 200 },
      );
    }
    return new Response('{}', { status: 404 });
  }) as unknown as typeof fetch;
  return { calls, transport: { origin: 'https://api.strikefinance.org', doFetch } };
}

const deps = (over: Partial<ConnectDeps> = {}): ConnectDeps => ({
  store: memoryStore(() => NOW),
  limiter: memoryRateLimitStore(),
  limits: DEFAULT_LIMITS,
  master: masterKey(MASTER_B64),
  strike: strikeStub().transport,
  builderCode: 'paps',
  feeShareBps: 0,
  now: () => NOW,
  ...over,
});

describe('builder connect, key held by paps', () => {
  it('asks Strike for a challenge with the sealed key pair and returns no key material', async () => {
    const stub = strikeStub();
    const d = deps({ strike: stub.transport });
    const started = await startConnect(d, { address: 'addr1_test' });

    expect(stub.calls[0].url).toBe('https://api.strikefinance.org/auth/builder/request-signature');
    expect(stub.calls[0].body).toMatchObject({ chain: 'cardano', code: 'paps', fee_share_bps: 0 });
    expect(started.message_to_sign).toContain('paps');
    expect(JSON.stringify(started)).not.toMatch(/private|seed/i);

    const pending = await d.store.takePending(started.token);
    expect(pending).not.toBeNull();
    // The handle alone must not be enough to recover the key.
    expect(pending?.sealedKey).not.toContain(started.publicKeyHex);
    const sealedKey = toHex(await openKey(d.master, pending!.sealedKey));
    expect(publicKeyOf(sealedKey)).toBe(started.publicKeyHex);
  });

  it('exchanges the wallet signature for a session and stores the key under its hash', async () => {
    const d = deps();
    const started = await startConnect(d, { address: 'addr1_test' });
    const account = await finishConnect(d, { token: started.token, walletSignature: 'cose-sig' });

    expect(account.accountId).toBe('account-1');
    expect(account.apiWalletId).toBe('42');
    expect(account.publicKeyHex).toBe(started.publicKeyHex);

    // Stored under the hash, so the table never holds a usable credential itself.
    expect(await d.store.getAccount(account.sessionToken)).toBeNull();
    const record = await d.store.getAccount(await sessionHash(account.sessionToken));
    expect(record?.accountId).toBe('account-1');
    expect(publicKeyOf(toHex(await openKey(d.master, record!.sealedKey)))).toBe(started.publicKeyHex);
  });

  it('refuses a replayed challenge handle', async () => {
    const d = deps();
    const started = await startConnect(d, { address: 'addr1_test' });
    await finishConnect(d, { token: started.token, walletSignature: 'cose-sig' });
    await expect(
      finishConnect(d, { token: started.token, walletSignature: 'cose-sig' }),
    ).rejects.toBeInstanceOf(HttpError);
  });

  it('refuses a challenge that has expired', async () => {
    let clock = NOW;
    const store = memoryStore(() => clock);
    const d = deps({ store, now: () => clock });
    const started = await startConnect(d, { address: 'addr1_test' });
    clock = NOW + 6 * 60_000;
    await expect(
      finishConnect(d, { token: started.token, walletSignature: 'cose-sig' }),
    ).rejects.toMatchObject({ code: 'challenge_expired' });
  });

  it('refuses an account whose bound key is not the key we sealed', async () => {
    const stub = strikeStub({ publicKey: () => 'f'.repeat(64) });
    const d = deps({ strike: stub.transport });
    const started = await startConnect(d, { address: 'addr1_test' });
    await expect(
      finishConnect(d, { token: started.token, walletSignature: 'cose-sig' }),
    ).rejects.toMatchObject({ code: 'key_mismatch' });
  });

  it('keeps the venue expiry when it is given, and 0 when it is not', async () => {
    const dated = deps({ strike: strikeStub({ expiredAt: '2030-01-01T00:00:00Z' }).transport });
    const started = await startConnect(dated, { address: 'a' });
    const withExpiry = await finishConnect(dated, { token: started.token, walletSignature: 'sig' });
    expect(withExpiry.expiresAt).toBe(Date.parse('2030-01-01T00:00:00Z'));

    const undated = deps();
    const second = await startConnect(undated, { address: 'a' });
    const noExpiry = await finishConnect(undated, { token: second.token, walletSignature: 'sig' });
    expect(noExpiry.expiresAt).toBe(0);
  });

  it('surfaces a Strike rejection instead of inventing an account', async () => {
    const d = deps({ strike: strikeStub({ fail: 404 }).transport });
    await expect(startConnect(d, { address: 'addr1_test' })).rejects.toMatchObject({
      code: 'challenge_failed',
    });
  });
});

describe('sign-in is counted per client IP', () => {
  it('stops one address hammering builder connect, and leaves another alone', async () => {
    const stub = strikeStub();
    const d = deps({
      strike: stub.transport,
      limits: { ...DEFAULT_LIMITS, connect: perMinute(2) },
    });

    await startConnect(d, { address: 'addr1_test', ip: '203.0.113.9' });
    await startConnect(d, { address: 'addr1_test', ip: '203.0.113.9' });

    // The third attempt must not reach Strike: that is the request that would cost the
    // builder code a challenge, and the one a bot makes a thousand times.
    await expect(
      startConnect(d, { address: 'addr1_test', ip: '203.0.113.9' }),
    ).rejects.toMatchObject({ status: 429, code: 'rate_limited' });
    expect(stub.calls).toHaveLength(2);

    // Another address is unaffected: one abusive client cannot deny sign-in to everyone.
    await expect(startConnect(d, { address: 'addr1_test', ip: '198.51.100.4' })).resolves.toMatchObject(
      { expiresInMs: 5 * 60_000 },
    );
  });

  it('counts the finish step against the same address, so a start and a finish cannot loop', async () => {
    const stub = strikeStub();
    const d = deps({
      strike: stub.transport,
      limits: { ...DEFAULT_LIMITS, connect: perMinute(2) },
    });

    const started = await startConnect(d, { address: 'addr1_test', ip: '203.0.113.9' });
    await expect(
      finishConnect(d, { token: started.token, walletSignature: 'sig', ip: '203.0.113.9' }),
    ).resolves.toMatchObject({ accountId: 'account-1' });

    // Start and finish together have spent the two the address was given.
    await expect(
      startConnect(d, { address: 'addr1_test', ip: '203.0.113.9' }),
    ).rejects.toMatchObject({ status: 429 });
  });
});
