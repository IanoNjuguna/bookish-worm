import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PresetButtons } from './PresetButtons';

export interface AmountFieldProps {
	amount: string;
	balance: string;
	isLoadingBalance: boolean;
	activePreset: string | null;
	onAmountChange: (value: string) => void;
	onPresetSelect: (percent: number, label: string) => void;
}

export function AmountField({ amount, balance, isLoadingBalance, activePreset, onAmountChange, onPresetSelect }: AmountFieldProps) {
	return (
		<div className="space-y-2">
			<div className="flex justify-between items-end">
				<Label htmlFor="amount" className="text-xs font-bold uppercase tracking-wider text-midnight/60 dark:text-white/60">
					Amount (ADA)
				</Label>
				<span className="text-[10px] text-midnight/60 dark:text-white/40">
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
					onChange={(e) => onAmountChange(e.target.value)}
					className="bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 text-lg h-14 pl-4 pr-14 text-midnight dark:text-white placeholder:text-midnight/60 dark:placeholder:text-white/50 focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all rounded-xl"
				/>
				<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-midnight/60 dark:text-white/40 font-mono text-sm">
					ADA
				</div>
			</div>

			<PresetButtons activePreset={activePreset} onPresetSelect={onPresetSelect} />
		</div>
	);
}
