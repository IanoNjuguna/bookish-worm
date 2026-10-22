import * as ed from '@noble/ed25519';
import { describe, expect, it } from 'vitest';
import {
  adaToLovelace,
  buildDepositTx,
  confirmDeposit,
  lovelaceToAda,
  quoteDeposit,
} from './deposit';
import { masterKey, sealKey, toBase64, toHex } from './crypto';
import { memoryRateLimitStore, memoryStore } from './keystore';
import { DEFAULT_LIMITS } from './rateLimit';
import { publicKeyOf } from './sign';
import { sessionHash } from './session';
import { HttpError } from './types';

const MASTER_B64 = toBase64(new Uint8Array(32).fill(7));
const KEY_HEX = toHex(ed.utils.randomPrivateKey());
const NOW = 1_700_000_000_000;
const SESSION = 'session-token-abc';
const VAULT = 'addr1_vault_strike';
const CBOR = '84a400818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700';
const UTXOS = ['82825820aa11bb22cc33dd44ee55ff660011223344556677889900aabbccddeeff00112233445566', '8282582099887766554433221100099887766554433221100998877665544332211009988776'];

type Endpoint = 'quote' | 'build' | 'confirm';
type Answer = { status: number; body: unknown };
type Call = { url: string; method: string; body: string | undefined; headers: Record<string, string> };

const defaults: Record<Endpoint, Answer> = {
  quote: {
    status: 200,
    body: {
      request_id: 'req-1',
      quote: {
        usd_value: '12.34',
        exchange_rate: '0.4123',
        confirmations: 15,
        expiration_at: new Date(NOW + 600_000).toISOString(),
      },
      deposit_address: VAULT,
      confirmations_required: 15,
      signature: 'quote-signature',
    },
  },
  build: {
    status: 200,
    body: { format: 'cardano_cbor', unsigned_tx: CBOR, expires_at: new Date(NOW + 300_000).toISOString() },
  },
  confirm: { status: 200, body: { status: 'pending' } },
};

/** The same quote with a chosen `expiration_at`, so the expiry cases differ in one field only. */
const quoteAnswer = (expirationAt: unknown): Answer => ({
  status: 200,
  body: {
    request_id: 'req-1',
    quote: {
      usd_value: '12.34',
      exchange_rate: '0.4123',
      confirmations: 15,
      expiration_at: expirationAt,
    },
    deposit_address: VAULT,
    confirmations_required: 15,
    signature: 'quote-signature',
  },
});

const endpointOf = (url: string): Endpoint | null => {
  if (url.endsWith('/v2/deposit/quote')) return 'quote';
  if (url.endsWith('/v2/deposit/build-tx')) return 'build';
  if (url.endsWith('/v2/deposit')) return 'confirm';
  return null;
};

/** A Strike that answers the three deposit endpoints and records exactly what it was sent. */
async function setup(over: Partial<Record<Endpoint, Answer>> = {}) {
  const store = memoryStore(() => NOW);
  await store.putAccount(await sessionHash(SESSION), {
    accountId: 'account-1',
    address: 'addr1_user',
    apiWalletId: '42',
    publicKeyHex: publicKeyOf(KEY_HEX),
    sealedKey: await sealKey(masterKey(MASTER_B64), Uint8Array.from(Buffer.from(KEY_HEX, 'hex'))),
    expiresAt: 0,
  });

  const calls: Call[] = [];
  const doFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({
      url,
      method: init?.method ?? 'GET',
      body: init?.body === undefined ? undefined : String(init.body),
      headers: (init?.headers ?? {}) as Record<string, string>,
    });
    const endpoint = endpointOf(url);
    const answer = (endpoint && over[endpoint]) || (endpoint && defaults[endpoint]);
    if (!answer) return new Response('{}', { status: 404 });
    return new Response(JSON.stringify(answer.body), {
      status: answer.status,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;

  return {
    calls,
    sessionToken: SESSION,
    deps: {
      store,
      master: masterKey(MASTER_B64),
      strike: { origin: 'https://api.strikefinance.org', doFetch },
      // The deposit endpoints sign through `signingKey`, which spends a rate-limit token
      // before it opens the key. A fresh bucket per test keeps that invisible here.
      limiter: memoryRateLimitStore(),
      limits: DEFAULT_LIMITS,
      now: () => NOW,
    },
  };
}

/** The error code a call failed with, or null if it did not fail. */
async function codeOf(fn: () => unknown): Promise<string | null> {
  try {
    await fn();
    return null;
  } catch (e) {
    expect(e).toBeInstanceOf(HttpError);
    return (e as HttpError).code;
  }
}

describe('ADA to lovelace, without a float in sight', () => {
  it('converts what a user types into the lovelace Strike is quoted in', () => {
    expect(adaToLovelace('12.5')).toBe('12500000');
    expect(adaToLovelace('1')).toBe('1000000');
    expect(adaToLovelace('0.000001')).toBe('1');
    expect(adaToLovelace(' 3.000000 ')).toBe('3000000');
    expect(adaToLovelace('0')).toBe('0');
  });

  it('keeps every lovelace of a large deposit, where multiply-by-a-million does not', () => {
    expect(adaToLovelace('90071992547.40993')).toBe('90071992547409930');

    // The same amount through a double loses ten lovelace. That is the bug this helper exists
    // to not have: at 2^53 a `Number` can no longer count individual lovelace.
    expect(String(Math.round(Number('90071992547.40993') * 1e6))).toBe('90071992547409920');
  });

  it('refuses amounts ADA cannot express instead of rounding them', async () => {
    expect(await codeOf(() => adaToLovelace('1.0000001'))).toBe('amount_precision');
    expect(await codeOf(() => adaToLovelace('1,5'))).toBe('invalid_amount');
    expect(await codeOf(() => adaToLovelace('1e6'))).toBe('invalid_amount');
    expect(await codeOf(() => adaToLovelace('-1'))).toBe('invalid_amount');
    expect(await codeOf(() => adaToLovelace(''))).toBe('invalid_amount');
  });

  it('reads lovelace back as ADA for display, trailing zeroes trimmed', () => {
    expect(lovelaceToAda('12500000')).toBe('12.5');
    expect(lovelaceToAda('1')).toBe('0.000001');
    expect(lovelaceToAda('0')).toBe('0');
    expect(lovelaceToAda('90071992547409930')).toBe('90071992547.40993');
    expect(lovelaceToAda(adaToLovelace('42.000001'))).toBe('42.000001');
  });
});

describe('deposit quote', () => {
  it('signs the quote call and sends Strike the lovelace as a string', async () => {
    const { deps, calls, sessionToken } = await setup();
    const quote = await quoteDeposit(deps, { sessionToken, lovelace: '12500000' });

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('https://api.strikefinance.org/v2/deposit/quote');
    expect(calls[0].method).toBe('POST');
    expect(calls[0].body).toBe(
      '{"blockchain":"cardano","asset_symbol":"ADA","asset_amount":"12500000"}',
    );
    // Signed by the held key, not merely posted: four wallet headers and nothing key-shaped.
    const signed = Object.keys(calls[0].headers).filter((h) => h.toLowerCase().startsWith('x-api-wallet'));
    expect(signed).toHaveLength(4);
    expect(JSON.stringify(quote)).not.toMatch(/private|sealed/i);

    expect(quote.requestId).toBe('req-1');
    expect(quote.depositAddress).toBe(VAULT);
    expect(quote.lovelace).toBe('12500000');
    expect(quote.usdValue).toBe(12.34);
    expect(quote.exchangeRate).toBe('0.4123');
    expect(quote.confirmationsRequired).toBe(15);
    expect(quote.expiresAt).toBe(NOW + 600_000);
    expect(quote.signature).toBe('quote-signature');
  });

  it('never hands the wallet a quote that has already died', async () => {
    const { deps, sessionToken } = await setup({
      quote: quoteAnswer(new Date(NOW - 1).toISOString()),
    });

    expect(await codeOf(() => quoteDeposit(deps, { sessionToken, lovelace: '1000000' }))).toBe(
      'quote_expired',
    );
  });

  it('reads a Unix-seconds expiry, and treats an unreadable one as unknown rather than dead', async () => {
    const inSeconds = await setup({
      quote: quoteAnswer(String((NOW + 600_000) / 1000)),
    });
    const quote = await quoteDeposit(inSeconds.deps, { sessionToken: inSeconds.sessionToken, lovelace: '1000000' });
    expect(quote.expiresAt).toBe(NOW + 600_000);

    const unreadable = await setup({ quote: quoteAnswer('soon') });
    const unknown = await quoteDeposit(unreadable.deps, { sessionToken: unreadable.sessionToken, lovelace: '1000000' });
    expect(unknown.expiresAt).toBe(0);
  });

  it('refuses a zero or fractional amount before the venue is asked', async () => {
    const { deps, calls, sessionToken } = await setup();
    expect(await codeOf(() => quoteDeposit(deps, { sessionToken, lovelace: '0' }))).toBe('invalid_amount');
    expect(await codeOf(() => quoteDeposit(deps, { sessionToken, lovelace: '12.5' }))).toBe('invalid_amount');
    expect(calls).toHaveLength(0);
  });

  it('reads a refused amount as a refused amount, not an expiry', async () => {
    const { deps, sessionToken } = await setup({
      quote: { status: 400, body: { message: 'minimum deposit is 2000000 lovelace' } },
    });

    await expect(quoteDeposit(deps, { sessionToken, lovelace: '1000000' })).rejects.toMatchObject({
      status: 400,
      code: 'amount_rejected',
      message: 'minimum deposit is 2000000 lovelace',
    });
  });

  it('keeps a 400 at build as an expired quote, because the quote can die at the venue', async () => {
    const { deps, sessionToken } = await setup({
      build: { status: 400, body: { message: 'quote expired' } },
    });

    await expect(
      buildDepositTx(deps, {
        sessionToken,
        requestId: 'req-1',
        userAddress: 'addr1_user',
        utxos: [UTXOS[0]],
      }),
    ).rejects.toMatchObject({ status: 400, code: 'quote_expired' });
  });

  it('answers reconnect, not a quote, once the API wallet can no longer sign', async () => {
    const store = memoryStore(() => NOW);
    await store.putAccount(await sessionHash(SESSION), {
      accountId: 'account-1',
      address: 'addr1_user',
      apiWalletId: '42',
      publicKeyHex: publicKeyOf(KEY_HEX),
      sealedKey: await sealKey(masterKey(MASTER_B64), Uint8Array.from(Buffer.from(KEY_HEX, 'hex'))),
      expiresAt: NOW - 1,
    });
    const { deps } = await setup();
    expect(
      await codeOf(() => quoteDeposit({ ...deps, store }, { sessionToken: SESSION, lovelace: '1000000' })),
    ).toBe('reconnect');
  });
});

describe('build the transaction', () => {
  it('sends the request id, the user address and the UTxOs exactly as the wallet reported them', async () => {
    const { deps, calls, sessionToken } = await setup();
    const built = await buildDepositTx(deps, {
      sessionToken,
      requestId: 'req-1',
      userAddress: 'addr1_user',
      utxos: UTXOS,
    });

    expect(calls[0].url).toBe('https://api.strikefinance.org/v2/deposit/build-tx');
    expect(calls[0].body).toBe(
      JSON.stringify({ request_id: 'req-1', user_address: 'addr1_user', utxos: UTXOS }),
    );
    expect(built.format).toBe('cardano_cbor');
    // Byte for byte: the wallet partial-signs this, so any "helpful" rewrite breaks the tx.
    expect(built.unsignedTx).toBe(CBOR);
    expect(built.expiresAt).toBe(NOW + 300_000);
  });

  it('refuses an expired quote before it asks Strike anything', async () => {
    const { deps, calls, sessionToken } = await setup();
    const code = await codeOf(() =>
      buildDepositTx(deps, {
        sessionToken,
        requestId: 'req-1',
        userAddress: 'addr1_user',
        utxos: UTXOS,
        quoteExpiresAt: NOW - 1,
      }),
    );

    expect(code).toBe('quote_expired');
    expect(calls).toHaveLength(0);
  });

  it('will not build a Cardano transaction without UTxOs', async () => {
    const { deps, calls, sessionToken } = await setup();
    expect(
      await codeOf(() =>
        buildDepositTx(deps, { sessionToken, requestId: 'req-1', userAddress: 'addr1_user', utxos: [] }),
      ),
    ).toBe('utxos_required');
    expect(
      await codeOf(() =>
        buildDepositTx(deps, {
          sessionToken,
          requestId: 'req-1',
          userAddress: 'addr1_user',
          utxos: ['not-hex!'],
        }),
      ),
    ).toBe('utxos_invalid');
    expect(calls).toHaveLength(0);
  });

  it('stops if Strike ever answers with a format this client cannot sign', async () => {
    const { deps, sessionToken } = await setup({
      build: { status: 200, body: { format: 'evm_raw', unsigned_tx: '0xdead', expires_at: null } },
    });
    const code = await codeOf(() =>
      buildDepositTx(deps, { sessionToken, requestId: 'req-1', userAddress: 'addr1_user', utxos: UTXOS }),
    );
    expect(code).toBe('deposit_malformed');
  });
});

describe('confirm the submission', () => {
  it('reports the request and hash, and pending means pending', async () => {
    const { deps, calls, sessionToken } = await setup();
    const confirmed = await confirmDeposit(deps, {
      sessionToken,
      requestId: 'req-1',
      txHash: 'ab'.repeat(32),
    });

    expect(calls[0].url).toBe('https://api.strikefinance.org/v2/deposit');
    expect(calls[0].body).toBe(JSON.stringify({ request_id: 'req-1', tx_hash: 'ab'.repeat(32) }));
    expect(confirmed).toEqual({ requestId: 'req-1', txHash: 'ab'.repeat(32), status: 'pending' });
  });

  it('turns the venue statuses into states a client can act on', async () => {
    const txHash = 'cd'.repeat(32);

    const already = await setup({ confirm: { status: 409, body: { error: 'already submitted' } } });
    expect(
      await codeOf(() => confirmDeposit(already.deps, { sessionToken: already.sessionToken, requestId: 'req-1', txHash })),
    ).toBe('already_submitted');

    const mismatch = await setup({ confirm: { status: 403, body: { error: 'account mismatch' } } });
    expect(
      await codeOf(() => confirmDeposit(mismatch.deps, { sessionToken: mismatch.sessionToken, requestId: 'req-1', txHash })),
    ).toBe('account_mismatch');

    const expired = await setup({ confirm: { status: 400, body: { error: 'expired quote' } } });
    expect(
      await codeOf(() => confirmDeposit(expired.deps, { sessionToken: expired.sessionToken, requestId: 'req-1', txHash })),
    ).toBe('quote_expired');

    // 409 is the one that must not read as a failure: the deposit already exists.
    expect(already.calls).toHaveLength(1);
  });
});
