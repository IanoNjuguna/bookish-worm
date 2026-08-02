'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { IconPlayerPlay, IconPlayerPause, IconArrowLeft, IconShare, IconCopy, IconHeart, IconLoader2, IconSquareCheckFilled } from '@tabler/icons-react'
import { DobaVisualizer } from '@/components/icons/DobaVisualizer'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAudio } from '@/components/AudioProvider'
import { useCardano } from '@/components/Providers'
import { EXPLORER_URL } from '@/lib/config'
import { logger } from '@/lib/logger'
import { buyFractionOnChain, formatTxError } from '@/lib/contractHelper'

const formatTokenId = (id: string | number) => {
	const s = String(id)
	if (s.length <= 10) return s
	return `${s.slice(0, 4)}...${s.slice(-4)}`
}

const API_URL = '/api-backend'

interface Track {
	token_id: number
	name: string
	artist: string
	image_url: string
	audio_url: string
	streaming_url?: string
	genre?: string
	price?: string
	description?: string
	chain_id?: string
	max_supply?: string
	uploader_address?: string
	is_owned?: boolean
	mint_count?: number
	splitter?: string
	ticker?: string
	album_id?: number | null
}

export default function TrackDetailPage() {
	const params = useParams()
	const router = useRouter()
	const id = params?.id as string

	const [track, setTrack] = useState<Track | null>(null)
	const [loading, setLoading] = useState(true)
	const [isMinting, setIsMinting] = useState(false)
	const [hasOwned, setHasOwned] = useState(false)

	const { playerState, handlePlayTrack, getValidToken, login, isAuthenticated, accessToken } = useAudio()
	const { address, isConnected, lucid } = useCardano()

	const isPlaying = playerState.currentTrack?.id === track?.token_id && playerState.isPlaying



	// Fetch track data
	const fetchTrack = async () => {
		if (!id) return
		try {
			const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
			const headers: Record<string, string> = {}
			if (authData) {
				const parsedAuth = JSON.parse(authData)
				if (parsedAuth && parsedAuth.accessToken) {
					headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`
				}
			}
			const res = await fetch(`${API_URL.replace(/\/$/, '')}/songs/${id}`, { headers })
			if (res.ok) {
				const data = await res.json()
				setTrack(data)
				setHasOwned(!!data.is_owned)
			}
		} catch (e) {
			console.error('Failed to fetch track', e)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchTrack()
	}, [id, address])

	const resolveIpfs = (url: string) =>
		(url || '').replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/')

	const togglePlay = () => {
		if (!track) return
		handlePlayTrack({
			id: track.token_id,
			title: track.name,
			creator: track.artist,
			cover: track.image_url,
			url: track.streaming_url || track.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
			collaborators: 0,
			genre: track.genre,
			description: track.description,
			uploader_address: track.uploader_address
		})
	}

	const handleMint = async () => {
		if (!isAuthenticated) {
			login()
			return
		}

		const suppressToasts = hasOwned

		if (!address) {
			if (!suppressToasts) {
				toast.error("Please connect your Cardano wallet first")
			}
			return
		}
		if (!track || !track.uploader_address) {
			if (!suppressToasts) {
				toast.error("Track creator address not found")
			}
			return
		}

		const priceInADA = track.price || '5'
		const priceInLovelace = BigInt(Math.floor(parseFloat(priceInADA) * 1000000))

		setIsMinting(true)
		let mainToast: string | number | undefined = undefined
		if (!suppressToasts) {
			mainToast = toast.loading(`Collecting "${track.name}"...`)
		}

		try {
			if (!lucid) throw new Error("Cardano wallet not connected or initialized")

			if (mainToast) {
				toast.loading(`Creating, signing and submitting transaction...`, { id: mainToast })
			}
			const txHash = await buyFractionOnChain(lucid, {
				token_id: track.token_id,
				uploader_address: track.uploader_address
			})

			if (mainToast) {
				toast.loading(`Confirming transaction on-chain...`, { id: mainToast })
			}
			await lucid.awaitTx(txHash)

			setHasOwned(true)
			if (mainToast) {
				toast.success(
					<div className="flex flex-col gap-1">
						<p className="font-bold">"{track.name}" collected!</p>
						<a
							href={`${EXPLORER_URL}/tx/${txHash}`}
							target="_blank"
							className="text-[10px] text-cyber-pink hover:underline flex items-center gap-1"
						>
							View on Explorer
						</a>
					</div>,
					{ id: mainToast }
				)
			}

			// Record mint in backend
			try {
				const token = await getValidToken()
				if (token) {
					await fetch(`${API_URL.replace(/\/$/, '')}/mints`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({
							track_id: track.token_id,
							tx_hash: txHash
						})
					})
					// Refresh track info to update mint counts
					fetchTrack()
				}
			} catch (err) {
				logger.error('TrackDetailPage: Failed to record mint in backend', err)
			}
		} catch (error: any) {
			logger.error('Mint Error', error)
			if (mainToast) {
				toast.error(formatTxError(error), { id: mainToast })
			}
		} finally {
			setIsMinting(false)
		}
	}

	const handleShare = () => {
		const text = `Check out "${track?.name}" by ${track?.artist} on Doba! 🎵`
		const embedUrl = `https://doba.world`
		const warpcastIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrl)}`
		window.open(warpcastIntentUrl, '_blank')
	}

	const handleCopyLink = () => {
		navigator.clipboard.writeText(window.location.href)
		toast.success('Link copied to clipboard!')
	}

	const handleDownload = async () => {
		if (!address || !hasOwned || !track) {
			return
		}

		const mainToast = toast.loading(`Preparing download...`)

		try {
			const token = await getValidToken()

			if (!token) throw new Error("Authentication failed. Please try logging in again.")

			const response = await fetch(`/api-backend/songs/${track.token_id}/download`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: "Download failed" }))
				throw new Error(errorData.message || "Failed to download file")
			}

			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)

			const a = document.createElement('a')
			a.href = url
			a.download = `${track.artist} - ${track.name}.mp3`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)

			toast.success("Download started!", { id: mainToast })
		} catch (error: any) {
			toast.error(error.message || "Download failed", { id: mainToast })
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-transparent flex items-center justify-center">
				<IconLoader2 size={32} className="animate-spin text-cyber-pink" />
			</div>
		)
	}

	if (!track) {
		return (
			<div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-4">
				<p className="text-midnight/70 dark:text-white/40">Track not found</p>
				<button onClick={() => router.back()} className="text-cyber-pink text-sm underline">Go back</button>
			</div>
		)
	}

	const mintCount = track.mint_count || 0
	const maxSupply = track.max_supply ? parseInt(track.max_supply) : 5000

	return (
		<div className={cn(
			"min-h-screen bg-transparent text-midnight dark:text-white",
			playerState.currentTrack ? "pb-32 lg:pb-0" : ""
		)}>
			{/* Back Button & Chain Badge */}
			<div className="mb-6 flex items-center justify-between">
				<button
					onClick={() => router.back()}
					className="p-2 bg-midnight/5 dark:bg-white/5 hover:bg-midnight/10 dark:hover:bg-white/10 rounded-full text-midnight dark:text-white transition-colors"
				>
					<IconArrowLeft size={20} />
				</button>
				<div className="flex items-center gap-2 bg-midnight/5 dark:bg-white/5 rounded-full px-3 py-1 border border-midnight/10 dark:border-white/10">
					<span className="text-[10px] font-bold text-[#FF1F8A] uppercase tracking-wider font-mono">CARDANO PREPROD</span>
				</div>
			</div>

			{/* Main Track Header - Split Layout */}
			<div className="flex flex-col md:flex-row gap-8 items-start mb-8">
				{/* Left Side: Artwork with Play Button overlay */}
				<div className="relative group aspect-square w-full max-w-[320px] mx-auto md:mx-0 flex-shrink-0 border border-midnight/10 dark:border-white/10 bg-midnight/5 dark:bg-white/5">
					<img
						src={resolveIpfs(track.image_url)}
						alt={track.name}
						className="w-full h-full object-cover"
					/>
					{/* Play/Pause Hover Overlay */}
					<button
						onClick={togglePlay}
						className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					>
						<div className="w-16 h-16 rounded-full bg-white flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
							{isPlaying ? (
								<IconPlayerPause size={32} className="fill-black text-black ml-0" />
							) : (
								<IconPlayerPlay size={32} className="fill-black text-black ml-1" />
							)}
						</div>
					</button>
				</div>

				{/* Right Side: Track Info & Collect Action */}
				<div className="flex-1 w-full flex flex-col justify-between min-h-[320px]">
					<div>
						{/* Genre & Token ID tags */}
						<div className="flex items-center gap-2 mb-3">
							<span className="text-[9px] font-bold text-cyber-pink bg-cyber-pink/10 border border-cyber-pink/20 px-2 py-0.5 uppercase tracking-widest">
								{track.genre || 'RARE'}
							</span>
							<span className="text-[9px] font-bold text-midnight/60 dark:text-white/30 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 px-2 py-0.5 uppercase tracking-widest">
								#{formatTokenId(track.token_id)}
							</span>
						</div>

						{/* Title & Artist */}
						<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-midnight dark:text-white mb-2">
							{track.name}
						</h1>
						<p className="text-base text-midnight/60 dark:text-white/50 font-medium tracking-wide mb-6">
							{track.artist}
						</p>
					</div>

					{/* Pricing & Mint Card */}
					<div className="w-full mt-2">
						<div className="flex items-center justify-between mb-4">
							{hasOwned ? (
								<div className="flex items-center gap-1.5 text-green-500 text-sm font-bold font-mono">
									<IconSquareCheckFilled size={18} />
									COLLECTED
								</div>
							) : (
								<div>
									<p className="text-[10px] uppercase tracking-wider text-midnight/40 dark:text-white/35 font-bold mb-0.5">Price</p>
									<span className="text-2xl font-extrabold text-cyber-pink font-mono">{track.price || '5'} ADA</span>
								</div>
							)}

							<div className="text-right">
								<p className="text-[10px] uppercase tracking-wider text-midnight/40 dark:text-white/35 font-bold mb-1">Mints</p>
								<div className="text-sm font-mono font-bold flex items-center gap-1.5 justify-end">
									<span className="text-midnight dark:text-white">{mintCount.toLocaleString()}</span>
									<span className="text-midnight/30 dark:text-white/20">/</span>
									<span className="text-midnight/60 dark:text-white/50">{maxSupply.toLocaleString()}</span>
								</div>
							</div>
						</div>

						{/* Scarcity Progress Bar */}
						{maxSupply > 0 && (
							<div className="w-full h-1.5 bg-midnight/5 dark:bg-white/5 rounded-full overflow-hidden border border-white/5 mb-6">
								<div
									className="h-full bg-cyber-pink shadow-[0_0_10px_rgba(255,31,138,0.5)] transition-all duration-1000 ease-out"
									style={{
										width: `${Math.max(2, Math.min(100, (mintCount / maxSupply) * 100))}%`
									}}
								/>
							</div>
						)}

						{/* Collect / Share / Copy Buttons */}
						<div className="flex items-center gap-3">
							<button
								onClick={handleMint}
								disabled={isMinting || (maxSupply > 0 && mintCount >= maxSupply) || hasOwned}
								className={cn(
									"flex-[3] h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all rounded-sm",
									(maxSupply > 0 && mintCount >= maxSupply)
										? "bg-[#FF1F8A]/10 text-[#FF1F8A] border border-[#FF1F8A]/20 cursor-not-allowed"
										: hasOwned
											? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
											: "bg-[#B794F4] hover:bg-[#B794F4]/80 text-black border border-[#B794F4]/20",
									isMinting && "opacity-50 cursor-not-allowed"
								)}
							>
								{isMinting ? (
									<IconLoader2 size={18} className="animate-spin" />
								) : (maxSupply > 0 && mintCount >= maxSupply) ? (
									<DobaVisualizer size={18} className="text-[#FF1F8A]" />
								) : hasOwned ? (
									<IconSquareCheckFilled size={18} />
								) : (
									<IconHeart size={18} />
								)}
								{isMinting ? 'Collecting' : (maxSupply > 0 && mintCount >= maxSupply) ? 'SOLD OUT' : hasOwned ? 'Collected' : 'Collect'}
							</button>

							<button
								onClick={handleShare}
								className="w-12 h-12 flex items-center justify-center border border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5 rounded-sm"
								title="Share"
							>
								<IconShare size={18} className="text-midnight/60 dark:text-white/60" />
							</button>

							<button
								onClick={handleCopyLink}
								className="w-12 h-12 flex items-center justify-center border border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5 rounded-sm"
								title="Copy Link"
							>
								<IconCopy size={18} className="text-midnight/60 dark:text-white/60" />
							</button>
						</div>

						{/* Download Button */}
						{hasOwned && (
							<button
								onClick={handleDownload}
								className="w-full mt-3 h-11 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all bg-[#B794F4] hover:bg-[#B794F4]/80 text-black border border-[#B794F4]/20 rounded-sm"
							>
								Download Track
							</button>
						)}

						{/* Collect More Section if Owned */}
						{hasOwned && !(maxSupply > 0 && mintCount >= maxSupply) && (
							<div className="mt-4 flex flex-col gap-2 border-t border-midnight/10 dark:border-white/5 pt-4">
								<p className="text-[10px] italic text-midnight/50 dark:text-white/40 text-center">
									You can collect another song token to support the artist
								</p>
								<button
									type="button"
									onClick={handleMint}
									disabled={isMinting || (maxSupply > 0 && mintCount >= maxSupply)}
									className={cn(
										"w-full h-10 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm border",
										(maxSupply > 0 && mintCount >= maxSupply)
											? "bg-[#FF1F8A]/10 text-[#FF1F8A] border-[#FF1F8A]/20 cursor-not-allowed"
											: "bg-midnight/5 dark:bg-white/5 hover:bg-midnight dark:hover:bg-white text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white border-midnight/10 dark:border-white/10"
									)}
								>
									{isMinting && <IconLoader2 size={14} className="animate-spin" />}
									{(maxSupply > 0 && mintCount >= maxSupply) ? 'SOLD OUT' : 'Collect More'}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Grid: Lyrics/Description & Blockchain Details */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-midnight/10 dark:border-white/5">
				{/* Left 2/3: Description / Lyrics */}
				<div className="lg:col-span-2 space-y-4">
					<h2 className="text-xs font-bold uppercase tracking-widest text-midnight/40 dark:text-white/30">
						Lyrics / Description
					</h2>
					{track.description ? (
						<p className="text-sm text-midnight/80 dark:text-white/80 leading-relaxed whitespace-pre-line">
							{track.description}
						</p>
					) : (
						<p className="text-sm text-midnight/40 dark:text-white/40 italic">
							No description or lyrics provided for this track.
						</p>
					)}
				</div>

				{/* Right 1/3: Blockchain Details */}
				<div className="space-y-4">
					<h2 className="text-xs font-bold uppercase tracking-widest text-midnight/40 dark:text-white/30">
						Blockchain Details
					</h2>
					<div className="space-y-5 pt-2">
						<div>
							<p className="text-[10px] uppercase tracking-widest text-midnight/40 dark:text-white/35 font-bold mb-1.5">Policy ID</p>
							{(() => {
								const policyId = track.splitter || process.env.NEXT_PUBLIC_MINTING_POLICY_ID;
								return policyId ? (
									<a
										href={`${EXPLORER_URL}/tokenPolicy/${policyId}`}
										target="_blank"
										rel="noreferrer"
										className="text-xs text-cyber-pink hover:underline font-mono block truncate"
									>
										{policyId.slice(0, 10)}...{policyId.slice(-10)}
									</a>
								) : (
									<span className="text-xs text-midnight/40 dark:text-white/30 font-mono">N/A</span>
								);
							})()}
						</div>

						<div>
							<p className="text-[10px] uppercase tracking-widest text-midnight/40 dark:text-white/35 font-bold mb-1.5">Creator Address</p>
							{track.uploader_address ? (
								<a
									href={`${EXPLORER_URL}/address/${track.uploader_address}`}
									target="_blank"
									rel="noreferrer"
									className="text-xs text-cyber-pink hover:underline font-mono block truncate"
								>
									{track.uploader_address.slice(0, 12)}...{track.uploader_address.slice(-10)}
								</a>
							) : (
								<span className="text-xs text-midnight/40 dark:text-white/30 font-mono">N/A</span>
							)}
						</div>

						<div>
							<p className="text-[10px] uppercase tracking-widest text-midnight/40 dark:text-white/35 font-bold mb-1.5">Provenance</p>
							{(() => {
								const policyId = track.splitter;
								if (policyId) {
									const targetTokenId = track.album_id ? track.album_id : track.token_id;
									const tokenNameStr = track.ticker
										? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "")
										: 'T' + String(targetTokenId).slice(-11);
									const toHex = (str: string) => Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
									const assetNameHex = toHex(tokenNameStr);
									const assetUnit = policyId + '000643b0' + assetNameHex;
									return (
										<a
											href={`${EXPLORER_URL}/token/${assetUnit}`}
											target="_blank"
											rel="noreferrer"
											className="text-xs text-cyber-pink hover:underline font-mono block truncate"
										>
											{tokenNameStr} (Reference NFT)
										</a>
									);
								}
								return <span className="text-xs text-midnight/40 dark:text-white/30 font-mono">N/A</span>;
							})()}
						</div>

						<div>
							<p className="text-[10px] uppercase tracking-widest text-midnight/40 dark:text-white/35 font-bold mb-1.5">Token ID</p>
							{track.token_id !== undefined ? (
								<span className="text-xs text-cyber-pink font-mono block">
									#{track.token_id}
								</span>
							) : (
								<span className="text-xs text-midnight/40 dark:text-white/30 font-mono">N/A</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
