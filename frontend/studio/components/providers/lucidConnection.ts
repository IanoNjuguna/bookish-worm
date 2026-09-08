import { toast } from "sonner";
import { BLOCKFROST_PROJECT_ID } from "@/lib/config";
import {
	BLOCKFROST_MAINNET_URL,
	LUCID_NETWORK,
	STORAGE_KEY_CONNECTED_WALLET,
	STORAGE_KEY_JUST_CONNECTED,
	UTXOS_WALLET_NAME,
} from "./constants";
import type { CardanoStateSetters } from "./types";

// Connects Lucid to a browser wallet extension or a seed phrase and pushes
// the resulting session into the Cardano state setters.
export async function initializeLucidConnection(
	setters: CardanoStateSetters,
	disconnect: () => void,
	wallet: string,
	seedPhrase?: string
): Promise<void> {
	const {
		setIsConnecting,
		setWalletApi,
		setLucid,
		setAddress,
		setStakeAddress,
		setWalletName,
		setIsConnected,
	} = setters;

	setIsConnecting(true);
	try {
		// Dynamically import Lucid & Blockfrost to prevent SSR compilation errors
		const { Lucid, Blockfrost } = await import("@lucid-evolution/lucid");

		// Initialize provider
		const blockfrostProvider = new Blockfrost(BLOCKFROST_MAINNET_URL, BLOCKFROST_PROJECT_ID);

		// Initialize Lucid
		const lucidInstance = await Lucid(blockfrostProvider, LUCID_NETWORK);

		if (seedPhrase) {
			try {
				lucidInstance.selectWallet.fromSeed(seedPhrase);
				setWalletApi(null);
			} catch (e: any) {
				console.error("Wallet selection from seed failed:", e);
				throw new Error("Invalid seed phrase");
			}
		} else {
			if (typeof window === "undefined") {
				throw new Error("Wallet connection is only available in the browser");
			}

			const cardanoProvider = (window as any).cardano;
			const walletProvider = cardanoProvider?.[wallet];
			if (!walletProvider || typeof walletProvider.enable !== "function") {
				throw new Error(`Wallet extension \"${wallet}\" is not available. Please install or reconnect using an installed wallet.`);
			}

			const api = await walletProvider.enable();
			if (api) {
				lucidInstance.selectWallet.fromAPI(api);
				setWalletApi(api);
			}
		}

		const walletAddress = await lucidInstance.wallet().address();
		let walletStakeAddress: string | null = null;
		try {
			walletStakeAddress = await lucidInstance.wallet().rewardAddress();
		} catch {
			walletStakeAddress = null;
		}

		setLucid(lucidInstance);
		setAddress(walletAddress);
		setStakeAddress(walletStakeAddress);
		setWalletName(wallet);
		setIsConnected(true);
		localStorage.setItem(STORAGE_KEY_CONNECTED_WALLET, wallet);
		if (typeof window !== "undefined") {
			sessionStorage.setItem(STORAGE_KEY_JUST_CONNECTED, "true");
		}

		toast.success(`Connected to ${wallet === UTXOS_WALLET_NAME ? "Social Login" : wallet}`);
	} catch (error: any) {
		const errMessage = typeof error === 'string' ? error : (error?.message || '');
		if (errMessage.includes('Refused') || errMessage.includes('cancelled') || errMessage.includes('rejected')) {
			console.log('Wallet connection cancelled by user.');
		} else {
			console.error("Wallet connection failed:", error);
			toast.error(errMessage || "Failed to connect to wallet");
		}
		disconnect();
	} finally {
		setIsConnecting(false);
	}
}
