"use client";

import {
	STORAGE_KEY_SESSION_SEED,
	UTXOS_WALLET_NAME,
} from "./constants";
import { initializeLucidConnection } from "./lucidConnection";
import type { CardanoStateSetters } from "./types";

export interface LucidConnectHandlers {
	connect: (wallet: string) => Promise<void>;
	connectFromSeed: (seedPhrase: string) => Promise<void>;
}

// Wallet-extension and seed-phrase connection handlers.
export function useLucidConnect(
	setters: CardanoStateSetters,
	disconnect: () => void
): LucidConnectHandlers {
	const connect = async (wallet: string) => {
		await initializeLucidConnection(setters, disconnect, wallet);
	};

	const connectFromSeed = async (seedPhrase: string) => {
		setters.setSessionSeedPhrase(seedPhrase);
		if (typeof window !== "undefined") {
			sessionStorage.setItem(STORAGE_KEY_SESSION_SEED, seedPhrase);
		}
		await initializeLucidConnection(setters, disconnect, UTXOS_WALLET_NAME, seedPhrase);
	};

	return { connect, connectFromSeed };
}
