import { describe, expect, it } from 'vitest';
import type { PagesContext } from './pages';
import { onRequestPost as buildHandler } from '../../functions/api/deposit/build-tx';
import { onRequestPost as confirmHandler } from '../../functions/api/deposit/confirm';
import { onRequestPost as quoteHandler } from '../../functions/api/deposit/quote';

/**
 * The handler half: a deposit call without a session cookie.
 *
 * `env` is deliberately empty in these tests. The 401 has to come from the cookie, not from
 * a missing store or master key — a deployment that forgot its own configuration must still
 * tell an anonymous caller "no session" rather than leak "not configured".
 */

const UTXOS = ['82825820aa11bb22cc33dd44ee55ff660011223344556677889900aabbccddeeff00112233445566'];

const invoke = (handler: (ctx: PagesContext) => Promise<Response>, path: string, body: unknown) =>
  handler({
    request: new Request(`https://paps.example${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
    env: {},
    params: {},
  });

describe('the deposit handlers', () => {
  it('all three refuse without a session cookie', async () => {
    const quoteRes = await invoke(quoteHandler, '/api/deposit/quote', { lovelace: '12500000' });
    expect(quoteRes.status).toBe(401);
    expect(await quoteRes.json()).toMatchObject({ error: 'no_session' });

    const buildRes = await invoke(buildHandler, '/api/deposit/build-tx', {
      requestId: 'req-1',
      userAddress: 'addr1_user',
      utxos: UTXOS,
    });
    expect(buildRes.status).toBe(401);
    expect(await buildRes.json()).toMatchObject({ error: 'no_session' });

    const confirmRes = await invoke(confirmHandler, '/api/deposit/confirm', {
      requestId: 'req-1',
      txHash: 'ab'.repeat(32),
    });
    expect(confirmRes.status).toBe(401);
    expect(await confirmRes.json()).toMatchObject({ error: 'no_session' });
  });

  it('keeps a session-scoped answer out of any cache', async () => {
    const res = await invoke(quoteHandler, '/api/deposit/quote', { lovelace: '12500000' });
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(res.headers.get('content-type')).toContain('application/json');
  });
});
