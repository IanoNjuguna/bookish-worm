import { IconLoader2 } from '@tabler/icons-react'
import type { RoyaltyEntry } from './EarningsView.types'
import { EarningsSplitRow } from './EarningsSplitRow'

interface EarningsSplitsListProps {
	loading: boolean
	tracks: RoyaltyEntry[]
}

export function EarningsSplitsList({ loading, tracks }: EarningsSplitsListProps) {
	return (
		<div id="earnings-splits-list" className="border border-midnight/[0.08] dark:border-white/[0.08] overflow-hidden bg-background dark:bg-midnight/60 rounded-2xl shadow-xl">
			<div className="p-6 border-b border-midnight/[0.08] dark:border-white/[0.08] flex justify-between items-center bg-white/[0.01]">
				<h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
					<span className="w-1 h-4 bg-pink-600 dark:bg-cyber-pink rounded-full"></span>
					Collaborator Splits
				</h3>
				<span className="text-[10px] text-midnight/70 dark:text-white/40 uppercase font-mono">Real-Time Split List</span>
			</div>

			<div className="divide-y divide-white/[0.08]">
				{loading && tracks.length === 0 ? (
					<div className="p-12 text-center">
						<IconLoader2 size={32} className="animate-spin text-pink-600 dark:text-cyber-pink mx-auto mb-4" />
						<p className="text-midnight/70 dark:text-white/40 text-sm italic">Querying collaborator splits...</p>
					</div>
				) : tracks.length > 0 ? (
					tracks.map((entry, idx) => (
						<EarningsSplitRow key={idx} entry={entry} />
					))
				) : (
					<div className="p-12 text-center">
						<p className="text-midnight/70 dark:text-white/40 text-sm italic">You are not listed as a collaborator or owner on any tracks yet.</p>
					</div>
				)}
			</div>
		</div>
	)
}
