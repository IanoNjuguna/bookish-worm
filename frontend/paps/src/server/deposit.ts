import { signingKey, type ProxyDeps } from './proxy';
import { signedCall } from './strike';
import { HttpError } from './types';

/**
 * Getting ADA in.
 *
 * Three signed calls: quote the amount, have Strike build the transaction, then tell Strike
 * the transaction hash. Every one of them is signed with the key paps holds, which is what
 * makes this safe to expose — a deposit cannot be started, built or confirmed by something
 * that merely guesses a session id.
 *
 * The venue also builds the transaction and names the destination, so paps never picks an
 * address. The worst a tampered client can do is ask Strike for a different deposit than the
 * user typed; it cannot point the coins at itself.
 *
 * What this module deliberately does not do: sign the CBOR (the user's wallet does, in the
 * browser), submit the transaction (the wallet does), or poll for the credit. Credit is
 * observed on `/v2/account` and `/v2/history/transaction?type=1`, which the proxy already
 * covers.
 */

export type DepositDeps = ProxyDeps;

/**
 * ADA has six decimals and Strike wants lovelace as a string.
 *
 * Every conversion below is string and BigInt arithmetic. A double holds 53 bits, and
 * 9_007_199_254_740_993 lovelace is already past that, so `Number(ada) * 1e6` silently
 * drops lovelace off a large deposit. Rounding someone's balance is not a trade-off worth
 * making for the sake of typing a number.
 */
export const LOVELACE_PER_ADA = 1_000_000n;
const ADA_DECIMALS = 6;

const invalidAmount = (message: string): HttpError => new HttpError(400, 'invalid_amount', message);

/** `"12.5"` ADA → `"12500000"` lovelace. */
export function adaToLovelace(ada: string): string {
  const value = ada.trim();
  const parts = /^(\d+)(?:\.(\d+))?$/.exec(value);
  if (!parts) throw invalidAmount(`not an ADA amount: ${ada}`);

  const fraction = parts[2] ?? '';
  if (fraction.length > ADA_DECIMALS) {
    throw new HttpError(
      400,
      'amount_precision',
      `ADA has ${ADA_DECIMALS} decimals; ${ada} has ${fraction.length}`,
    );
  }

  const scaled = BigInt(parts[1]) * LOVELACE_PER_ADA + BigInt(fraction.padEnd(ADA_DECIMALS, '0'));
  return scaled.toString();
}

/** `"12500000"` lovelace → `"12.5"` ADA, with no trailing zeroes. */
export function lovelaceToAda(lovelace: string): string {
  const value = lovelace.trim();
  if (!/^\d+$/.test(value)) throw invalidAmount(`not a lovelace amount: ${lovelace}`);

  const total = BigInt(value);
  const whole = total / LOVELACE_PER_ADA;
  const fraction = (total % LOVELACE_PER_ADA).toString().padStart(ADA_DECIMALS, '0').replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

/** A deposit amount has to be a whole number of lovelace, and it has to be positive. */
function checkedLovelace(lovelace: string): string {
  const value = lovelace.trim();
  if (!/^\d+$/.test(value)) throw invalidAmount(`lovelace must be a whole number, got ${lovelace}`);
  if (BigInt(value) === 0n) throw invalidAmount('deposit amount must be positive');
  return value;
}

export type DepositQuote = {
  /** Names the quote for the build call. Strike owns it; paps only passes it back. */
  requestId: string;
  /** Strike's vault address. It is not a paps address and must never be substituted. */
  depositAddress: string;
  /** What was quoted for, as lovelace. */
  lovelace: string;
  /** USD at the quoted rate, as the venue reported it. Display value, not a settlement figure. */
  usdValue: number;
  /** Verbatim: what exactly this number means is still open with Strike, so do not compute with it. */
  exchangeRate: string;
  confirmationsRequired: number;
  /** Unix ms, or 0 when the venue did not say. */
  expiresAt: number;
  /** Strike's signature over the quote, passed along untouched. */
  signature: string;
};

export type BuiltDeposit = {
  /** Always `cardano_cbor`; anything else means the contract moved under us and we stop. */
  format: 'cardano_cbor';
  /** CBOR for the wallet to partial-sign, byte for byte as Strike sent it. */
  unsignedTx: string;
  /** Unix ms for the signed transaction's own validity, or 0 when unknown. */
  expiresAt: number;
};

export type DepositConfirmation = {
  requestId: string;
  txHash: string;
  /**
   * Strike answers `pending` here, always. This is not a credit: the balance moves when the
   * transaction settles, which is a separate observation on `/v2/account`.
   */
  status: string;
};

type Json = Record<string, unknown>;

/**
 * `expiration_at` has arrived as both an ISO string and a Unix timestamp in the shapes seen
 * so far. An unreadable one becomes 0 — "unknown" rather than "expired" — because the venue
 * still has the final say and will answer 400 if the quote is really dead.
 */
function parseInstant(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw > 1e12 ? raw : raw * 1000;
  if (typeof raw !== 'string') return 0;

  const value = raw.trim();
  if (/^\d+$/.test(value)) {
    const seconds = Number(value);
    return Number.isFinite(seconds) ? (seconds > 1e12 ? seconds : seconds * 1000) : 0;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

const num = (raw: unknown, fallback = 0): number => {
  const parsed = typeof raw === 'string' ? Number(raw) : raw;
  return typeof parsed === 'number' && Number.isFinite(parsed) ? parsed : fallback;
};

const str = (raw: unknown): string => (typeof raw === 'string' ? raw : '');

/**
 * One signed POST, through the same transport as the proxy. The body is serialised once and
 * reused, because the signature covers the exact bytes sent — re-serialising with a
 * different key order produces a valid-looking call the venue rejects.
 */
async function post(
  deps: DepositDeps,
  sessionToken: string | null,
  path: string,
  body: Json,
): Promise<{ status: number; ok: boolean; body: Json }> {
  const privateKeyHex = await signingKey(deps, sessionToken);
  const res = await signedCall(deps.strike, {
    privateKeyHex,
    method: 'POST',
    path,
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => '');
  let parsed: Json = {};
  try {
    const value = JSON.parse(text) as unknown;
    if (value && typeof value === 'object') parsed = value as Json;
  } catch {
    // A non-JSON error page still becomes a typed error below; the status carries the meaning.
  }
  return { status: res.status, ok: res.ok, body: parsed };
}

const messageOf = (body: Json): string =>
  str(body.error) || str(body.message) || str(body.detail);

/**
 * The venue's deposit failures, as states rather than crashes.
 *
 * 403 means the request_id belongs to another account, 409 means Strike already has this
 * transaction, and both are things a UI answers rather than crashes on. 400 does not mean
 * one thing, which is why `stage` is required: a fresh quote cannot have expired, so a 400
 * from quote is a refused amount (a deposit below the venue's minimum is exactly this). At
 * build and confirm the quote exists and may have died at the venue even though our own
 * check passed, so 400 keeps its expiry meaning there.
 */
function venueError(status: number, body: Json, stage: 'quote' | 'build' | 'confirm'): HttpError {
  const message = messageOf(body) || `deposit failed (${status})`;
  if (status === 400) {
    return stage === 'quote'
      ? new HttpError(400, 'amount_rejected', message)
      : new HttpError(400, 'quote_expired', message);
  }
  if (status === 401) return new HttpError(401, 'reconnect', message);
  if (status === 403) return new HttpError(403, 'account_mismatch', message);
  if (status === 409) return new HttpError(409, 'already_submitted', message);
  return new HttpError(502, 'deposit_failed', message);
}

const malformed = (what: string): HttpError => new HttpError(502, 'deposit_malformed', what);

/** Step one: what it costs, where to send it, and how long the answer stands for. */
export async function quoteDeposit(
  deps: DepositDeps,
  args: { sessionToken: string | null; lovelace: string },
): Promise<DepositQuote> {
  const lovelace = checkedLovelace(args.lovelace);
  const res = await post(deps, args.sessionToken, '/v2/deposit/quote', {
    blockchain: 'cardano',
    asset_symbol: 'ADA',
    asset_amount: lovelace,
  });
  if (!res.ok) throw venueError(res.status, res.body, 'quote');

  const quote = (res.body.quote ?? {}) as Json;
  const requestId = str(res.body.request_id);
  const depositAddress = str(res.body.deposit_address);
  if (!requestId || !depositAddress) throw malformed('quote without a request_id or address');

  const expiresAt = parseInstant(quote.expiration_at);
  const now = deps.now?.() ?? Date.now();
  // A quote that is already dead is worth nothing to the wallet: refuse it here, where the
  // answer is "re-quote", instead of at build, where it reads as a failure.
  if (expiresAt && expiresAt <= now) {
    throw new HttpError(400, 'quote_expired', 'the quote expired before it could be used');
  }

  return {
    requestId,
    depositAddress,
    lovelace,
    usdValue: num(quote.usd_value),
    exchangeRate: str(quote.exchange_rate),
    confirmationsRequired: num(res.body.confirmations_required, num(quote.confirmations)),
    expiresAt,
    signature: str(res.body.signature),
  };
}

/**
 * Step two: Strike builds the transaction, for the user's own address to spend from.
 *
 * `utxos` is required on Cardano and is CIP-30 hex as the wallet reported it — the array is
 * passed through untouched, because it is what Strike will select inputs from and a
 * reinterpreted UTxO produces a transaction that signs and then fails on chain.
 *
 * `quoteExpiresAt` is the quote's `expiresAt`. Given it, a dead quote is refused before the
 * venue is asked, which keeps an expired quote a re-quote rather than a 400 surfacing at the
 * last step of a flow the user has already committed to.
 */
export async function buildDepositTx(
  deps: DepositDeps,
  args: {
    sessionToken: string | null;
    requestId: string;
    userAddress: string;
    utxos: string[];
    quoteExpiresAt?: number;
  },
): Promise<BuiltDeposit> {
  const requestId = args.requestId?.trim();
  const userAddress = args.userAddress?.trim();
  if (!requestId) throw new HttpError(400, 'request_id_required');
  if (!userAddress) throw new HttpError(400, 'user_address_required');

  const now = deps.now?.() ?? Date.now();
  if (args.quoteExpiresAt && args.quoteExpiresAt <= now) {
    throw new HttpError(400, 'quote_expired', 'the quote expired before the transaction was built');
  }

  if (!Array.isArray(args.utxos) || args.utxos.length === 0) {
    throw new HttpError(400, 'utxos_required', 'a Cardano deposit needs the wallet UTxOs');
  }
  for (const utxo of args.utxos) {
    if (typeof utxo !== 'string' || !/^[0-9a-f]+$/i.test(utxo) || utxo.length % 2 !== 0) {
      throw new HttpError(400, 'utxos_invalid', 'UTxOs must be CIP-30 hex strings');
    }
  }

  const res = await post(deps, args.sessionToken, '/v2/deposit/build-tx', {
    request_id: requestId,
    user_address: userAddress,
    utxos: args.utxos,
  });
  if (!res.ok) throw venueError(res.status, res.body, 'build');

  const format = str(res.body.format);
  if (format !== 'cardano_cbor') throw malformed(`unexpected transaction format: ${format || 'none'}`);
  const unsignedTx = str(res.body.unsigned_tx);
  if (!unsignedTx) throw malformed('a cardano_cbor answer with no unsigned_tx');

  return {
    format: 'cardano_cbor',
    unsignedTx,
    expiresAt: parseInstant(res.body.expires_at),
  };
}

/**
 * Step three: tell Strike the signed transaction exists.
 *
 * Deliberately no expiry pre-check of its own. A transaction submitted a second before the
 * quote died and confirmed after it is legitimate, so the venue decides — and if it says the
 * quote is gone, that comes back as `quote_expired`, not as a failed deposit.
 */
export async function confirmDeposit(
  deps: DepositDeps,
  args: { sessionToken: string | null; requestId: string; txHash: string },
): Promise<DepositConfirmation> {
  const requestId = args.requestId?.trim();
  const txHash = args.txHash?.trim();
  if (!requestId) throw new HttpError(400, 'request_id_required');
  if (!txHash) throw new HttpError(400, 'tx_hash_required');

  const res = await post(deps, args.sessionToken, '/v2/deposit', {
    request_id: requestId,
    tx_hash: txHash,
  });
  if (!res.ok) throw venueError(res.status, res.body, 'confirm');

  return { requestId, txHash, status: str(res.body.status) || 'pending' };
}
