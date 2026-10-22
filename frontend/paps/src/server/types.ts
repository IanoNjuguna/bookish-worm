/**
 * Shared shapes for the server layer that holds the Strike API wallet.
 *
 * The private key that can trade a user's account is the most dangerous object in this
 * app, so the type that carries it is deliberately narrow: a sealed string, never a
 * plaintext key, and nothing that a handler could accidentally serialise to a client.
 */

export type Env = 'mainnet' | 'testnet';

/** The subset of D1 this code uses, so tests can fake it without the Workers runtime. */
export type D1Like = {
  prepare(sql: string): {
    bind(...values: unknown[]): {
      first<T>(): Promise<T | null>;
      run(): Promise<unknown>;
    };
  };
};

export type ServerEnv = {
  /** Base64 of 32 bytes. AES-GCM master key for sealing API wallet private keys. */
  MASTER_KEY?: string;
  /** Production should set this to `mainnet`; it is not inferred from the client. */
  STRIKE_ENV?: string;
  BUILDER_CODE?: string;
  /**
   * The builder's cut in basis points, on top of Strike's own fee, which the user approves
   * in the connect consent message. 100 = the 1% paps charges.
   */
  FEE_SHARE_BPS?: string;
  DB?: D1Like;
};

/** One connected account. `sealedKey` is iv||ciphertext, base64. */
export type KeyRecord = {
  accountId: string;
  address: string;
  apiWalletId: string;
  publicKeyHex: string;
  sealedKey: string;
  /** Unix ms. 0 means the venue did not tell us, so treat it as unknown rather than expired. */
  expiresAt: number;
};

/** A connect attempt in flight: key sealed, wallet signature not yet exchanged. */
export type PendingChallenge = {
  nonce: string;
  address: string;
  publicKeyHex: string;
  sealedKey: string;
  expiresAt: number;
};

export type Store = {
  putPending(token: string, pending: PendingChallenge): Promise<void>;
  /** Single use: a second call for the same token returns null. */
  takePending(token: string): Promise<PendingChallenge | null>;
  putAccount(sessionHash: string, record: KeyRecord): Promise<void>;
  getAccount(sessionHash: string): Promise<KeyRecord | null>;
  deleteAccount(sessionHash: string): Promise<void>;
};

/** What Strike's verify-signature returns, narrowed to the fields paps uses. */
export type StrikeAccount = {
  account_id: string;
  api_wallet_id: string;
  api_wallet_public_key: string;
  api_wallet_expired_at?: string;
  builder_code?: string;
  fee_share_bps?: number;
};

/** An error that is safe to hand back to the client as JSON. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message?: string,
  ) {
    super(message ?? code);
  }
}
