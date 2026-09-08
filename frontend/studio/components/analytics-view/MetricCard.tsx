import type { ReactNode } from 'react'

interface MetricCardProps {
	label: string
	value: string
	icon: ReactNode
	subtext: string
}

export function MetricCard({ label, value, icon, subtext }: MetricCardProps) {
	return (
		<div className="bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08] p-6 rounded-2xl shadow-lg hover:border-lavender/50 transition-all group relative overflow-hidden">
			{/* Geometric Accent */}
			<div className="absolute top-0 left-0 w-1 h-full bg-lavender/0 group-hover:bg-lavender/50 transition-all" />
			<div className="absolute top-0 right-0 w-8 h-8 bg-midnight/5 dark:bg-white/5 -mr-4 -mt-4 rotate-45 transition-transform group-hover:scale-110" />

			<div className="flex items-center justify-between mb-4">
				<span className="text-midnight/70 dark:text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
				<div className="p-2 bg-midnight/5 dark:bg-white/5 group-hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors border border-white/5 rounded-lg">
					{icon}
				</div>
			</div>
			<p className="text-3xl sm:text-4xl font-black mb-1 tracking-tighter text-midnight dark:text-white font-mono">{value}</p>
			<p className="text-[9px] sm:text-[10px] text-midnight/50 dark:text-white/40 uppercase tracking-widest">{subtext}</p>
		</div>
	)
}
