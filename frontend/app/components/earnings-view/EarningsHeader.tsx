interface EarningsHeaderProps {
	title: string
	subtitle: string
	loading: boolean
	onRefresh: () => void
}

export function EarningsHeader({ title, subtitle, loading, onRefresh }: EarningsHeaderProps) {
	return (
		<div className="flex justify-between items-end">
			<div>
				<h2 className="text-2xl font-bold mb-2">{title}</h2>
				<p className="text-midnight/60 dark:text-white/60">{subtitle}</p>
			</div>
			<button
				onClick={onRefresh}
				className="text-xs text-lavender hover:underline"
				disabled={loading}
			>
				{loading ? 'Refreshing...' : 'Refresh Data'}
			</button>
		</div>
	)
}
