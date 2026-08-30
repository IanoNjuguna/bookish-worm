"use client";

import { useEffect, useState } from "react";
import {
	STORAGE_KEY_AUTH_DATA,
	STORAGE_KEY_CONNECTED_WALLET,
	STORAGE_KEY_SESSION_SEED,
	STORAGE_KEY_SOCIAL_PROVIDER,
	UTXOS_SOCIAL_PREFIX,
	UTXOS_WALLET_NAME,
} from "./constants";
import { useLucidConnect } from "./useLucidConnect";
import { useSocialConnect } from "./useSocialConnect";
import type { CardanoContextType, CardanoStateSetters, SocialProvider } from "./types";

// Owns all Cardano session state plus the auto-reconnect effect, and
// composes the extension/seed and social connection handlers.
export function useCardanoConnection(): CardanoContextType {
	const [isConnected, setIsConnected] = useState(false);
	const [address, setAddress] = useState<string | null>(null);
	const [stakeAddress, setStakeAddress] = useState<string | null>(null);
	const [walletName, setWalletName] = useState<string | null>(null);
	const [walletApi, setWalletApi] = useState<any | null>(null);
	const [lucid, setLucid] = useState<any | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const [sessionSeedPhrase, setSessionSeedPhrase] = useState<string | null>(null);

	const setters: CardanoStateSetters = {
		setIsConnected,
		setIsConnecting,
		setAddress,
		setStakeAddress,
		setWalletName,
		setWalletApi,
		setLucid,
		setSessionSeedPhrase,
	};

	const disconnect = () => {
		setIsConnected(false);
		setAddress(null);
		setStakeAddress(null);
		setWalletName(null);
		setWalletApi(null);
		setLucid(null);
		setSessionSeedPhrase(null);
		localStorage.removeItem(STORAGE_KEY_CONNECTED_WALLET);
		localStorage.removeItem(STORAGE_KEY_SESSION_SEED);
		localStorage.removeItem(STORAGE_KEY_AUTH_DATA);
		localStorage.removeItem(STORAGE_KEY_SOCIAL_PROVIDER);
	};

	const { connect, connectFromSeed } = useLucidConnect(setters, disconnect);
	const { connectSocial } = useSocialConnect(setters, disconnect);

	useEffect(() => {
		const checkConnection = async () => {
			if (typeof window !== "undefined") {
				const savedWallet = localStorage.getItem(STORAGE_KEY_CONNECTED_WALLET);
				const savedSeed = sessionStorage.getItem(STORAGE_KEY_SESSION_SEED);

				if (savedWallet && !isConnected && !isConnecting) {
					if (savedWallet.startsWith(UTXOS_SOCIAL_PREFIX)) {
						// Social login wallet — silently re-authenticate
						const provider = savedWallet.split(":")[1] as SocialProvider;
						connectSocial(provider).catch((err) => {
							console.warn("Social wallet auto-reconnection failed:", err);
							localStorage.removeItem(STORAGE_KEY_CONNECTED_WALLET);
							localStorage.removeItem(STORAGE_KEY_SOCIAL_PROVIDER);
						});
					} else if (savedWallet === UTXOS_WALLET_NAME) {
						if (savedSeed) {
							connectFromSeed(savedSeed).catch((err) => {
								console.warn("Seed auto-reconnection failed:", err);
							});
						} else {
							localStorage.removeItem(STORAGE_KEY_CONNECTED_WALLET);
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

	return {
		isConnected,
		isConnecting,
		address,
		stakeAddress,
		walletName,
		walletApi,
		lucid,
		sessionSeedPhrase,
		connect,
		connectFromSeed,
		connectSocial,
		disconnect,
	};
}
