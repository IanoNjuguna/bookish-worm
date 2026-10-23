import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestBuild, requestConfirm, requestQuote } from './client';
import { DepositError } from './types';

/**
 * The wire contract, on this side of it.
 *
 * The handlers in `functions/api/deposit/` read four names from `build-tx` and two from the
 * others. A field named `quoteExpiresAt` where the server reads `quoteExpiresAt` is the sort of
 * thing that typechecks on both sides and silently sends `undefined`; these tests pin the exact
 * body and the exact path.
 */

type Call = { url: string; init: RequestInit };

const answer = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

function stub(response: Response): Call[] {
  const calls: Call[] = [];
  vi.stubGlobal('fetch', (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return Promise.resolve(response);
  });
  return calls;
}

const bodyOf = (call: Call): unknown => JSON.parse(String(call.init.body));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('the deposit client', () => {
  it('quotes with the lovelace as a string, and carries the session cookie', async () => {
    const calls = stub(answer({ requestId: 'req-1', depositAddress: 'addr1_vault' }));

    await requestQuote('12500000');

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('/api/deposit/quote');
    expect(calls[0].init.method).toBe('POST');
    // The cookie is Path=/api and HttpOnly; without this the Worker answers 401 no_session.
    expect(calls[0].init.credentials).toBe('same-origin');
    expect(bodyOf(calls[0])).toEqual({ lovelace: '12500000' });
  });

  it('builds with the four names the handler reads, and nothing else', async () => {
    const calls = stub(answer({ format: 'cardano_cbor', unsignedTx: '84a4', expiresAt: 0 }));

    await requestBuild({
      requestId: 'req-1',
      userAddress: 'addr1_user',
      utxos: ['82825820aa', '82825820bb'],
      quoteExpiresAt: 1_700_000_600_000,
    });

    expect(calls[0].url).toBe('/api/deposit/build-tx');
    expect(calls[0].init.credentials).toBe('same-origin');
    expect(bodyOf(calls[0])).toEqual({
      requestId: 'req-1',
      userAddress: 'addr1_user',
      // Byte for byte as the wallet reported them: no trimming, no re-encoding.
      utxos: ['82825820aa', '82825820bb'],
      quoteExpiresAt: 1_700_000_600_000,
    });
  });

  it('confirms with the request id and the hash the wallet returned', async () => {
    const calls = stub(answer({ requestId: 'req-1', txHash: 'ab', status: 'pending' }));

    await requestConfirm({ requestId: 'req-1', txHash: 'ab'.repeat(32) });

    expect(calls[0].url).toBe('/api/deposit/confirm');
    expect(calls[0].init.credentials).toBe('same-origin');
    expect(bodyOf(calls[0])).toEqual({ requestId: 'req-1', txHash: 'ab'.repeat(32) });
  });

  it('turns the server error body into a typed refusal, code and words intact', async () => {
    stub(answer({ error: 'account_mismatch', message: 'request_id belongs to another account' }, 403));

    await expect(
      requestBuild({ requestId: 'req-1', userAddress: 'addr1_user', utxos: ['aa'], quoteExpiresAt: 0 }),
    ).rejects.toMatchObject({
      name: 'DepositError',
      step: 'build',
      status: 403,
      code: 'account_mismatch',
      detail: 'request_id belongs to another account',
    });
  });

  it('keeps a body that is not json a status, not a crash', async () => {
    stub(new Response('<html>502</html>', { status: 502 }));

    const error = await requestQuote('1000000').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(DepositError);
    expect(error).toMatchObject({ step: 'quote', status: 502, code: 'http_error' });
  });

  it('reports a dead session as no_session, which the machine reads as reconnect', async () => {
    stub(answer({ error: 'no_session', message: 'no_session' }, 401));

    await expect(requestQuote('1000000')).rejects.toMatchObject({
      step: 'quote',
      status: 401,
      code: 'no_session',
    });
  });
});
