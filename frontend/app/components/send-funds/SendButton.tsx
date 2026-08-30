import { Button } from '@/components/ui/button';

export interface SendButtonProps {
	isValid: boolean | string;
	isSending: boolean;
	onSend: () => void;
}

export function SendButton({ isValid, isSending, onSend }: SendButtonProps) {
	return (
		<Button
			onClick={onSend}
			disabled={!isValid || isSending}
			className={`w-full h-14 text-base font-bold rounded-xl transition-all ${
				isValid && !isSending
					? 'bg-lavender hover:bg-lavender/90 text-midnight'
					: 'bg-midnight/10 dark:bg-white/10 text-midnight/60 dark:text-white/40 cursor-not-allowed opacity-60 hover:bg-midnight/10 dark:hover:bg-white/10'
			}`}
		>
			{isSending ? 'Sending...' : (isValid ? 'Send Funds' : 'Enter Details')}
		</Button>
	);
}
