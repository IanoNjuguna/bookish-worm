import type { Identity } from './types';

/**
 * CIP-30: the browser wallets that doba's other front ends already talk to.
 *
 * Discovery is `window.cardano`; enabling prompts the wallet once and returns the
 * handle we keep. Nothing here touches keys — the wallet signs, we only ask.
 */

/**
 * What an enabled wallet can do, narrowed to what paps calls.
 *
 * `getUtxos` answers the wallet's own unspent outputs as hex, which is the only shape strike
 * will select deposit inputs from; `null` means the wallet is locked or wants pagination, and is
 * a state to report rather than an error to throw. `signTx` and `submitTx` are the two calls
 * that move coins, so they stay optional here and the deposit adapter refuses a wallet without
 * them instead of inventing a fallback.
 */
export type Cip30Api = {
  getChangeAddress: () => Promise<string>;
  getNetworkId: () => Promise<number>;
  /** CIP-8 message signing; payload is hex, result carries a COSE signature. */
  signData?: (
    address: string,
    payloadHex: string,
  ) => Promise<{ signature: string; key: string }>;
  getUtxos?: (amount?: string, paginate?: unknown) => Promise<string[] | null>;
  /** `partialSign` is set for a transaction the venue already built around other witnesses. */
  signTx?: (txCborHex: string, partialSign?: boolean) => Promise<string>;
  submitTx?: (txCborHex: string) => Promise<string>;
};

export type Cip30Wallet = {
  enable: () => Promise<Cip30Api>;
  name?: string;
  icon?: string;
};

declare global {
  interface Window {
    cardano?: Record<string, Cip30Wallet & { name?: string }>;
  }
}

export type WalletOption = { id: string; name: string };

/**
 * The registry entry for a wallet, by id and then by the name the user saw.
 *
 * `Identity.wallet` stores the display name (`Eternl`, `Lace`), not the registry key, so a
 * lookup by name is the normal case for a remembered session: a wallet that was present when
 * the session was made may register under any id (`eternl`, `eternlWallet`, …).
 */
export function cip30Wallet(wallet: string | undefined): Cip30Wallet | null {
  const api = typeof window === 'undefined' ? undefined : window.cardano;
  if (!api || !wallet) return null;
  const direct = api[wallet];
  if (direct) return direct;
  const byName = Object.values(api).find((w) => w?.name === wallet);
  return byName ?? null;
}

export function availableWallets(): WalletOption[] {
  const api = typeof window === 'undefined' ? undefined : window.cardano;
  if (!api) return [];
  return Object.entries(api)
    .filter(([, w]) => typeof w?.enable === 'function')
    .map(([id, w]) => ({ id, name: w.name ?? id }));
}

export async function connectCip30(walletId: string): Promise<Identity> {
  const api = window.cardano?.[walletId];
  if (!api) throw new Error(`${walletId} is not installed`);

  const handle = await api.enable();
  const [address, networkId] = await Promise.all([handle.getChangeAddress(), handle.getNetworkId()]);

  // Cardano mainnet is network id 1; anything else is a testnet and should be obvious.
  if (networkId !== 1 && !address.startsWith('addr_test')) {
    throw new Error('wallet is on mainnet but reported an unexpected network id');
  }

  return { provider: 'cip30', address, wallet: api.name ?? walletId };
}

/** Sign a message with the wallet (CIP-8). Returns the COSE signature as hex. */
export async function signMessage(walletId: string, address: string, message: string): Promise<string> {
  const api = window.cardano?.[walletId];
  if (!api) throw new Error(`${walletId} is not installed`);

  const handle = await api.enable();
  if (!handle.signData) throw new Error(`${api.name ?? walletId} cannot sign messages`);

  const payloadHex = Array.from(new TextEncoder().encode(message))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const { signature } = await handle.signData(address, payloadHex);
  return signature;
}
