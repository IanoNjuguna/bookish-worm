'use client'

import { useAnalyticsView } from './analytics-view/useAnalyticsView'
import { AnalyticsLoading } from './analytics-view/AnalyticsLoading'
import { AnalyticsError } from './analytics-view/AnalyticsError'
import { MetricsGrid } from './analytics-view/MetricsGrid'
import { PlaysChart } from './analytics-view/PlaysChart'
import { TopTracksCard } from './analytics-view/TopTracksCard'

export default function AnalyticsView() {
	const { isDark, data, loading, error } = useAnalyticsView()

	if (loading) {
		return <AnalyticsLoading />
	}

	if (error || !data) {
		return <AnalyticsError error={error} />
	}

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Metrics Row */}
			<MetricsGrid data={data} />

			{/* Charts Row */}
			<div id="analytics-charts-row" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Plays Over Time */}
				<PlaysChart playsOverTime={data.playsOverTime} isDark={isDark} />

				{/* Top Tracks */}
				<TopTracksCard topTracks={data.topTracks} />
			</div>
		</div>
	)
}
