import { IconMusic } from '@tabler/icons-react'
import type { TopTrack } from './AnalyticsView.types'

interface TopTracksCardProps {
	topTracks: TopTrack[]
}

export function TopTracksCard({ topTracks }: TopTracksCardProps) {
	return (
		<div className="bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08] p-6 rounded-2xl shadow-xl text-midnight dark:text-white relative overflow-hidden group">
			<div className="absolute top-0 right-0 w-16 h-16 bg-lavender/5 -mr-8 -mt-8 rotate-45 pointer-events-none" />
			<h3 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-tighter">
				<IconMusic size={20} className="text-lavender" />
				Top Performing Tracks
			</h3>
			<div className="space-y-4">
				{topTracks.length > 0 ? (
					topTracks.map((track, idx) => (
						<div key={track.tokenId} className="flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors group">
							<div className="flex items-center gap-3 sm:gap-4 min-w-0">
								<span className="text-midnight/70 dark:text-white/30 font-bold italic w-4 flex-shrink-0 text-xs sm:text-sm">{idx + 1}</span>
								<div className="min-w-0">
									<p className="font-semibold text-xs sm:text-sm group-hover:text-pink-600 dark:group-hover:text-cyber-pink transition-colors truncate">{track.name}</p>
									<p className="text-[9px] sm:text-[10px] text-midnight/60 dark:text-white/50 uppercase tracking-widest truncate">ID #{track.tokenId}</p>
								</div>
							</div>
							<div className="text-right flex-shrink-0 ml-4">
								<p className="font-bold text-lavender text-xs sm:text-sm font-mono whitespace-nowrap">{track.plays} plays</p>
								<div className="h-1 bg-midnight/10 dark:bg-white/10 w-12 sm:w-20 rounded-full mt-1 overflow-hidden">
									<div
										className="h-full bg-pink-600 dark:bg-cyber-pink rounded-full"
										style={{ width: `${(track.plays / (topTracks[0]?.plays || 1)) * 100}%` }}
									/>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="p-12 text-center text-midnight/60 dark:text-white/50 italic text-sm">
						No streaming data yet.
					</div>
				)}
			</div>
		</div>
	)
}
