"use client";

import { toast } from "sonner";
import { BLOCKFROST_PROJECT_ID } from "@/lib/config";
import {
	BLOCKFROST_MAINNET_URL,
	CARDANO_MAINNET_NETWORK_ID,
	LUCID_NETWORK,
	STORAGE_KEY_CONNECTED_WALLET,
	STORAGE_KEY_JUST_CONNECTED,
	STORAGE_KEY_SOCIAL_PROVIDER,
	UTXOS_SOCIAL_PREFIX,
	UTXOS_WALLET_NAME,
} from "./constants";
import { buildCip30WalletApi } from "./cip30WalletApi";
import type { CardanoStateSetters, SocialProvider } from "./types";

export interface SocialConnectHandlers {
	connectSocial: (provider: SocialProvider) => Promise<void>;
}

// UTXOS social-login connection handler (Google / Discord / Twitter).
export function useSocialConnect(
	setters: CardanoStateSetters,
	disconnect: () => void
): SocialConnectHandlers {
	const connectSocial = async (provider: SocialProvider) => {
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
			const { Lucid, Blockfrost } = await import("@lucid-evolution/lucid");
			const { Web3Wallet } = await import("@utxos/sdk");

			const blockfrostProvider = new Blockfrost(BLOCKFROST_MAINNET_URL, BLOCKFROST_PROJECT_ID);

			const lucidInstance = await Lucid(blockfrostProvider, LUCID_NETWORK);

			// Web3Wallet.enable() opens the UTXOS social login popup.
			// Returns Web3Wallet instance containing `cardano: MeshWallet`
			const utxosWallet = await Web3Wallet.enable({
				projectId: process.env.NEXT_PUBLIC_UTXOS_PROJECT_ID!,
				networkId: CARDANO_MAINNET_NETWORK_ID,
				directTo: provider,
			});

			const meshWallet = utxosWallet.cardano;

			// Wrap MeshWallet in a CIP-30 compatible interface for Lucid & Backend Auth
			const cip30WalletApi = buildCip30WalletApi(meshWallet);

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
			setWalletName(UTXOS_WALLET_NAME);
			setWalletApi(cip30WalletApi);
			setIsConnected(true);

			// Store as "utxos:google" etc. so auto-reconnect knows which provider
			localStorage.setItem(STORAGE_KEY_CONNECTED_WALLET, `${UTXOS_SOCIAL_PREFIX}${provider}`);
			localStorage.setItem(STORAGE_KEY_SOCIAL_PROVIDER, provider);
			sessionStorage.setItem(STORAGE_KEY_JUST_CONNECTED, "true");

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

	return { connectSocial };
}
