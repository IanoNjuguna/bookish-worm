import { cn } from '@/lib/utils';
import { AMOUNT_PRESETS } from './SendFunds.constants';

export interface PresetButtonsProps {
	activePreset: string | null;
	onPresetSelect: (percent: number, label: string) => void;
}

export function PresetButtons({ activePreset, onPresetSelect }: PresetButtonsProps) {
	return (
		<div className="flex p-1 mt-3 rounded-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10">
			{AMOUNT_PRESETS.map(({ label, percent }) => {
				const isActive = activePreset === label
				return (
					<button
						key={label}
						type="button"
						onClick={() => onPresetSelect(percent, label)}
						className={cn(
							"flex-1 h-8 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							isActive
								? "bg-lavender text-midnight"
								: "text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5"
						)}
					>
						{label}
					</button>
				)
			})}
		</div>
	);
}
