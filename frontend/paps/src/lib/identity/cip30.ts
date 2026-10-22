import type { Identity } from './types';

/**
 * CIP-30: the browser wallets that doba's other front ends already talk to.
 *
 * Discovery is `window.cardano`; enabling prompts the wallet once and returns the
 * handle we keep. Nothing here touches keys — the wallet signs, we only ask.
 */

type Cip30Wallet = {
  enable: () => Promise<{
    getChangeAddress: () => Promise<string>;
    getNetworkId: () => Promise<number>;
    /** CIP-8 message signing; payload is hex, result carries a COSE signature. */
    signData?: (
      address: string,
      payloadHex: string,
    ) => Promise<{ signature: string; key: string }>;
  }>;
  name?: string;
  icon?: string;
};

declare global {
  interface Window {
    cardano?: Record<string, Cip30Wallet & { name?: string }>;
  }
}

export type WalletOption = { id: string; name: string };

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
