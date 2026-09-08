import React from 'react'
import { IconWallet } from '@tabler/icons-react'

export function DepositConnectWallet() {
	return (
		<div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
			<IconWallet className="w-16 h-16 text-midnight/50 dark:text-white/20 mb-4" />
			<h2 className="text-xl font-bold text-midnight dark:text-white mb-2">Connect your wallet</h2>
			<p className="text-midnight/60 dark:text-white/60">Please connect your wallet to view your deposit address.</p>
		</div>
	)
}
