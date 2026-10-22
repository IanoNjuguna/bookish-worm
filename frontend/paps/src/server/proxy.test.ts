import * as ed from '@noble/ed25519';
import { describe, expect, it } from 'vitest';
import { masterKey, sealKey, sha256Hex, toBase64, toHex } from './crypto';
import { memoryRateLimitStore, memoryStore } from './keystore';
import { isAllowedPath, proxyStrike } from './proxy';
import { DEFAULT_LIMITS, perMinute, type Limits } from './rateLimit';
import { canonicalMessage, publicKeyOf, verifyMessage } from './sign';
import { sessionHash } from './session';
import type { Store } from './types';

const MASTER_B64 = toBase64(new Uint8Array(32).fill(5));
const KEY_HEX = toHex(ed.utils.randomPrivateKey());
const NOW = 1_700_000_000_000;

/** A clock the test can move, so a bucket can be seen refilling. */
type Clock = { now: number };

async function account(store: Store, sessionToken: string, expiresAt = 0) {
  await store.putAccount(await sessionHash(sessionToken), {
    accountId: 'account-1',
    address: 'addr1_test',
    apiWalletId: '42',
    publicKeyHex: publicKeyOf(KEY_HEX),
    sealedKey: await sealKey(masterKey(MASTER_B64), Uint8Array.from(Buffer.from(KEY_HEX, 'hex'))),
    expiresAt,
  });
}

async function setup(opts: { expiresAt?: number; limits?: Limits; clock?: Clock } = {}) {
  const clock = opts.clock ?? { now: NOW };
  const store = memoryStore(() => clock.now);
  const sessionToken = 'session-token-abc';
  await account(store, sessionToken, opts.expiresAt);

  const calls: { url: string; init: RequestInit }[] = [];
  const doFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    return new Response(JSON.stringify({ positions: [], count: 0 }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;

  return {
    calls,
    clock,
    store,
    deps: {
      store,
      master: masterKey(MASTER_B64),
      strike: { origin: 'https://api.strikefinance.org', doFetch },
      limiter: memoryRateLimitStore(),
      limits: opts.limits ?? DEFAULT_LIMITS,
      now: () => clock.now,
    },
    sessionToken,
  };
}

describe('signing proxy', () => {
  it('lets only the routes paps actually uses through', () => {
    expect(isAllowedPath('/v2/positions?symbol=ADA-USD')).toBe(true);
    expect(isAllowedPath('/v2/order')).toBe(true);
    expect(isAllowedPath('/v2/order/strategy')).toBe(true);
    expect(isAllowedPath('/v2/history/funding')).toBe(true);
    // The deposit flow is signed like everything else, so the three calls must get through.
    expect(isAllowedPath('/v2/deposit')).toBe(true);
    expect(isAllowedPath('/v2/deposit/quote')).toBe(true);
    expect(isAllowedPath('/v2/deposit/build-tx')).toBe(true);
    expect(isAllowedPath('/v2/withdraw/limits')).toBe(false);
    expect(isAllowedPath('/v2/withdraw')).toBe(false);
    expect(isAllowedPath('/auth/builder/verify-signature')).toBe(false);
  });

  it('refuses a call with no session', async () => {
    const { deps } = await setup();
    await expect(
      proxyStrike(deps, { sessionToken: null, method: 'GET', path: '/v2/positions' }),
    ).rejects.toMatchObject({ status: 401, code: 'no_session' });
  });

  it('refuses a session id that is not in the store', async () => {
    const { deps } = await setup();
    await expect(
      proxyStrike(deps, { sessionToken: 'someone-elses', method: 'GET', path: '/v2/positions' }),
    ).rejects.toMatchObject({ status: 401, code: 'no_session' });
  });

  it('answers reconnect, not an upstream error, once the API wallet has expired', async () => {
    const { deps, calls } = await setup({ expiresAt: NOW - 1 });
    await expect(
      proxyStrike(deps, { sessionToken: 'session-token-abc', method: 'GET', path: '/v2/positions' }),
    ).rejects.toMatchObject({ status: 401, code: 'reconnect' });
    expect(calls).toHaveLength(0);
  });

  it('refuses a path outside the allowlist even with a valid session', async () => {
    const { deps } = await setup();
    await expect(
      proxyStrike(deps, {
        sessionToken: 'session-token-abc',
        method: 'POST',
        path: '/v2/withdraw',
        body: '{}',
      }),
    ).rejects.toMatchObject({ status: 403, code: 'path_not_allowed' });
  });

  it('signs the exact path and query, and returns the upstream answer verbatim', async () => {
    const { deps, calls, sessionToken } = await setup();
    const result = await proxyStrike(deps, {
      sessionToken,
      method: 'GET',
      path: '/v2/positions?symbol=ADA-USD',
    });

    expect(result.status).toBe(200);
    expect(result.body).toBe(JSON.stringify({ positions: [], count: 0 }));

    const [{ url, init }] = calls;
    expect(url).toBe('https://api.strikefinance.org/v2/positions?symbol=ADA-USD');
    const headers = init.headers as Record<string, string>;
    expect(Object.keys(headers).filter((h) => h.toLowerCase().startsWith('x-api-wallet'))).toHaveLength(4);

    const message = canonicalMessage({
      method: 'GET',
      path: '/v2/positions?symbol=ADA-USD',
      timestamp: headers['X-API-Wallet-Timestamp'],
      nonce: headers['X-API-Wallet-Nonce'],
      bodyHash: await sha256Hex(''),
    });
    expect(verifyMessage(message, headers['X-API-Wallet-Signature'], publicKeyOf(KEY_HEX))).toBe(true);
  });

  it('forwards a POST body unchanged and signs over it', async () => {
    const { deps, calls, sessionToken } = await setup();
    const body = '{"symbol":"ADA-USD","side":"buy","type":"market","size":"10"}';
    await proxyStrike(deps, { sessionToken, method: 'POST', path: '/v2/order', body });

    const [{ init }] = calls;
    expect(init.body).toBe(body);
    const headers = init.headers as Record<string, string>;
    const message = canonicalMessage({
      method: 'POST',
      path: '/v2/order',
      timestamp: headers['X-API-Wallet-Timestamp'],
      nonce: headers['X-API-Wallet-Nonce'],
      bodyHash: await sha256Hex(body),
    });
    expect(verifyMessage(message, headers['X-API-Wallet-Signature'], publicKeyOf(KEY_HEX))).toBe(true);
  });
});

describe('signing proxy rate limit', () => {
  const ORDER = { method: 'POST', path: '/v2/order', body: '{"symbol":"ADA-USD","size":"1"}' };

  it('answers 429 on call N+1 and the venue sees exactly N', async () => {
    const N = 3;
    const { deps, calls, sessionToken } = await setup({
      limits: { ...DEFAULT_LIMITS, write: perMinute(N) },
    });

    for (let i = 0; i < N; i += 1) {
      await proxyStrike(deps, { sessionToken, ...ORDER });
    }
    // The one over the line: refused at the door, not sent and then refused by Strike.
    await expect(proxyStrike(deps, { sessionToken, ...ORDER })).rejects.toMatchObject({
      status: 429,
      code: 'rate_limited',
    });

    expect(calls).toHaveLength(N);
    expect(calls.every((c) => c.url.endsWith('/v2/order'))).toBe(true);
  });

  it('states a cooldown instead of inviting a retry loop', async () => {
    const { deps, sessionToken } = await setup({
      limits: { ...DEFAULT_LIMITS, write: perMinute(1) },
    });
    await proxyStrike(deps, { sessionToken, ...ORDER });

    const refused = await proxyStrike(deps, { sessionToken, ...ORDER }).catch((e) => e);
    expect(refused.status).toBe(429);
    // One token at one a minute is 60s away, and the number must be usable as-is.
    expect(refused.retryAfterSeconds).toBe(60);
  });

  it('counts each session separately, so one cannot lock another out', async () => {
    const { deps, store, calls } = await setup({
      limits: { ...DEFAULT_LIMITS, write: perMinute(1) },
    });
    await account(store, 'other-session');

    await proxyStrike(deps, { sessionToken: 'session-token-abc', ...ORDER });
    await expect(
      proxyStrike(deps, { sessionToken: 'session-token-abc', ...ORDER }),
    ).rejects.toMatchObject({ status: 429 });

    // The abusive session is out; the second one is untouched.
    await expect(proxyStrike(deps, { sessionToken: 'other-session', ...ORDER })).resolves.toMatchObject(
      { status: 200 },
    );
    expect(calls).toHaveLength(2);
  });

  it('spends reads from a looser bucket than writes', async () => {
    const { deps, sessionToken } = await setup({
      limits: { write: perMinute(1), read: perMinute(3), connect: perMinute(1) },
    });

    await proxyStrike(deps, { sessionToken, method: 'GET', path: '/v2/positions' });
    await proxyStrike(deps, { sessionToken, ...ORDER });
    await expect(proxyStrike(deps, { sessionToken, ...ORDER })).rejects.toMatchObject({
      status: 429,
    });

    // A closed write bucket must not close the read one: the terminal has to keep showing
    // prices while a user waits out a cooldown.
    await expect(
      proxyStrike(deps, { sessionToken, method: 'GET', path: '/v2/positions' }),
    ).resolves.toMatchObject({ status: 200 });
    await expect(
      proxyStrike(deps, { sessionToken, method: 'GET', path: '/v2/openOrders' }),
    ).resolves.toMatchObject({ status: 200 });
  });

  it('refills with time rather than staying closed until the isolate restarts', async () => {
    const clock: Clock = { now: NOW };
    const { deps, sessionToken } = await setup({
      clock,
      limits: { ...DEFAULT_LIMITS, write: perMinute(2) },
    });

    await proxyStrike(deps, { sessionToken, ...ORDER });
    await proxyStrike(deps, { sessionToken, ...ORDER });
    await expect(proxyStrike(deps, { sessionToken, ...ORDER })).rejects.toMatchObject({
      status: 429,
    });

    // Two a minute is one every thirty seconds; half of that is not yet a token.
    clock.now = NOW + 29_000;
    await expect(proxyStrike(deps, { sessionToken, ...ORDER })).rejects.toMatchObject({
      status: 429,
    });

    clock.now = NOW + 31_000;
    await expect(proxyStrike(deps, { sessionToken, ...ORDER })).resolves.toMatchObject({
      status: 200,
    });
  });

  it('does not spend a token on a call it refuses for other reasons', async () => {
    const { deps, sessionToken } = await setup({
      limits: { ...DEFAULT_LIMITS, read: perMinute(1) },
    });

    await expect(
      proxyStrike(deps, { sessionToken, method: 'GET', path: '/v2/withdraw' }),
    ).rejects.toMatchObject({ status: 403 });

    // The 403 was refused before the bucket; the one read it was allowed still works.
    await expect(
      proxyStrike(deps, { sessionToken, method: 'GET', path: '/v2/positions' }),
    ).resolves.toMatchObject({ status: 200 });
  });
});
