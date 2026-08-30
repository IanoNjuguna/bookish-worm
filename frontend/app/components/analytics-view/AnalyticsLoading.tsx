import { IconLoader2 } from '@tabler/icons-react'

export function AnalyticsLoading() {
	return (
		<div className="flex flex-col items-center justify-center p-12 md:p-24 space-y-4">
			<IconLoader2 size={32} className="animate-spin text-pink-600 dark:text-cyber-pink" />
			<p className="text-midnight/60 dark:text-white/50 italic text-sm">Aggregating artist data...</p>
		</div>
	)
}
