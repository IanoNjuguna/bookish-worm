export function SendFundsHeader() {
	return (
		<div className="flex items-center justify-between border-b border-midnight/[0.06] dark:border-white/[0.06] pb-4">
			<h3 className="text-lg font-bold text-midnight dark:text-white uppercase tracking-wider flex items-center gap-2">
				<span className="w-1.5 h-4 bg-pink-600 dark:bg-cyber-pink rounded-full" />
				Send ADA
			</h3>
			<span className="text-[10px] font-bold uppercase tracking-wider text-midnight/50 dark:text-white/40">Cardano Network</span>
		</div>
	);
}
