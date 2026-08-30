import React from 'react'
import { IconCopy, IconCheck, IconExternalLink } from '@tabler/icons-react'
import { EXPLORER_URL, CARDANO_NETWORK } from '@/lib/config'

interface DepositAddressSectionProps {
	address: string
	copied: boolean
	onCopy: () => void
}

export function DepositAddressSection({ address, copied, onCopy }: DepositAddressSectionProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-center gap-2">
				<span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-600 dark:text-cyber-pink">
					Cardano {CARDANO_NETWORK.toUpperCase()} Network
				</span>
			</div>

			<button
				onClick={onCopy}
				className="group w-full flex items-center justify-between gap-3 p-3 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 hover:border-midnight/20 dark:hover:border-white/20 transition-all rounded-xl"
			>
				<code className="text-xs sm:text-sm font-mono text-midnight/80 dark:text-white/80 select-all break-all text-left">
					{address}
				</code>
				<div className="flex items-center gap-1 shrink-0">
					<div className="w-8 h-8 flex items-center justify-center rounded-lg text-midnight/60 dark:text-white/40 group-hover:text-midnight dark:group-hover:text-white group-hover:bg-midnight/5 dark:group-hover:bg-white/5 transition-colors">
						{copied ? <IconCheck size={16} className="text-emerald-500" /> : <IconCopy size={16} />}
					</div>
					<a
						href={`${EXPLORER_URL}/address/${address}`}
						target="_blank"
						rel="noopener noreferrer"
						className="w-8 h-8 flex items-center justify-center rounded-lg text-midnight/60 dark:text-white/40 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors"
						onClick={(e) => e.stopPropagation()}
						title="View on CardanoScan"
					>
						<IconExternalLink size={16} />
					</a>
				</div>
			</button>
		</div>
	)
}
