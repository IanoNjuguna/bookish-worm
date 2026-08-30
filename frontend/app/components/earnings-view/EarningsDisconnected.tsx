import { IconCurrencyDollar as DollarSign } from '@tabler/icons-react'

interface EarningsDisconnectedProps {
	title: string
	subtitle: string
	signInToView: string
	connectToSee: string
}

export function EarningsDisconnected({ title, subtitle, signInToView, connectToSee }: EarningsDisconnectedProps) {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold mb-2">{title}</h2>
				<p className="text-midnight/60 dark:text-white/60">{subtitle}</p>
			</div>
			<div className="border border-midnight/[0.08] dark:border-white/[0.08] rounded-2xl p-12 text-center bg-background dark:bg-midnight/60 shadow-xl">
				<div className="w-16 h-16 rounded-2xl mx-auto mb-6 bg-cyber-pink/10 border border-cyber-pink/20 flex items-center justify-center text-cyber-pink rounded-md">
					<DollarSign size={32} />
				</div>
				<h3 className="text-xl font-bold mb-2">{signInToView}</h3>
				<p className="text-midnight/50 dark:text-white/50 text-sm max-w-sm mx-auto">{connectToSee}</p>
			</div>
		</div>
	)
}
