import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface RecipientFieldProps {
	recipient: string;
	onRecipientChange: (value: string) => void;
}

export function RecipientField({ recipient, onRecipientChange }: RecipientFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor="recipient" className="text-xs font-bold uppercase tracking-wider text-midnight/60 dark:text-white/60">Recipient Address</Label>
			<Input
				id="recipient"
				placeholder="addr1..."
				value={recipient}
				onChange={(e) => onRecipientChange(e.target.value)}
				className="bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 text-sm h-12 text-midnight dark:text-white placeholder:text-midnight/60 dark:placeholder:text-white/50 focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all rounded-xl"
			/>
		</div>
	);
}
