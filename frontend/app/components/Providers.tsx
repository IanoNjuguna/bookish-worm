"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, CARDANO_NETWORK, BLOCKFROST_PROJECT_ID } from "@/lib/config";
import { toast } from "sonner";

type SocialProvider = "google" | "discord" | "twitter";

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
	connectSocial: (provider: SocialProvider) => Promise<void>;
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
	connectSocial: async () => {},
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
				const savedSeed = sessionStorage.getItem("doba_session_seed");

				if (savedWallet && !isConnected && !isConnecting) {
					if (savedWallet.startsWith("utxos:")) {
						// Social login wallet — silently re-authenticate
						const provider = savedWallet.split(":")[1] as SocialProvider;
						connectSocial(provider).catch((err) => {
							console.warn("Social wallet auto-reconnection failed:", err);
							localStorage.removeItem("doba_connected_wallet");
							localStorage.removeItem("doba_social_provider");
						});
					} else if (savedWallet === "utxos") {
						if (savedSeed) {
							connectFromSeed(savedSeed).catch((err) => {
								console.warn("Seed auto-reconnection failed:", err);
							});
						} else {
							localStorage.removeItem("doba_connected_wallet");
						}
					} else {
						connect(savedWallet).catch((err) => {
							console.warn("Auto-reconnection failed:", err);
						});
					}
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

			// Initialize provider
			const blockfrostProvider = new Blockfrost(
				`https://cardano-mainnet.blockfrost.io/api/v0`,
				BLOCKFROST_PROJECT_ID
			);

			// Initialize Lucid
			const lucidInstance = await Lucid(blockfrostProvider, "Mainnet");

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
			localStorage.setItem("doba_connected_wallet", wallet);
			if (typeof window !== "undefined") {
				sessionStorage.setItem("doba_just_connected", "true");
			}

			toast.success(`Connected to ${wallet === "utxos" ? "Social Login" : wallet}`);
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

	const connectSocial = async (provider: SocialProvider) => {
		setIsConnecting(true);
		try {
			const { Lucid, Blockfrost } = await import("@lucid-evolution/lucid");
			const { Web3Wallet } = await import("@utxos/sdk");

			const blockfrostProvider = new Blockfrost(
				`https://cardano-mainnet.blockfrost.io/api/v0`,
				BLOCKFROST_PROJECT_ID
			);

			const lucidInstance = await Lucid(blockfrostProvider, "Mainnet");

			// Web3Wallet.enable() opens the UTXOS social login popup.
			// Returns Web3Wallet instance containing `cardano: MeshWallet`
			const utxosWallet = await Web3Wallet.enable({
				projectId: process.env.NEXT_PUBLIC_UTXOS_PROJECT_ID!,
				networkId: 1, // Cardano Mainnet
				directTo: provider,
			});

			const meshWallet = utxosWallet.cardano;

			// Wrap MeshWallet in a CIP-30 compatible interface for Lucid & Backend Auth
			const cip30WalletApi = {
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

			// Feed the CIP-30 API into Lucid
			lucidInstance.selectWallet.fromAPI(cip30WalletApi as any);

			const walletAddress = await meshWallet.getChangeAddress();
			let walletStakeAddress: string | null = null;
			try {
				const rewards = await meshWallet.getRewardAddresses();
				walletStakeAddress = rewards && rewards.length > 0 ? rewards[0] : null;
			} catch {
				walletStakeAddress = null;
			}

			setLucid(lucidInstance);
			setAddress(walletAddress);
			setStakeAddress(walletStakeAddress);
			setWalletName("utxos");
			setWalletApi(cip30WalletApi);
			setIsConnected(true);

			// Store as "utxos:google" etc. so auto-reconnect knows which provider
			localStorage.setItem("doba_connected_wallet", `utxos:${provider}`);
			localStorage.setItem("doba_social_provider", provider);
			sessionStorage.setItem("doba_just_connected", "true");

			const providerLabel = provider.charAt(0).toUpperCase() + provider.slice(1);
			toast.success(`Connected via ${providerLabel}`);
		} catch (error: any) {
			const errMessage = typeof error === "string" ? error : (error?.message || "");
			if (
				errMessage.includes("closed") ||
				errMessage.includes("cancelled") ||
				errMessage.includes("rejected") ||
				errMessage.includes("Refused")
			) {
				console.log("Social login cancelled by user.");
			} else {
				console.error("Social login failed:", error);
				toast.error(errMessage || "Social login failed");
			}
			disconnect();
		} finally {
			setIsConnecting(false);
		}
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
		localStorage.removeItem('doba_social_provider');
	};

	return (
		<CardanoContext.Provider value={{ isConnected, address, stakeAddress, connect, connectFromSeed, connectSocial, disconnect, walletName, walletApi, lucid, isConnecting, sessionSeedPhrase }}>
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

