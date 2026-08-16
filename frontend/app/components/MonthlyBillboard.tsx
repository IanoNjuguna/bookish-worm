'use client'

import React, { useState, useEffect } from 'react'
import { IconPlayerPlay, IconPlayerPause, IconHeadphones, IconTrophy, IconTrendingUp } from '@tabler/icons-react'
import { useAudio } from '@/components/AudioProvider'
import { useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface Track {
	token_id: number
	name: string
	artist: string
	image_url: string
	streaming_url?: string
	audio_url: string
	play_count?: number
	uploader_address?: string
}

interface MonthlyBillboardProps {
	address: string
}

export default function MonthlyBillboard({ address }: MonthlyBillboardProps) {
	const [tracks, setTracks] = useState<Track[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const { handlePlayTrack, playerState } = useAudio()
	const router = useRouter()
	const locale = useLocale()

	useEffect(() => {
		async function fetchBillboard() {
			try {
				const res = await fetch(`/api-backend/analytics/billboard/${address}`)
				if (res.ok) {
					const data = await res.json()
					setTracks(data)
				}
			} catch (err) {
				logger.error('Failed to fetch billboard', err)
			} finally {
				setIsLoading(false)
			}
		}

		if (address) {
			fetchBillboard()
		}
	}, [address])

	if (isLoading) {
		return (
			<div className="space-y-4 animate-pulse">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="h-16 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-md" />
				))}
			</div>
		)
	}

	if (tracks.length === 0) {
		return (
			<div className="p-8 text-center bg-midnight/5 dark:bg-white/5 border border-dashed border-midnight/10 dark:border-white/10 rounded-md">
				<IconTrendingUp className="w-8 h-8 mx-auto mb-2 text-midnight/50 dark:text-white/20" />
				<p className="text-midnight/70 dark:text-white/40 text-sm">No streaming data yet for this month.</p>
			</div>
		)
	}

	return (
		<div className="glass-surface rounded-2xl p-3 sm:p-5 border border-midnight/[0.08] dark:border-white/[0.08] shadow-xl">
			{/* Rank Header */}
			<div className="flex items-center justify-between px-2 sm:px-3 mb-3 sm:mb-4">
				<span className="text-[10px] font-bold uppercase tracking-widest text-midnight/60 dark:text-white/30">Rank / Track</span>
				<span className="text-[10px] font-bold uppercase tracking-widest text-midnight/60 dark:text-white/30">Streams</span>
			</div>

			<div className="space-y-2 sm:space-y-3">
				{tracks.map((track, index) => {
					const isPlaying = playerState.currentTrack?.id === track.token_id && playerState.isPlaying
					const isCurrent = playerState.currentTrack?.id === track.token_id

					return (
						<div
							key={track.token_id}
							onClick={() => router.push(`/${locale}/track/${track.token_id}`)}
							className={cn(
								"group flex items-center gap-2 sm:gap-4 p-2 sm:p-3 transition-all relative overflow-hidden rounded-xl cursor-pointer",
								"bg-midnight/[0.02] dark:bg-white/[0.02] hover:bg-midnight/5 dark:hover:bg-white/5 border border-midnight/[0.06] dark:border-white/[0.06] hover:border-lavender/30",
								isCurrent && "bg-lavender/10 border-lavender/40"
							)}
						>
							{/* Rank Number */}
							<div className="w-6 sm:w-8 text-center shrink-0">
								{index === 0 ? (
									<IconTrophy size={16} className="text-yellow-400 mx-auto sm:hidden" />
								) : (
									<span className={cn(
										"text-base sm:text-lg font-bold italic",
										index < 3 ? "text-midnight/80 dark:text-white/80" : "text-midnight/60 dark:text-white/30"
									)}>
										{index + 1}
									</span>
								)}
								{index === 0 && (
									<IconTrophy size={18} className="text-yellow-400 mx-auto hidden sm:block" />
								)}
							</div>

							{/* Cover Art */}
							<div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 group/cover rounded-lg overflow-hidden">
								<img
									src={(track.image_url || '').replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/')}
									alt={track.name}
									className="w-full h-full object-cover rounded-lg"
								/>
								<button
									onClick={(e) => {
										e.stopPropagation()
										handlePlayTrack({
										id: track.token_id,
										title: track.name,
										creator: track.artist,
										cover: track.image_url,
										url: track.streaming_url || track.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
										collaborators: 0,
										uploader_address: track.uploader_address
									}, tracks.map(t => ({
										id: t.token_id,
										title: t.name,
										creator: t.artist,
										cover: t.image_url,
										url: t.streaming_url || t.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
										collaborators: 0,
										uploader_address: t.uploader_address
									})))
									}}
									title="Play Track"
									className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity"
								>
									<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white flex items-center justify-center shadow-lg">
										{isPlaying ? (
											<IconPlayerPause size={16} className="fill-black text-black" />
										) : (
											<IconPlayerPlay size={16} className="fill-black text-black ml-0.5" />
										)}
									</div>
								</button>
							</div>

							{/* Meta */}
							<div className="flex-1 min-w-0">
								<h5 className={`font-bold truncate text-xs sm:text-sm transition-colors ${isCurrent ? 'text-lavender' : 'text-midnight dark:text-white group-hover:text-pink-600 dark:group-hover:text-cyber-pink'}`}>
									{track.name}
								</h5>
								<p className="text-[10px] sm:text-xs text-midnight/70 dark:text-white/70 truncate">{track.artist}</p>
							</div>

							{/* Stats */}
							<div className="flex items-center gap-1.5 sm:gap-2 pr-1 sm:pr-2">
								<IconHeadphones size={12} className="text-pink-600/60 dark:text-cyber-pink/60 sm:hidden" />
								<IconHeadphones size={14} className="text-pink-600/60 dark:text-cyber-pink/60 hidden sm:block" />
								<span className="text-xs sm:text-sm font-mono font-bold text-pink-600 dark:text-cyber-pink">
									{track.play_count || 0}
								</span>
							</div>

							{/* Progress bar if current */}
							{isCurrent && (
								<div className="absolute bottom-0 left-0 h-[2px] bg-lavender animate-pulse w-full" />
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
