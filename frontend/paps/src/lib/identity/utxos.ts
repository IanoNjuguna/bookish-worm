import type { Identity } from './types';

/**
 * UTXOS (utxos.dev) wallet-as-a-service: social login → an embedded, non-custodial
 * Cardano wallet, with no browser extension.
 *
 * This is the one that makes paps usable on a phone: mobile browsers have no CIP-30
 * extensions, so "Continue with Google" is the difference between a working sign-in and
 * a dead end. The wallet is Mesh under the hood, which is why `cardano.signData` takes
 * the same shape as a CIP-30 wallet and the Strike builder flow does not care which one
 * produced the signature.
 *
 * The SDK is heavy (Mesh, Spark) and it costs the typecheck real time; it is imported
 * dynamically so the bundle only pays for it when someone actually signs in.
 */

const PROJECT_ID = import.meta.env.VITE_UTXOS_PROJECT_ID as string | undefined;
const NETWORK_ID = Number(import.meta.env.VITE_NETWORK_ID ?? 1) === 0 ? 0 : 1;

export const utxosConfigured = Boolean(PROJECT_ID);

export type UtxosWallet = {
  address: string;
  signData: (message: string) => Promise<string>;
};

/** Opens the UTXOS window and returns a wallet handle. */
export async function openUtxos(): Promise<UtxosWallet> {
  // Import first, validate second, and that order is load-bearing: with the check in
  // front, a build without the env var makes the condition statically false, Rollup
  // dead-code-eliminates the import, and the SDK silently disappears from the bundle —
  // a failure that only shows up when someone taps the button in production.
  const { Web3Wallet } = await import('@utxos/sdk');

  if (!PROJECT_ID) throw new Error('UTXOS is not configured: set VITE_UTXOS_PROJECT_ID');
  const wallet = await Web3Wallet.enable({ projectId: PROJECT_ID, networkId: NETWORK_ID });
  const address = await wallet.cardano.getChangeAddress();

  return {
    address,
    signData: async (message: string) => {
      const hex = Array.from(new TextEncoder().encode(message))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const { signature } = await wallet.cardano.signData(address, hex);
      return signature;
    },
  };
}

/** Identity from the UTXOS wallet alone, without the Strike account step. */
export async function connectUtxos(): Promise<Identity> {
  const wallet = await openUtxos();
  return { provider: 'utxos', address: wallet.address, wallet: 'utxos.dev' };
}
