import { IconTrendingUp } from '@tabler/icons-react'
import { FALLBACK_ERROR_MESSAGE } from './AnalyticsView.constants'

interface AnalyticsErrorProps {
	error: string | null
}

export function AnalyticsError({ error }: AnalyticsErrorProps) {
	return (
		<div className="p-12 text-center rounded-2xl bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08] shadow-xl">
			<IconTrendingUp className="w-12 h-12 mx-auto mb-4 text-midnight/50 dark:text-white/20" />
			<h3 className="text-xl font-semibold mb-2">Analytics unavailable</h3>
			<p className="text-midnight/70 dark:text-white/60 mb-6">{error || FALLBACK_ERROR_MESSAGE}</p>
		</div>
	)
}
