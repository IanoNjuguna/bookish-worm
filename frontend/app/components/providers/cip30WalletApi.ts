import type { Cip30WalletApi, MeshWalletLike } from "./types";

// Wraps a MeshWallet in a CIP-30 compatible interface for Lucid & Backend Auth.
export function buildCip30WalletApi(meshWallet: MeshWalletLike): Cip30WalletApi {
	return {
		getNetworkId: async () => 1,
		getUtxos: async () => {
			try {
				const utxos = await meshWallet.getUtxos();
				return (utxos || []).map((u: any) =>
					typeof u === "string" ? u : u?.toCbor ? u.toCbor().toString() : u
				);
			} catch {
				return [];
			}
		},
		getBalance: async () => {
			try {
				return await meshWallet.getLovelace();
			} catch {
				return "0";
			}
		},
		getUsedAddresses: async () => {
			try {
				return await meshWallet.getUsedAddresses();
			} catch {
				return [];
			}
		},
		getUnusedAddresses: async () => {
			try {
				return await meshWallet.getUnusedAddresses();
			} catch {
				return [];
			}
		},
		getChangeAddress: async () => {
			return await meshWallet.getChangeAddress();
		},
		getRewardAddresses: async () => {
			try {
				const rewards = await meshWallet.getRewardAddresses();
				return rewards || [];
			} catch {
				return [];
			}
		},
		getCollateral: async () => [],
		signData: async (address: string, payload: string) => {
			// MeshWallet.signData expects (payload, address)
			try {
				return await meshWallet.signData(payload, address);
			} catch {
				return await meshWallet.signData(address, payload);
			}
		},
		signTx: async (tx: string, partialSign?: boolean) => {
			return await meshWallet.signTx(tx, partialSign);
		},
		submitTx: async (tx: string) => {
			return await meshWallet.submitTx(tx);
		},
	};
}
