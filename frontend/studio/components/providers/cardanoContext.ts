"use client";

import { createContext } from "react";
import type { CardanoContextType } from "./types";

export const CardanoContext = createContext<CardanoContextType>({
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
