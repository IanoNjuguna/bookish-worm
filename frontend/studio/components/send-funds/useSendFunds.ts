'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useCardano } from '@/components/Providers';
import { toast } from 'sonner';
import {
	BALANCE_POLL_INTERVAL_MS,
	FEE_BUFFER_LOVELACE,
	MAX_PRESET_FEE_BUFFER_ADA,
	MAX_PRESET_LABEL,
} from './SendFunds.constants';
import type { UtxoLike } from './SendFunds.types';

export interface UseSendFundsReturn {
	recipient: string;
	amount: string;
	balance: string;
	isLoadingBalance: boolean;
	isSending: boolean;
	activePreset: string | null;
	isValid: boolean | string;
	setRecipient: (value: string) => void;
	handleAmountChange: (value: string) => void;
	handlePercentage: (percent: number, label: string) => void;
	handleSend: () => Promise<void>;
}

export function useSendFunds(): UseSendFundsReturn {
	const [recipient, setRecipient] = useState<string>('');
	const [amount, setAmount] = useState<string>('');
	const [balance, setBalance] = useState<string>('0.00');
	const [isLoadingBalance, setIsLoadingBalance] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [activePreset, setActivePreset] = useState<string | null>(null);

	const t = useTranslations('nav');
	const { address, isConnected, lucid } = useCardano();

	useEffect(() => {
		async function fetchBalance() {
			if (!address || !lucid) return;

			setIsLoadingBalance(true);
			try {
				const wallet = typeof lucid.wallet === 'function' ? lucid.wallet() : lucid.wallet;
				let lovelace = 0n;

				if (wallet && typeof wallet.getUtxos === 'function') {
					const utxos = (await wallet.getUtxos()) || [];
					lovelace = utxos.reduce(
						(total: bigint, utxo: UtxoLike) => total + (utxo.assets?.lovelace ?? 0n),
						0n
					);
				} else if (wallet && typeof wallet.getLovelace === 'function') {
					lovelace = BigInt(await wallet.getLovelace());
				} else if (typeof lucid.utxosAt === 'function') {
					const utxos = (await lucid.utxosAt(address)) || [];
					lovelace = utxos.reduce(
						(total: bigint, utxo: UtxoLike) => total + (utxo.assets?.lovelace ?? 0n),
						0n
					);
				}

				setBalance((Number(lovelace) / 1000000).toFixed(2));
			} catch (error) {
				console.error('Error fetching balance:', error);
			} finally {
				setIsLoadingBalance(false);
			}
		}

		fetchBalance();
		const interval = setInterval(fetchBalance, BALANCE_POLL_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [address, lucid]);

	const handleAmountChange = (value: string) => {
		if (value === '' || /^\d*\.?\d*$/.test(value)) {
			setAmount(value);
			setActivePreset(null);
		}
	};

	const handlePercentage = (percent: number, label: string) => {
		const balNum = parseFloat(balance);
		if (isNaN(balNum)) return;

		let calculated = (balNum * percent).toString();
		if (label === MAX_PRESET_LABEL) {
			calculated = Math.max(0, balNum - MAX_PRESET_FEE_BUFFER_ADA).toString(); // Subtract 1.5 ADA for fee buffer
		}
		if (parseFloat(calculated) < 0) calculated = '0';

		setAmount(calculated);
		setActivePreset(label);
	};

	const handleSend = async () => {
		if (!lucid || !recipient || !amount) return;

		const lovelace = BigInt(Math.floor(parseFloat(amount) * 1000000));
		const currentBalance = BigInt(Math.floor(parseFloat(balance) * 1000000));

		// Ensure we have enough balance to cover the amount + a small buffer for fees (approx 1.5 ADA)
		if (lovelace + FEE_BUFFER_LOVELACE > currentBalance) {
			toast.error("Insufficient balance to cover the transaction amount and network fees.");
			return;
		}

		setIsSending(true);
		try {
			const tx = await lucid.newTx()
				.pay.ToAddress(recipient, { lovelace })
				.complete();
			const signedTx = await tx.sign.withWallet().complete();
			const txHash = await signedTx.submit();

			toast.success(`Transaction submitted! Hash: ${txHash.slice(0, 10)}...${txHash.slice(-10)}`);
			setAmount('');
		} catch (error: any) {
			console.error("Transaction failed:", error);
			toast.error(error.message || "Transaction failed. Check if you have enough funds or valid address.");
		} finally {
			setIsSending(false);
		}
	};

	const isValid = isConnected && recipient.startsWith('addr') && recipient.length >= 50 && amount && !isNaN(Number(amount)) && parseFloat(amount) > 0;

	return {
		recipient,
		amount,
		balance,
		isLoadingBalance,
		isSending,
		activePreset,
		isValid,
		setRecipient,
		handleAmountChange,
		handlePercentage,
		handleSend,
	};
}
