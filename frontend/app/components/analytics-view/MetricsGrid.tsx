import { IconMusic, IconUsers, IconTrendingUp, IconHeadphones } from '@tabler/icons-react'
import type { AnalyticsData } from './AnalyticsView.types'
import { MetricCard } from './MetricCard'

interface MetricsGridProps {
	data: AnalyticsData
}

export function MetricsGrid({ data }: MetricsGridProps) {
	return (
		<div id="analytics-metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<MetricCard
				label="Total Plays"
				value={data.totalPlays.toLocaleString()}
				icon={<IconHeadphones className="text-pink-600 dark:text-cyber-pink" size={24} />}
				subtext="> 1 minute streams"
			/>
			<MetricCard
				label="Unique Listeners"
				value={data.uniqueListeners.toLocaleString()}
				icon={<IconUsers className="text-lavender" size={24} />}
				subtext="Audience reach"
			/>
			<MetricCard
				label="Total Collectors"
				value={data.totalCollectors.toLocaleString()}
				icon={<IconMusic className="text-blue-400" size={24} />}
				subtext="Owners of your work"
			/>
			<MetricCard
				label="Growth"
				value={`${data.totalPlays > 0 ? '+100%' : '0%'}`}
				icon={<IconTrendingUp className="text-green-400" size={24} />}
				subtext="Last 30 days"
			/>
		</div>
	)
}
