import { IconTrendingUp } from '@tabler/icons-react'

interface EarningsMetricsProps {
	lifetimeEarnings: string
	balance: string
}

export function EarningsMetrics({ lifetimeEarnings, balance }: EarningsMetricsProps) {
	return (
		<div id="earnings-metrics-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
			{/* Lifetime Earnings */}
			<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-6 bg-background dark:bg-midnight/60 relative overflow-hidden group rounded-2xl shadow-lg">
				<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-600 dark:from-cyber-pink to-transparent" />
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-midnight/60 dark:text-white/60 text-xs uppercase tracking-wider font-bold">Lifetime Sales</h3>
					<IconTrendingUp size={16} className="text-pink-600 dark:text-cyber-pink animate-pulse" />
				</div>
				<p className="text-3xl font-mono font-bold text-midnight dark:text-white">{lifetimeEarnings} <span className="text-sm font-sans font-normal text-midnight/50 dark:text-white/50">ADA</span></p>
				<p className="text-midnight/70 dark:text-white/40 text-[10px] mt-2 uppercase tracking-widest font-bold">Calculated from sales splits</p>
			</div>

			{/* Available ADA */}
			<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-6 bg-background dark:bg-midnight/60 relative overflow-hidden group rounded-2xl shadow-lg">
				<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-lavender to-transparent" />
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-midnight/60 dark:text-white/60 text-xs uppercase tracking-wider font-bold">Wallet Balance</h3>
					<span className="text-[10px] text-midnight/70 dark:text-white/40 font-bold uppercase">Cardano</span>
				</div>
				<p className="text-3xl font-mono font-bold text-midnight dark:text-white">{balance} <span className="text-sm font-sans font-normal text-midnight/50 dark:text-white/50">ADA</span></p>
				<p className="text-midnight/70 dark:text-white/40 text-[10px] mt-2 uppercase tracking-widest font-bold">Direct custody balance</p>
			</div>

			{/* Payout System Explanation */}
			<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-6 bg-background dark:bg-midnight/40 flex flex-col justify-center rounded-2xl shadow-lg">
				<h4 className="text-xs uppercase tracking-wider font-bold text-lavender mb-1">Instant Payouts</h4>
				<p className="text-xs text-midnight/50 dark:text-white/50 leading-relaxed">
					Payouts are executed instantly during the purchase transaction. There are no claim queues or extra gas fees to claim your splits!
				</p>
			</div>
		</div>
	)
}
