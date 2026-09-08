'use client'

import { useTranslations } from 'next-intl'
import { useEarningsView } from './earnings-view/useEarningsView'
import { EarningsDisconnected } from './earnings-view/EarningsDisconnected'
import { EarningsHeader } from './earnings-view/EarningsHeader'
import { EarningsMetrics } from './earnings-view/EarningsMetrics'
import { EarningsSplitsList } from './earnings-view/EarningsSplitsList'

export default function EarningsView() {
	const t = useTranslations('earnings')
	const { isConnected, loading, royaltyTracks, balance, lifetimeEarnings, fetchEarnings } = useEarningsView()

	const title = t('title') || 'Earnings & Splits'
	const subtitle = t('subtitle') || 'View splits and track your Cardano royalties.'

	if (!isConnected) {
		return (
			<EarningsDisconnected
				title={title}
				subtitle={subtitle}
				signInToView={t('signInToView') || 'Connect Your Wallet'}
				connectToSee={t('connectToSee') || 'Please connect your Cardano wallet to view your real-time earnings, splits, and sales.'}
			/>
		)
	}

	return (
		<div className="space-y-6 animate-fade-in">
			<EarningsHeader title={title} subtitle={subtitle} loading={loading} onRefresh={fetchEarnings} />
			<EarningsMetrics lifetimeEarnings={lifetimeEarnings} balance={balance} />
			<EarningsSplitsList loading={loading} tracks={royaltyTracks} />
		</div>
	)
}
