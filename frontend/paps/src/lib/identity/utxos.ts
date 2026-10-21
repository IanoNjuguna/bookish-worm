import type { Identity } from './types';

/**
 * UTXOS (utxos.dev) wallet-as-a-service: social login → non-custodial Cardano wallet.
 *
 * This is the wiring point, deliberately not switched on. `@utxos/sdk` pulls in Mesh
 * and the Spark SDK, and its type graph took the typecheck from 9 seconds to over five
 * minutes; it also does nothing without a project id from the UTXOS dashboard. So the
 * dependency stays out of the bundle until there is something to authenticate against,
 * and until then the button says exactly what is missing instead of failing silently.
 *
 * To turn it on:
 *
 *   1. create a project at utxos.dev/dashboard, allowlist the app origin
 *   2. bun add @utxos/sdk
 *   3. set VITE_UTXOS_PROJECT_ID (and VITE_NETWORK_ID, 1 for mainnet)
 *   4. replace the throw below with:
 *
 *        const { Web3Wallet } = await import('@utxos/sdk');
 *        const wallet = await Web3Wallet.enable({ projectId: PROJECT_ID, networkId: NETWORK_ID });
 *        return {
 *          provider: 'utxos',
 *          address: await wallet.cardano.getChangeAddress(),
 *          wallet: 'utxos.dev',
 *        };
 *
 * The rest of the app already speaks `Identity`, so nothing else changes.
 */

const PROJECT_ID = import.meta.env.VITE_UTXOS_PROJECT_ID as string | undefined;
const NETWORK_ID = Number(import.meta.env.VITE_NETWORK_ID ?? 1);

export const utxosConfigured = Boolean(PROJECT_ID);

export async function connectUtxos(): Promise<Identity> {
  if (!PROJECT_ID) {
    throw new Error('UTXOS is not configured: set VITE_UTXOS_PROJECT_ID');
  }
  throw new Error(
    `UTXOS project found (network ${NETWORK_ID}) but @utxos/sdk is not bundled yet — see lib/identity/utxos.ts`,
  );
}
