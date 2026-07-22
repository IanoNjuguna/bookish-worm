'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { useCardano } from '@/components/Providers';
import { toast } from 'sonner';

type WalletAsset = {
	unit: string;
	label: string;
	balanceRaw: bigint;
	balanceDisplay: string;
	isAda: boolean;
};

const MIN_ADA_FEE_AND_CHANGE_BUFFER = 2_500_000n;

function formatAssetLabel(unit: string): string {
	if (unit === 'lovelace') return 'ADA';
	if (unit.length <= 20) return unit;
	return `${unit.slice(0, 10)}...${unit.slice(-8)}`;
}

function formatAda(lovelace: bigint): string {
	const ada = Number(lovelace) / 1_000_000;
	return ada.toFixed(6).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function extractRequiredLovelace(errorMessage: string): bigint | null {
	const match = errorMessage.match(/"lovelace":\s*"(\d+)n"/i);
	if (!match) return null;
	try {
		return BigInt(match[1]);
	} catch {
		return null;
	}
}

function isUserDeclinedTxError(errorMessage: string): boolean {
	const lower = errorMessage.toLowerCase();
	return (
		lower.includes('user declined sign tx') ||
		lower.includes('user declined') ||
		lower.includes('user rejected') ||
		lower.includes('user denied') ||
		lower.includes('declined transaction') ||
		lower.includes('rejected transaction') ||
		lower.includes('cancelled') ||
		lower.includes('canceled')
	);
}

export function SendFunds() {
	const [recipient, setRecipient] = useState<string>('');
	const [amount, setAmount] = useState<string>('');
	const [assets, setAssets] = useState<WalletAsset[]>([]);
	const [selectedUnit, setSelectedUnit] = useState<string>('lovelace');
	const [adaBalanceRaw, setAdaBalanceRaw] = useState<bigint>(0n);
	const [isLoadingBalance, setIsLoadingBalance] = useState(false);
	const [isSending, setIsSending] = useState(false);

	const t = useTranslations('nav');
	const { address, isConnected, lucid } = useCardano();

	const selectedAsset = assets.find((a) => a.unit === selectedUnit) || null;

	const fetchAssets = useCallback(async () => {
		if (!address || !lucid) return;

		setIsLoadingBalance(true);
		try {
			const wallet = typeof lucid.wallet === 'function' ? lucid.wallet() : lucid.wallet;
			let utxos: Array<{ assets?: Record<string, bigint> }> = [];

			if (wallet && typeof wallet.getUtxos === 'function') {
				utxos = (await wallet.getUtxos()) || [];
			} else if (typeof lucid.utxosAt === 'function') {
				utxos = (await lucid.utxosAt(address)) || [];
			}

			const totals = new Map<string, bigint>();
			for (const utxo of utxos) {
				for (const [unit, qty] of Object.entries(utxo.assets || {}) as Array<[string, bigint]>) {
					totals.set(unit, (totals.get(unit) || 0n) + qty);
				}
			}

			const nextAssets: WalletAsset[] = Array.from(totals.entries())
				.filter(([, qty]) => qty > 0n)
				.map(([unit, qty]) => {
					const isAda = unit === 'lovelace';
					return {
						unit,
						label: formatAssetLabel(unit),
						balanceRaw: qty,
						balanceDisplay: isAda ? formatAda(qty) : qty.toString(),
						isAda,
					};
				})
				.sort((a, b) => {
					if (a.isAda && !b.isAda) return -1;
					if (!a.isAda && b.isAda) return 1;
					return a.label.localeCompare(b.label);
				});

			setAssets(nextAssets);
			const nextAda = totals.get('lovelace') || 0n;
			setAdaBalanceRaw(nextAda);

			if (!nextAssets.find((a) => a.unit === selectedUnit)) {
				setSelectedUnit(nextAssets[0]?.unit || 'lovelace');
			}
		} catch (error) {
			console.error('Error fetching wallet assets:', error);
		} finally {
			setIsLoadingBalance(false);
		}
	}, [address, lucid, selectedUnit]);

	useEffect(() => {
		fetchAssets();
		const interval = setInterval(fetchAssets, 15000);
		return () => clearInterval(interval);
	}, [fetchAssets]);

	useEffect(() => {
		setAmount('');
	}, [selectedUnit]);

	const handlePercentage = (percent: number) => {
		if (!selectedAsset) return;

		if (selectedAsset.isAda) {
			const adaBalance = Number(selectedAsset.balanceRaw) / 1_000_000;
			let value = adaBalance * percent;
			if (percent === 1) {
				// Keep a conservative buffer for fees and required min-ADA change output.
				value = Math.max(0, value - Number(MIN_ADA_FEE_AND_CHANGE_BUFFER) / 1_000_000);
			}
			setAmount(value.toFixed(6).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1'));
			return;
		}

		const raw = selectedAsset.balanceRaw;
		let scaled = 0n;
		if (percent === 1) scaled = raw;
		else if (percent === 0.5) scaled = raw / 2n;
		else if (percent === 0.25) scaled = raw / 4n;
		setAmount(scaled.toString());
	};

	const handleSend = async () => {
		if (!lucid || !recipient || !amount || !selectedAsset) return;

		let sendQty: bigint;
		if (selectedAsset.isAda) {
			sendQty = BigInt(Math.floor(parseFloat(amount) * 1_000_000));
			if (sendQty + MIN_ADA_FEE_AND_CHANGE_BUFFER > selectedAsset.balanceRaw) {
				toast.error(`Insufficient ADA. Keep at least ${formatAda(MIN_ADA_FEE_AND_CHANGE_BUFFER)} ADA for fees/change.`);
				return;
			}
		} else {
			if (!/^\d+$/.test(amount)) {
				toast.error('Native token transfers must use whole-number quantities.');
				return;
			}
			sendQty = BigInt(amount);
			if (sendQty > selectedAsset.balanceRaw) {
				toast.error('Insufficient token balance.');
				return;
			}
			if (adaBalanceRaw < MIN_ADA_FEE_AND_CHANGE_BUFFER) {
				toast.error(`Insufficient ADA for token transfer. Keep at least ${formatAda(MIN_ADA_FEE_AND_CHANGE_BUFFER)} ADA in wallet.`);
				return;
			}
		}

		setIsSending(true);
		try {
			const payment = selectedAsset.isAda
				? { lovelace: sendQty }
				: { [selectedAsset.unit]: sendQty };

			const tx = await lucid.newTx()
				.pay.ToAddress(recipient, payment)
				.complete();
			const signedTx = await tx.sign.withWallet().complete();
			const txHash = await signedTx.submit();

			toast.success(`Transaction submitted! Hash: ${txHash.slice(0, 10)}...${txHash.slice(-10)}`);
			setAmount('');
			fetchAssets();
		} catch (error: any) {
			const rawMessage = String(error?.message || error || '');
			const lower = rawMessage.toLowerCase();
			const requiredLovelace = extractRequiredLovelace(rawMessage);

			if (isUserDeclinedTxError(rawMessage)) {
				// User rejection is expected behavior; show a calm UX message instead of a technical error.
				console.warn('Transaction signing was declined by user.');
				toast.info('You declined the transaction.');
			} else if (lower.includes('required minimum ada for change output')) {
				console.error("Transaction failed:", error);
				const required = requiredLovelace ? formatAda(requiredLovelace) : 'more';
				toast.error(`Not enough ADA for change output (min ${required} ADA). Reduce amount or add ADA.`);
			} else if (lower.includes('reference scripts') || lower.includes('excluded from coin selection')) {
				console.error("Transaction failed:", error);
				toast.error('Your wallet UTxOs are hard to select (reference scripts). Consolidate UTxOs or use another wallet account.');
			} else {
				console.error("Transaction failed:", error);
				toast.error(error.message || "Transaction failed. Check if you have enough funds or valid address.");
			}
		} finally {
			setIsSending(false);
		}
	};

	const isPositiveAmount = selectedAsset?.isAda
		? !!amount && !isNaN(Number(amount)) && parseFloat(amount) > 0
		: !!amount && /^\d+$/.test(amount) && BigInt(amount) > 0n;

	const isValid = isConnected && recipient.startsWith('addr') && recipient.length >= 50 && !!selectedAsset && isPositiveAmount;

	return (
		<div
			className="space-y-6 animate-fade-in max-w-md mx-auto p-6 glass text-midnight dark:text-white bg-[#FAF9F6] dark:bg-[#0D0D12]/80 border border-midnight/10 dark:border-white/10 relative overflow-hidden"
		>
			<div className="flex justify-between items-center border-b border-white/5 pb-4">
				<h3 className="text-lg font-bold text-midnight dark:text-white uppercase tracking-wider flex items-center gap-2">
					<span className="w-1.5 h-4 bg-cyber-pink inline-block"></span>
					Send Assets
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
					<Label htmlFor="asset" className="text-midnight/60 dark:text-white/60 text-xs font-bold uppercase tracking-wider">Asset</Label>
					<Select value={selectedUnit} onValueChange={setSelectedUnit}>
						<SelectTrigger
							id="asset"
							className="w-full bg-midnight/5 dark:bg-[#171821] border-midnight/10 dark:border-white/10 text-sm h-12 px-3 text-midnight dark:text-white focus:ring-0 focus:ring-offset-0 focus:border-[#FF1F8A]/50 transition-colors rounded-none"
						>
							<SelectValue placeholder="Select asset" />
						</SelectTrigger>
						<SelectContent className="rounded-none border-midnight/10 dark:border-white/10 bg-[#FAF9F6] dark:bg-[#171821] text-midnight dark:text-white">
							{assets.length === 0 ? (
								<SelectItem
									value="lovelace"
									className="text-midnight dark:text-white focus:bg-midnight/10 focus:text-midnight dark:focus:bg-white/10 dark:focus:text-white data-[state=checked]:bg-midnight/10 dark:data-[state=checked]:bg-white/10"
								>
									No assets found
								</SelectItem>
							) : (
								assets.map((asset) => (
									<SelectItem
										key={asset.unit}
										value={asset.unit}
										className="text-midnight dark:text-white focus:bg-midnight/10 focus:text-midnight dark:focus:bg-white/10 dark:focus:text-white data-[state=checked]:bg-midnight/10 dark:data-[state=checked]:bg-white/10"
									>
										{asset.label}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between items-end">
						<Label htmlFor="amount" className="text-midnight/60 dark:text-white/60 text-xs font-bold uppercase tracking-wider">
							Amount ({selectedAsset?.label || 'ASSET'})
						</Label>
						<span className="text-[10px] text-midnight/70 dark:text-white/60">
							Balance: <span className={isLoadingBalance ? 'animate-pulse' : ''}>{selectedAsset?.balanceDisplay || '0'} {selectedAsset?.label || ''}</span>
						</span>
					</div>
					<div className="relative">
						<Input
							id="amount"
							type="text"
							inputMode={selectedAsset?.isAda ? 'decimal' : 'numeric'}
							placeholder={selectedAsset?.isAda ? '0.0' : '0'}
							value={amount}
							onChange={(e) => {
								const val = e.target.value;
								const pattern = selectedAsset?.isAda ? /^\d*\.?\d*$/ : /^\d*$/;
								if (val === '' || pattern.test(val)) {
									setAmount(val);
								}
							}}
							className="bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 text-lg h-14 pl-4 pr-12 text-midnight dark:text-white placeholder:text-midnight/60 dark:placeholder:text-white/50 focus:border-[#FF1F8A]/50 transition-colors rounded-none"
						/>
						<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-midnight/70 dark:text-white/60 font-mono text-sm">
							{selectedAsset?.label || 'ASSET'}
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

