'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { useCardano } from '@/components/Providers';
import { toast } from 'sonner';

export function SendFunds() {
	const [recipient, setRecipient] = useState<string>('');
	const [amount, setAmount] = useState<string>('');
	const [balance, setBalance] = useState<string>('0.00');
	const [isLoadingBalance, setIsLoadingBalance] = useState(false);
	const [isSending, setIsSending] = useState(false);

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
						(total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
						0n
					);
				} else if (wallet && typeof wallet.getLovelace === 'function') {
					lovelace = BigInt(await wallet.getLovelace());
				} else if (typeof lucid.utxosAt === 'function') {
					const utxos = (await lucid.utxosAt(address)) || [];
					lovelace = utxos.reduce(
						(total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
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
		const interval = setInterval(fetchBalance, 15000);
		return () => clearInterval(interval);
	}, [address, lucid]);

	const handlePercentage = (percent: number) => {
		const balNum = parseFloat(balance);
		if (isNaN(balNum)) return;

		let calculated = (balNum * percent - 1.5).toString(); // Subtract 1.5 ADA for fee buffer
		if (parseFloat(calculated) < 0) calculated = '0';

		setAmount(calculated);
	};

	const handleSend = async () => {
		if (!lucid || !recipient || !amount) return;

		const lovelace = BigInt(Math.floor(parseFloat(amount) * 1000000));
		const currentBalance = BigInt(Math.floor(parseFloat(balance) * 1000000));

		// Ensure we have enough balance to cover the amount + a small buffer for fees (approx 1.5 ADA)
		if (lovelace + 1500000n > currentBalance) {
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

	return (
		<div
			className="space-y-6 animate-fade-in max-w-md mx-auto p-6 glass text-midnight dark:text-white bg-[#FAF9F6] dark:bg-[#0D0D12]/80 border border-midnight/10 dark:border-white/10 relative overflow-hidden"
		>
			<div className="flex justify-between items-center border-b border-white/5 pb-4">
				<h3 className="text-lg font-bold text-midnight dark:text-white uppercase tracking-wider flex items-center gap-2">
					<span className="w-1.5 h-4 bg-cyber-pink inline-block"></span>
					Send ADA
				</h3>
				<span className="text-[10px] text-midnight/70 dark:text-white/60 font-bold uppercase">Cardano Network</span>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="recipient" className="text-midnight/60 dark:text-white/60 text-xs font-bold uppercase tracking-wider">Recipient Address</Label>
					<Input
						id="recipient"
						placeholder="addr1..."
						value={recipient}
						onChange={(e) => setRecipient(e.target.value)}
						className="bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 text-sm h-12 text-midnight dark:text-white placeholder:text-midnight/60 dark:placeholder:text-white/50 focus:border-[#FF1F8A]/50 transition-colors rounded-none"
					/>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between items-end">
						<Label htmlFor="amount" className="text-midnight/60 dark:text-white/60 text-xs font-bold uppercase tracking-wider">
							Amount (ADA)
						</Label>
						<span className="text-[10px] text-midnight/70 dark:text-white/60">
							Balance: <span className={isLoadingBalance ? 'animate-pulse' : ''}>{balance} ADA</span>
						</span>
					</div>
					<div className="relative">
						<Input
							id="amount"
							type="text"
							inputMode="decimal"
							placeholder="0.0"
							value={amount}
							onChange={(e) => {
								const val = e.target.value;
								if (val === '' || /^\d*\.?\d*$/.test(val)) {
									setAmount(val);
								}
							}}
							className="bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 text-lg h-14 pl-4 pr-12 text-midnight dark:text-white placeholder:text-midnight/60 dark:placeholder:text-white/50 focus:border-[#FF1F8A]/50 transition-colors rounded-none"
						/>
						<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-midnight/70 dark:text-white/60 font-mono text-sm">
							ADA
						</div>
					</div>

					<div className="grid grid-cols-3 gap-2 mt-2">
						{['25%', '50%', 'MAX'].map((label, idx) => (
							<button
								key={label}
								className={`bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 text-[10px] h-8 hover:bg-midnight/5 dark:hover:bg-white/5 hover:text-midnight dark:hover:text-white rounded-none flex items-center justify-center transition-colors ${idx === 2 ? 'text-[#FF1F8A]/80 border-[#FF1F8A]/20 hover:bg-[#FF1F8A]/20 hover:text-[#FF1F8A]' : 'text-midnight/60 dark:text-white/60'}`}
								onClick={() => handlePercentage([0.25, 0.5, 1][idx])}
							>
								{label}
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="pt-2">
				<button
					onClick={handleSend}
					disabled={!isValid || isSending}
					className={`w-full h-14 font-bold text-lg transition-all rounded-none flex items-center justify-center gap-2 ${isValid && !isSending
						? 'bg-[#B794F4] text-black hover:bg-[#A080E0]'
						: 'bg-midnight/10 dark:bg-white/10 text-midnight/70 dark:text-white/60 cursor-not-allowed opacity-50'
						}`}
				>
					{isSending ? 'Sending...' : (isValid ? 'Send Funds' : 'Enter Details')}
				</button>
			</div>
		</div>
	);
}

