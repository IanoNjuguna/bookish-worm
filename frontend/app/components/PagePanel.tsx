import React from 'react'
import { cn } from '@/lib/utils'

interface PagePanelProps {
	children: React.ReactNode
	className?: string
	footer?: React.ReactNode
}

export default function PagePanel({ children, className, footer }: PagePanelProps) {
	return (
		<div
			className={cn(
				"glass-surface rounded-2xl shadow-xl p-5 sm:p-6 mt-2 flex flex-col",
				className
			)}
		>
			<div className="flex-1">{children}</div>
			{footer && (
				<div className="sticky bottom-0 mt-6 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 px-5 py-4 sm:px-6 bg-background/80 dark:bg-midnight/80 backdrop-blur-xl border-t border-midnight/10 dark:border-white/10 rounded-b-2xl">
					{footer}
				</div>
			)}
		</div>
	)
}
