import { IconExternalLink, IconMusic } from '@tabler/icons-react'
import { EXPLORER_URL } from '@/lib/config'
import type { RoyaltyEntry } from './EarningsView.types'
import { IPFS_GATEWAY_FALLBACK } from './EarningsView.constants'

interface EarningsSplitRowProps {
	entry: RoyaltyEntry
}

export function EarningsSplitRow({ entry }: EarningsSplitRowProps) {
	return (
		<div className="p-5 flex items-center justify-between hover:bg-midnight/5 dark:hover:bg-white/5 transition duration-300">
			<div className="flex-1 min-w-0 flex items-center gap-3">
				<div className="w-10 h-10 rounded-lg border border-midnight/10 dark:border-white/10 overflow-hidden shrink-0 bg-midnight/5 dark:bg-white/5">
					{entry.imageUrl ? (
						<img
							src={entry.imageUrl.replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || IPFS_GATEWAY_FALLBACK)}
							alt={entry.track}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-midnight/70 dark:text-white/40">
							<IconMusic size={18} />
						</div>
					)}
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-bold text-midnight dark:text-white flex items-center gap-2 truncate">
						{entry.track}
						<span className="text-[10px] font-mono bg-midnight/5 dark:bg-white/5 px-1.5 py-0.5 text-midnight/70 dark:text-white/40 rounded-md">ID #{entry.tokenId}</span>
					</p>
					<p className="text-xs text-midnight/70 dark:text-white/40 truncate flex items-center gap-1 font-mono">
						Uploader: {entry.uploaderAddress.slice(0, 12)}...{entry.uploaderAddress.slice(-8)}
						<a href={`${EXPLORER_URL}/address/${entry.uploaderAddress}`} target="_blank" className="hover:text-lavender transition-colors" title="View on CardanoScan">
							<IconExternalLink size={10} />
						</a>
					</p>
				</div>
			</div>
			<div className="text-right flex-shrink-0">
				<p className="font-bold font-mono text-pink-600 dark:text-cyber-pink">{entry.myEarnings} ADA</p>
				<p className="text-xs text-midnight/70 dark:text-white/40 font-bold">{entry.shares}% Share • {entry.mintCount} Sales</p>
			</div>
		</div>
	)
}
