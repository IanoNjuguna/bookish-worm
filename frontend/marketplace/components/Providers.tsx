"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, CARDANO_NETWORK, BLOCKFROST_PROJECT_ID } from "@/lib/config";
import { toast } from "sonner";

interface CardanoContextType {
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
	disconnect: () => void;
}

const CardanoContext = createContext<CardanoContextType>({
	isConnected: false,
	isConnecting: false,
	address: null,
	stakeAddress: null,
	walletName: null,
	walletApi: null,
	lucid: null,
	sessionSeedPhrase: null,
	connect: async () => {},
	connectFromSeed: async () => {},
	disconnect: () => {},
});

export function CardanoProvider({ children }: { children: React.ReactNode }) {
	const [isConnected, setIsConnected] = useState(false);
	const [address, setAddress] = useState<string | null>(null);
	const [stakeAddress, setStakeAddress] = useState<string | null>(null);
	const [walletName, setWalletName] = useState<string | null>(null);
	const [walletApi, setWalletApi] = useState<any | null>(null);
	const [lucid, setLucid] = useState<any | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const [sessionSeedPhrase, setSessionSeedPhrase] = useState<string | null>(null);

	useEffect(() => {
		const checkConnection = async () => {
			if (typeof window !== "undefined") {
				const savedWallet = localStorage.getItem("doba_connected_wallet");
				if (savedWallet && !isConnected && !isConnecting) {
					connect(savedWallet).catch((err) => {
						console.warn("Auto-reconnection failed:", err);
					});
				}
			}
		};

		checkConnection();
	}, []);

	const initializeLucid = async (wallet: string, seedPhrase?: string) => {
		setIsConnecting(true);
		try {
			// Dynamically import Lucid & Blockfrost to prevent SSR compilation errors
			const { Lucid, Blockfrost } = await import("@lucid-evolution/lucid");

			if (!BLOCKFROST_PROJECT_ID) {
				throw new Error("Missing NEXT_PUBLIC_BLOCKFROST_PROJECT_ID_MAINNET. Add it to your environment and restart Next.js.");
			}

			if (CARDANO_NETWORK === "Mainnet" && !BLOCKFROST_PROJECT_ID.toLowerCase().startsWith("mainnet")) {
				throw new Error("Invalid Blockfrost key for Mainnet. Expected NEXT_PUBLIC_BLOCKFROST_PROJECT_ID_MAINNET to start with 'mainnet'.");
			}

			// Initialize provider
			const blockfrostProvider = new Blockfrost(
				`https://cardano-mainnet.blockfrost.io/api/v0`,
				BLOCKFROST_PROJECT_ID
			);

			// Initialize Lucid
			let lucidInstance: any;
			try {
				lucidInstance = await Lucid(blockfrostProvider, CARDANO_NETWORK);
			} catch (lucidInitError: any) {
				const message = String(lucidInitError?.message || lucidInitError || "");
				if (message.includes("Cannot convert undefined to a BigInt") || message.includes("BigInt")) {
					throw new Error(
						"Failed to initialize Cardano provider. Check NEXT_PUBLIC_BLOCKFROST_PROJECT_ID_MAINNET (missing/invalid) and ensure Mainnet Blockfrost access is enabled."
					);
				}
				throw lucidInitError;
			}

			if (seedPhrase) {
				try {
					lucidInstance.selectWallet.fromSeed(seedPhrase);
					// Seed wallets are not CIP-30 extensions. Expose a minimal signData-compatible API
					// so backend auth can verify signatures exactly like extension wallets.
					setWalletApi({
						signData: async (address: string, payload: string) => {
							const selectedWallet = typeof lucidInstance.wallet === "function"
								? lucidInstance.wallet()
								: lucidInstance.wallet;

							if (!selectedWallet || typeof selectedWallet.signMessage !== "function") {
								throw new Error("Seed wallet signer is unavailable");
							}

							return await selectedWallet.signMessage(address, payload);
						},
					});
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
			localStorage.setItem("doba_connected_wallet", wallet);
			if (typeof window !== "undefined") {
				sessionStorage.setItem("doba_just_connected", "true");
			}

			toast.success(`Connected to ${wallet === "utxos" ? "Social Login" : wallet}`);
		} catch (error: any) {
			let errMessage = typeof error === 'string' ? error : (error?.message || '');
			if (errMessage.includes('Cannot convert undefined to a BigInt') || errMessage.includes('BigInt')) {
				errMessage = 'Wallet provider failed to initialize. Verify NEXT_PUBLIC_BLOCKFROST_PROJECT_ID_MAINNET and restart the app.';
			}
			if (errMessage.includes('Refused') || errMessage.includes('cancelled') || errMessage.includes('rejected')) {
				console.log('Wallet connection cancelled by user.');
			} else {
				console.error("Wallet connection failed:", errMessage);
				toast.error(errMessage || "Failed to connect to wallet");
			}
			disconnect();
		} finally {
			setIsConnecting(false);
		}
	};

	const connect = async (wallet: string) => {
		await initializeLucid(wallet);
	};

	const connectFromSeed = async (seedPhrase: string) => {
		setSessionSeedPhrase(seedPhrase);
		if (typeof window !== "undefined") {
			sessionStorage.setItem("doba_session_seed", seedPhrase);
		}
		await initializeLucid("utxos", seedPhrase);
	};

	const disconnect = () => {
		setIsConnected(false);
		setAddress(null);
		setStakeAddress(null);
		setWalletName(null);
		setWalletApi(null);
		setLucid(null);
		setSessionSeedPhrase(null);
		localStorage.removeItem('doba_connected_wallet');
		localStorage.removeItem('doba_session_seed');
		localStorage.removeItem('doba_auth_data');
	};

	return (
		<CardanoContext.Provider value={{ isConnected, address, stakeAddress, connect, connectFromSeed, disconnect, walletName, walletApi, lucid, isConnecting, sessionSeedPhrase }}>
			{children}
		</CardanoContext.Provider>
	);
}

export const useCardano = () => useContext(CardanoContext);

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<CardanoProvider>
				{children}
			</CardanoProvider>
		</QueryClientProvider>
	);
}

