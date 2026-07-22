'use client'

import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import { IconTrendingUp, IconCurrencyDollar as DollarSign, IconExternalLink, IconMusic } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { useCardano } from '@/components/Providers'
import { useAudio } from '@/components/AudioProvider'
import { EXPLORER_URL } from '@/lib/config'
import { toast } from 'sonner'

interface Track {
	token_id: number
	name: string
	artist: string
	price: string
	max_supply: string
	mint_count?: number
	uploader_address: string
}

interface RoyaltyEntry {
	track: string
	tokenId: number
	price: string
	mintCount: number
	shares: number
	myEarnings: string
	uploaderAddress: string
}

export default function EarningsView() {
	const t = useTranslations('earnings')
	const { address, isConnected, lucid } = useCardano()
	const { effectiveAddress } = useAudio()
	const [loading, setLoading] = useState(false)
	const [royaltyTracks, setRoyaltyTracks] = useState<RoyaltyEntry[]>([])
	const [totalPending, setTotalPending] = useState('0.00')
	const [balance, setBalance] = useState('0.00')
	const [lifetimeEarnings, setLifetimeEarnings] = useState('0.00')

	const fetchEarnings = async () => {
		if (!isConnected || !address) return
		setLoading(true)
		try {
			// Get current wallet balance
			if (lucid) {
				const wallet = typeof lucid.wallet === 'function' ? lucid.wallet() : lucid.wallet
				let lovelace = 0n

				if (wallet && typeof wallet.getUtxos === 'function') {
					const utxos = (await wallet.getUtxos()) || []
					lovelace = utxos.reduce(
						(total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
						0n
					)
				} else if (wallet && typeof wallet.getLovelace === 'function') {
					lovelace = BigInt(await wallet.getLovelace())
				} else if (typeof lucid.utxosAt === 'function' && address) {
					const utxos = (await lucid.utxosAt(address)) || []
					lovelace = utxos.reduce(
						(total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
						0n
					)
				}

				setBalance((Number(lovelace) / 1000000).toFixed(2))
			}

			// 1. Fetch all tracks
			const res = await fetch('/api-backend/songs')
			if (!res.ok) throw new Error('Failed to fetch songs')
			const tracks: Track[] = await res.json()

			const entries: RoyaltyEntry[] = []
			let totalEarned = 0

			// 2. Fetch collaborators for each track to check if user has splits
			for (const track of tracks) {
				try {
					const collabRes = await fetch(`/api-backend/songs/${track.token_id}/collaborators`)
					if (!collabRes.ok) continue
					const collaborators = await collabRes.json()

					// Check if user is either the uploader (owner) or in the collaborators list (checking both payment and stake address formats)
					const isUploader = track.uploader_address && (
						(address && track.uploader_address.toLowerCase() === address.toLowerCase()) ||
						(effectiveAddress && track.uploader_address.toLowerCase() === effectiveAddress.toLowerCase())
					)
					const collabEntry = collaborators.find((c: any) => c.wallet_address && (
						(address && c.wallet_address.toLowerCase() === address.toLowerCase()) ||
						(effectiveAddress && c.wallet_address.toLowerCase() === effectiveAddress.toLowerCase())
					))

					if (isUploader || collabEntry) {
						// Calculate split percentage
						let shares = 0
						if (collabEntry) {
							shares = collabEntry.split_percentage
						} else {
							// If they are uploader, their share is 100% minus collaborator splits
							const totalCollabSplits = collaborators.reduce((acc: number, curr: any) => acc + curr.split_percentage, 0)
							shares = Math.max(0, 100 - totalCollabSplits)
						}

						const priceNum = parseFloat(track.price || '5')
						const mintCount = track.mint_count || 0
						const myEarnings = ((priceNum * mintCount * shares) / 100).toFixed(2)

						entries.push({
							track: track.name,
							tokenId: track.token_id,
							price: track.price || '5',
							mintCount,
							shares,
							myEarnings,
							uploaderAddress: track.uploader_address
						})

						totalEarned += parseFloat(myEarnings)
					}
				} catch (err) {
					console.warn(`Failed to fetch collaborators for track ${track.token_id}`, err)
				}
			}

			setRoyaltyTracks(entries)
			setLifetimeEarnings(totalEarned.toFixed(2))
		} catch (error) {
			logger.error('Error fetching earnings', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchEarnings()
		const interval = setInterval(fetchEarnings, 30000)
		return () => clearInterval(interval)
	}, [isConnected, address, lucid])

	if (!isConnected) {
		return (
			<div className="space-y-6">
				<div>
					<h2 className="text-2xl font-bold mb-2">{t('title') || 'Earnings & Splits'}</h2>
					<p className="text-midnight/60 dark:text-white/60">{t('subtitle') || 'View splits and track your Cardano royalties.'}</p>
				</div>
				<div className="border border-midnight/[0.08] dark:border-white/[0.08] rounded-none p-12 text-center bg-[#FAF9F6] dark:bg-[#0D0D12]/60">
					<div className="w-16 h-16 rounded-none mx-auto mb-6 bg-cyber-pink/10 border border-cyber-pink/20 flex items-center justify-center text-cyber-pink clip-diamond">
						<DollarSign size={32} />
					</div>
					<h3 className="text-xl font-bold mb-2">{t('signInToView') || 'Connect Your Wallet'}</h3>
					<p className="text-midnight/50 dark:text-white/50 text-sm max-w-sm mx-auto">{t('connectToSee') || 'Please connect your Cardano wallet to view your real-time earnings, splits, and sales.'}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6 animate-fade-in">
			<div className="flex justify-between items-end">
				<div>
					<h2 className="text-2xl font-bold mb-2">{t('title') || 'Earnings & Splits'}</h2>
					<p className="text-midnight/60 dark:text-white/60">{t('subtitle') || 'View splits and track your Cardano royalties.'}</p>
				</div>
				<button
					onClick={fetchEarnings}
					className="text-xs text-[#B794F4] hover:underline"
					disabled={loading}
				>
					{loading ? 'Refreshing...' : 'Refresh Data'}
				</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{/* Lifetime Earnings */}
				<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-6 bg-[#FAF9F6] dark:bg-[#0D0D12]/60 relative overflow-hidden group">
					<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-pink to-transparent" />
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-midnight/60 dark:text-white/60 text-xs uppercase tracking-wider font-bold">Lifetime Sales</h3>
						<IconTrendingUp size={16} className="text-cyber-pink animate-pulse" />
					</div>
					<p className="text-3xl font-mono font-bold text-midnight dark:text-white">{lifetimeEarnings} <span className="text-sm font-sans font-normal text-midnight/50 dark:text-white/50">ADA</span></p>
					<p className="text-midnight/70 dark:text-white/40 text-[10px] mt-2 uppercase tracking-widest font-bold">Calculated from sales splits</p>
				</div>

				{/* Available ADA */}
				<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-6 bg-[#FAF9F6] dark:bg-[#0D0D12]/60 relative overflow-hidden group">
					<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-lavender to-transparent" />
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-midnight/60 dark:text-white/60 text-xs uppercase tracking-wider font-bold">Wallet Balance</h3>
						<span className="text-[10px] text-midnight/70 dark:text-white/40 font-bold uppercase">Cardano</span>
					</div>
					<p className="text-3xl font-mono font-bold text-midnight dark:text-white">{balance} <span className="text-sm font-sans font-normal text-midnight/50 dark:text-white/50">ADA</span></p>
					<p className="text-midnight/70 dark:text-white/40 text-[10px] mt-2 uppercase tracking-widest font-bold">Direct custody balance</p>
				</div>

				{/* Payout System Explanation */}
				<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-6 bg-[#FAF9F6] dark:bg-[#0D0D12]/40 flex flex-col justify-center">
					<h4 className="text-xs uppercase tracking-wider font-bold text-[#B794F4] mb-1">Instant Payouts</h4>
					<p className="text-xs text-midnight/50 dark:text-white/50 leading-relaxed">
						Payouts are executed instantly during the purchase transaction. There are no claim queues or extra gas fees to claim your splits!
					</p>
				</div>
			</div>

			<div className="border border-midnight/[0.08] dark:border-white/[0.08] overflow-hidden bg-[#FAF9F6] dark:bg-[#0D0D12]/60">
				<div className="p-6 border-b border-midnight/[0.08] dark:border-white/[0.08] flex justify-between items-center bg-white/[0.01]">
					<h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
						<span className="w-1 h-4 bg-cyber-pink"></span>
						Collaborator Splits
					</h3>
					<span className="text-[10px] text-midnight/70 dark:text-white/40 uppercase font-mono">Real-Time Split List</span>
				</div>

				<div className="divide-y divide-white/[0.08]">
					{loading && royaltyTracks.length === 0 ? (
						<div className="p-12 text-center">
							<div className="w-8 h-8 border-2 border-[#FF1F8A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
							<p className="text-midnight/70 dark:text-white/40 text-sm italic">Querying collaborator splits...</p>
						</div>
					) : royaltyTracks.length > 0 ? (
						royaltyTracks.map((entry, idx) => (
							<div key={idx} className="p-5 flex items-center justify-between hover:bg-midnight/5 dark:hover:bg-white/5 transition duration-300">
								<div className="flex-1 min-w-0 flex items-center gap-3">
									<div className="w-8 h-8 rounded-none border border-midnight/10 dark:border-white/10 flex items-center justify-center text-midnight/70 dark:text-white/40 bg-midnight/5 dark:bg-white/5 clip-diamond">
										<IconMusic size={16} />
									</div>
									<div className="min-w-0 flex-1">
										<p className="font-bold text-midnight dark:text-white flex items-center gap-2 truncate">
											{entry.track}
											<span className="text-[10px] font-mono bg-midnight/5 dark:bg-white/5 px-1.5 py-0.5 text-midnight/70 dark:text-white/40 rounded-none">ID #{entry.tokenId}</span>
										</p>
										<p className="text-xs text-midnight/70 dark:text-white/40 truncate flex items-center gap-1 font-mono">
											Uploader: {entry.uploaderAddress.slice(0, 12)}...{entry.uploaderAddress.slice(-8)}
											<a href={`${EXPLORER_URL}/address/${entry.uploaderAddress}`} target="_blank" className="hover:text-[#B794F4] transition-colors" title="View on CardanoScan">
												<IconExternalLink size={10} />
											</a>
										</p>
									</div>
								</div>
								<div className="text-right flex-shrink-0">
									<p className="font-bold font-mono text-[#FF1F8A]">{entry.myEarnings} ADA</p>
									<p className="text-xs text-midnight/70 dark:text-white/40 font-bold">{entry.shares}% Share • {entry.mintCount} Sales</p>
								</div>
							</div>
						))
					) : (
						<div className="p-12 text-center">
							<p className="text-midnight/70 dark:text-white/40 text-sm italic">You are not listed as a collaborator or owner on any tracks yet.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

