'use client'

import React, { useState, useEffect } from 'react'
import { IconPlayerPlay, IconHeadphones, IconTrophy, IconTrendingUp } from '@tabler/icons-react'
import { useAudio } from '@/components/AudioProvider'
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
					<div key={i} className="h-16 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none" />
				))}
			</div>
		)
	}

	if (tracks.length === 0) {
		return (
			<div className="p-8 text-center bg-midnight/5 dark:bg-white/5 border border-dashed border-midnight/10 dark:border-white/10 rounded-none">
				<IconTrendingUp className="w-8 h-8 mx-auto mb-2 text-midnight/50 dark:text-white/20" />
				<p className="text-midnight/70 dark:text-white/40 text-sm">No streaming data yet for this month.</p>
			</div>
		)
	}

	return (
		<div className="space-y-3 relative">
			{/* Rank Header */}
			<div className="flex items-center justify-between px-4 mb-2">
				<span className="text-[10px] font-bold uppercase tracking-widest text-midnight/60 dark:text-white/30">Rank / Track</span>
				<span className="text-[10px] font-bold uppercase tracking-widest text-midnight/60 dark:text-white/30">Streams</span>
			</div>

			<div className="space-y-2">
				{tracks.map((track, index) => {
					const isPlaying = playerState.currentTrack?.id === track.token_id && playerState.isPlaying
					const isCurrent = playerState.currentTrack?.id === track.token_id

					return (
						<div
							key={track.token_id}
							className={cn(
								"group flex items-center gap-4 p-3 transition-all relative overflow-hidden",
								"bg-white/[0.03] hover:bg-midnight/5 dark:hover:bg-white/5 border border-white/[0.05] hover:border-lavender/30",
								isCurrent && "bg-lavender/10 border-lavender/40"
							)}
						>
							{/* Rank Number */}
							<div className="w-8 text-center shrink-0">
								{index === 0 ? (
									<IconTrophy size={18} className="text-yellow-400 mx-auto" />
								) : (
									<span className={cn(
										"text-lg font-bold italic",
										index < 3 ? "text-midnight/80 dark:text-white/80" : "text-midnight/60 dark:text-white/30"
									)}>
										{index + 1}
									</span>
								)}
							</div>

							{/* Cover Art */}
							<div className="relative w-12 h-12 shrink-0 group/cover">
								<img
									src={track.image_url}
									alt={track.name}
									className="w-full h-full object-cover rounded-none"
								/>
								<button
									onClick={() => handlePlayTrack({
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
									})))}
									title="Play Track"
									className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity"
								>
									<IconPlayerPlay size={20} className={cn("text-midnight dark:text-white fill-midnight dark:fill-white", isPlaying && "animate-pulse")} />
								</button>
							</div>

							{/* Meta */}
							<div className="flex-1 min-w-0">
								<h5 className={cn(
									"font-bold truncate text-sm transition-colors",
									isCurrent ? "text-lavender" : "text-midnight/90 dark:text-white/90 group-hover:text-midnight dark:hover:text-white"
								)}>
									{track.name}
								</h5>
								<p className="text-xs text-midnight/50 dark:text-white/50 truncate">{track.artist}</p>
							</div>

							{/* Stats */}
							<div className="flex items-center gap-2 pr-2">
								<IconHeadphones size={14} className="text-cyber-pink/60" />
								<span className="text-sm font-mono font-bold text-cyber-pink">
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
