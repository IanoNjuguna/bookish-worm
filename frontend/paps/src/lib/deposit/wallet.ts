/**
 * The wallet side of a deposit: the three CIP-30 calls that move coins.
 *
 * `signTx` and `submitTx` are the only two places in paps where a transaction leaves the
 * browser, and neither is optional. A wallet that cannot do both gets a stated reason, never a
 * fallback: there is nothing to fall back to.
 *
 * The address passed on to `build-tx` is the one the session connected with, not the wallet's
 * current change address. Strike relates a build to the account the quote belongs to, and a
 * wallet that rotates its change address would otherwise offer a second address that the venue
 * answers 403 `account_mismatch` for.
 */

import { cip30Wallet } from '../identity/cip30';
import type { Identity } from '../identity/types';

export type DepositWallet = {
  /** As the user knows it, for the copy: `Eternl`, not `eternl`. */
  name: string;
  /** The session's address. The only address a deposit may spend from. */
  address: string;
  /** `null` means locked, or pagination wanted. A state, not a failure. */
  getUtxos: () => Promise<string[] | null>;
  signTx: (cbor: string) => Promise<string>;
  submitTx: (cbor: string) => Promise<string>;
};

export type WalletProblem = 'wallet_missing' | 'wallet_unsupported';

export type OpenedWallet =
  | { ok: true; wallet: DepositWallet }
  | { ok: false; problem: WalletProblem };

/**
 * Why a deposit cannot start from this session, in the words the entry point shows, or null
 * when it can. Synchronous on purpose: this runs on render, and only `enable()` may prompt.
 */
export function depositBlocked(identity: Identity | null): string | null {
  if (!identity?.accountId) {
    return 'connect a wallet above and sign in to strike to deposit.';
  }
  if (identity.provider !== 'cip30') {
    // Reachable from localStorage: a session stored by the embedded wallet this app no
    // longer ships. There is no wallet in the browser to sign a cardano tx with, so the
    // only fix is a fresh sign-in through an extension.
    return 'this session came from a wallet this app no longer supports. reconnect with a browser extension to deposit.';
  }
  if (!cip30Wallet(identity.wallet)) {
    return `unlock ${identity.wallet} in this browser to deposit, then reload.`;
  }
  return null;
}

/** Prompt the wallet once and hand back the three calls the deposit uses. */
export async function openDepositWallet(identity: Identity): Promise<OpenedWallet> {
  const registered = cip30Wallet(identity.wallet);
  if (!registered) return { ok: false, problem: 'wallet_missing' };

  // A rejection here is the user closing the prompt; the caller reports it, this throws on.
  const api = await registered.enable();
  if (!api.getUtxos || !api.signTx || !api.submitTx) {
    return { ok: false, problem: 'wallet_unsupported' };
  }

  const { getUtxos, signTx, submitTx } = api;
  return {
    ok: true,
    wallet: {
      name: registered.name ?? identity.wallet,
      address: identity.address,
      getUtxos: () => getUtxos(),
      // The venue builds the transaction, so only this wallet's witnesses are ours to add.
      signTx: (cbor) => signTx(cbor, true),
      submitTx: (cbor) => submitTx(cbor),
    },
  };
}
