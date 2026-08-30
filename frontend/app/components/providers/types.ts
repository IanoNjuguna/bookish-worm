export type SocialProvider = "google" | "discord" | "twitter";

export interface CardanoContextType {
	isConnected: boolean;
	isConnecting: boolean;
	address: string | null;
	stakeAddress: string | null;
	walletName: string | null;
	walletApi: any | null;
	lucid: any | null;
	sessionSeedPhrase: string | null;
	connect: (wallet: string) => Promise<void>;
	connectFromSeed: (seedPhrase: string) => Promise<void>;
	connectSocial: (provider: SocialProvider) => Promise<void>;
	disconnect: () => void;
}

// Structural subset of the MeshWallet returned by `@utxos/sdk` (`utxosWallet.cardano`).
// Typed structurally so modules stay free of web3 runtime imports.
export interface MeshWalletLike {
	getUtxos: () => Promise<any[]>;
	getLovelace: () => Promise<string>;
	getUsedAddresses: () => Promise<string[]>;
	getUnusedAddresses: () => Promise<string[]>;
	getChangeAddress: () => Promise<string>;
	getRewardAddresses: () => Promise<string[]>;
	signData: (payload: string, address: string) => Promise<any>;
	signTx: (tx: string, partialSign?: boolean) => Promise<string>;
	submitTx: (tx: string) => Promise<string>;
}

export interface Cip30WalletApi {
	getNetworkId: () => Promise<number>;
	getUtxos: () => Promise<any[]>;
	getBalance: () => Promise<string>;
	getUsedAddresses: () => Promise<string[]>;
	getUnusedAddresses: () => Promise<string[]>;
	getChangeAddress: () => Promise<string>;
	getRewardAddresses: () => Promise<string[]>;
	getCollateral: () => Promise<any[]>;
	signData: (address: string, payload: string) => Promise<any>;
	signTx: (tx: string, partialSign?: boolean) => Promise<string>;
	submitTx: (tx: string) => Promise<string>;
}

export interface CardanoStateSetters {
	setIsConnected: (value: boolean) => void;
	setIsConnecting: (value: boolean) => void;
	setAddress: (value: string | null) => void;
	setStakeAddress: (value: string | null) => void;
	setWalletName: (value: string | null) => void;
	setWalletApi: (value: any | null) => void;
	setLucid: (value: any | null) => void;
	setSessionSeedPhrase: (value: string | null) => void;
}
