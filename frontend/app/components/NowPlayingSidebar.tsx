'use client'

import React from 'react'
import { IconX, IconMicrophone, IconExternalLink, IconShare, IconCopy, IconSquareCheckFilled, IconLoader2, IconMusic } from '@tabler/icons-react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCardano } from '@/components/Providers'
import { EXPLORER_URL } from '@/lib/config'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { markCollected } from '@/lib/onboarding'
import { useAudio } from '@/components/AudioProvider'
import { buyFractionOnChain, formatTxError } from '@/lib/contractHelper'
import { IconPlayerPlay as Play, IconPlayerPause as Pause, IconPlayerSkipBack as SkipBack, IconPlayerSkipForward as SkipForward } from '@tabler/icons-react'

interface NowPlayingSidebarProps {
	track: any | null
	isVisible: boolean
	onClose: () => void
}

export default function NowPlayingSidebar({ track, isVisible, onClose }: NowPlayingSidebarProps) {
	const { playerState, effectiveAddress, isAuthenticated, getValidToken, login } = useAudio()
	const locale = useLocale()
	const { address: cardanoAddress, lucid } = useCardano()

	const {
		isPlaying,
		duration,
		currentTime,
		togglePlayPause,
		next,
		previous,
		seek
	} = playerState

	const [mintData, setMintData] = React.useState<{ minted: number, max: number }>({ minted: 0, max: 0 })
	const [hasOwned, setHasOwned] = React.useState(track?.is_owned ?? false)
	const [isMinting, setIsMinting] = React.useState(false)
	const [uploaderAddress, setUploaderAddress] = React.useState<string | null>(track?.uploader_address ?? null)
	const [uploaderPaymentAddress, setUploaderPaymentAddress] = React.useState<string | null>(track?.uploader_payment_address ?? null)
	const [albumId, setAlbumId] = React.useState<number | null>(track?.album_id ?? null)
	const [ticker, setTicker] = React.useState<string | null>(track?.ticker ?? null)
	const [splitter, setSplitter] = React.useState<string | null>(track?.splitter ?? null)

	// Reset state when track changes
	React.useEffect(() => {
		setUploaderAddress(track?.uploader_address ?? null)
		setUploaderPaymentAddress(track?.uploader_payment_address ?? null)
		setAlbumId(track?.album_id ?? null)
		setTicker(track?.ticker ?? null)
		setSplitter(track?.splitter ?? null)
	}, [track])

	const fetchMintData = React.useCallback(async () => {
		if (!track) return
		const tokenId = track.id !== undefined ? track.id : track.token_id
		if (tokenId === undefined || tokenId === null) return

		try {
			// Get mint data from backend
			const res = await fetch(`/api-backend/songs/${tokenId}`)
			if (res.ok) {
				const data = await res.json()
				setMintData({
					minted: Number(data.mint_count || 0),
					max: Number(data.max_supply || 0)
				})
				if (data.uploader_address) {
					setUploaderAddress(data.uploader_address)
				}
				if (data.uploader_payment_address) {
					setUploaderPaymentAddress(data.uploader_payment_address)
				}
				if (data.album_id !== undefined) {
					setAlbumId(data.album_id)
				}
				if (data.ticker) {
					setTicker(data.ticker)
				}
				if (data.splitter) {
					setSplitter(data.splitter)
				}
			}

			// Check ownership if user is logged in
			if (effectiveAddress) {
				const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
				const headers: Record<string, string> = {}
				if (authData) {
					const parsedAuth = JSON.parse(authData)
					if (parsedAuth && parsedAuth.accessToken) {
						headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`
					}
				}
				const ownRes = await fetch(`/api-backend/songs/${tokenId}`, { headers })
				if (ownRes.ok) {
					const ownData = await ownRes.json()
					setHasOwned(!!ownData.is_owned)
					if (ownData.uploader_address) {
						setUploaderAddress(ownData.uploader_address)
					}
					if (ownData.uploader_payment_address) {
						setUploaderPaymentAddress(ownData.uploader_payment_address)
					}
					if (ownData.album_id !== undefined) {
						setAlbumId(ownData.album_id)
					}
					if (ownData.ticker) {
						setTicker(ownData.ticker)
					}
					if (ownData.splitter) {
						setSplitter(ownData.splitter)
					}
				}
			}
		} catch (err) {
			console.error('Sidebar: Error fetching mint data', err)
		}
	}, [track, effectiveAddress])

	React.useEffect(() => {
		fetchMintData()
	}, [fetchMintData])

	const handleMint = async () => {
		if (!isAuthenticated || !track) {
			login()
			return
		}

		const suppressToasts = hasOwned

		const targetUploader = uploaderAddress || track.uploader_address
		if (!targetUploader) {
			if (!suppressToasts) {
				toast.error("Creator address not found. Please try again.")
			}
			return
		}

		const isUploader = (cardanoAddress && targetUploader.toLowerCase() === cardanoAddress.toLowerCase()) ||
			(effectiveAddress && targetUploader.toLowerCase() === effectiveAddress.toLowerCase())

		const creatorAddressForContract = isUploader
			? cardanoAddress
			: (uploaderPaymentAddress || track.uploader_payment_address || targetUploader)

		// Guard: a stake address cannot be used to derive contract addresses.
		// This happens if the payment address hasn't loaded from the API yet.
		if (!creatorAddressForContract || (creatorAddressForContract as string).startsWith('stake')) {
			if (!suppressToasts) {
				toast.error("Creator payment address is still loading. Please wait a moment and try again.")
			}
			return
		}

		setIsMinting(true)
		let mainToast: string | number | undefined = undefined
		if (!suppressToasts) {
			mainToast = toast.loading(`Preparing to collect "${String(track.name || track.title || "")}"...`)
		}

		try {
			const tokenId = track.id !== undefined ? track.id : track.token_id
			if (mainToast) {
				toast.loading(`Creating, signing and submitting transaction...`, { id: mainToast })
			}
			const txHash = await buyFractionOnChain(lucid, {
				token_id: Number(tokenId),
				uploader_address: creatorAddressForContract as string,
				album_id: albumId,
				ticker: ticker || undefined
			})

			if (mainToast) {
				toast.loading(`Confirming transaction on-chain...`, { id: mainToast })
			}
			await lucid.awaitTx(txHash)

			if (mainToast) {
				toast.loading(
					<div className="flex flex-col gap-1">
						<span>Transaction submitted!</span>
						<a
							href={`${EXPLORER_URL}/tx/${txHash}`}
							target="_blank"
							rel="noreferrer"
							className="text-xs text-lavender hover:underline"
						>
							View on Explorer
						</a>
					</div>,
					{ id: mainToast }
				)
			}

			// Record mint in database
			const token = await getValidToken()
			if (token) {
				await fetch(`/api-backend/mints`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({
						track_id: tokenId,
						tx_hash: txHash
					})
				})
			}

			setHasOwned(true)
			markCollected()
			fetchMintData()
			if (mainToast) {
				toast.success(`"${track.name || track.title}" collected!`, { id: mainToast })
			}

		} catch (error: any) {
			console.error('Sidebar: Collection Error', error)
			if (mainToast) {
				toast.error(formatTxError(error), { id: mainToast })
			}
		} finally {
			setIsMinting(false)
		}
	}

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: track.name || track.title,
				text: `Check out ${track.name || track.title} by ${track.artist || track.creator} on Doba`,
				url: window.location.href,
			})
		} else {
			navigator.clipboard.writeText(window.location.href)
			toast.success("Link copied to clipboard!")
		}
	}

	const handleCopyLink = () => {
		const tokenId = track?.id !== undefined ? track.id : track?.token_id
		const shareUrl = `https://www.doba.world/track/${tokenId}`
		navigator.clipboard.writeText(shareUrl)
		toast.success("Track link copied!")
	}

	const handleDownload = async () => {
		const tokenId = track?.id !== undefined ? track.id : track?.token_id

		if (!effectiveAddress || !hasOwned) {
			return
		}

		const mainToast = toast.loading(`Preparing download...`)

		try {
			const activeToken = await getValidToken()
			if (!activeToken) throw new Error("Authentication failed. Please try logging in again.")

			const response = await fetch(`/api-backend/songs/${tokenId}/download`, {
				headers: {
					'Authorization': `Bearer ${activeToken}`
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
			a.download = `${track.artist || track.creator || 'Artist'} - ${track.name || track.title || 'Track'}.mp3`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)

			toast.success("Download started!", { id: mainToast })
		} catch (error: any) {
			toast.error(error.message || "Download failed", { id: mainToast })
		}
	}

	React.useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', handleEsc)
		return () => window.removeEventListener('keydown', handleEsc)
	}, [onClose])

	if (!track) return null

	const imageUrl = (track.image_url || track.cover || '').replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')

	const formatTime = (time: number) => {
		if (!time || isNaN(time) || time === Infinity) return '0:00'
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	const progressPercent = (duration > 0 && duration !== Infinity) ? (currentTime / duration) * 100 : 0

	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
		const targetTime = percent * (duration || 0)
		if (duration && duration !== Infinity) {
			seek(targetTime)
		}
	}

	const isSoldOut = mintData.max > 0 && mintData.minted >= mintData.max

	return (
		<aside className={cn(
			"fixed inset-x-3 top-20 bottom-3 z-[60] lg:static lg:inset-auto flex flex-col overflow-hidden transition-all duration-300 ease-in-out shrink-0 glass-surface rounded-2xl shadow-xl min-h-0",
			isVisible
				? "opacity-100 translate-y-0 lg:translate-x-0 lg:w-80 lg:mt-24 lg:mr-4 lg:mb-28 lg:ml-0"
				: "opacity-0 pointer-events-none translate-y-6 lg:translate-y-0 lg:translate-x-4 lg:w-0 lg:m-0"
		)}>
			{/* Feathered vertical edge rule (desktop) */}
			<div className="hidden lg:block absolute left-0 top-4 bottom-4 w-[1px] rounded-full bg-gradient-to-b from-transparent via-midnight/[0.08] dark:via-white/[0.08] to-transparent" />
			{/* Mobile top border partial */}
			<div className="lg:hidden absolute top-0 left-4 right-4 h-[1px] rounded-full bg-gradient-to-r from-transparent via-midnight/[0.08] dark:via-white/[0.08] to-transparent" />

			<div className={cn(
				"w-full lg:w-80 flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-5 relative pb-4 transition-opacity duration-150 ease-out",
				isVisible ? "opacity-100" : "opacity-0"
			)}>
				<div className="space-y-6">
					{/* Large Album Art */}
					<div className="relative w-full aspect-square lg:w-36 lg:h-36 rounded-2xl overflow-hidden border border-midnight/10 dark:border-white/10 shadow-lg group bg-midnight/5 dark:bg-white/5 flex items-center justify-center">
						<button
							onClick={onClose}
							className="absolute top-3 right-3 z-10 w-12 h-12 flex items-center justify-center rounded-xl bg-midnight/70 dark:bg-white/70 text-white dark:text-midnight shadow-lg hover:bg-midnight dark:hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
							title="Close"
							aria-label="Close now playing panel"
						>
							<IconX size={18} />
						</button>
						{imageUrl ? (
							<img
								src={imageUrl}
								alt={track.name || track.title}
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						) : (
							<IconMusic size={64} strokeWidth={1} className="text-midnight/30 dark:text-white/30" />
						)}
					</div>

					{/* Track Info */}
					<div className="space-y-5">
						<div className="space-y-2 text-left">
							<h2 className="text-xl font-display font-bold text-midnight dark:text-white tracking-tight leading-tight">
								{track.name || track.title}
							</h2>
							<div className="flex items-center justify-start gap-2 text-midnight/80 dark:text-lavender font-bold">
								<IconMicrophone size={14} />
								<p className="text-xs font-display font-bold uppercase tracking-widest">{track.artist || track.creator}</p>
							</div>
						</div>

						{/* Price & Mint Info */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								{hasOwned ? (
									<div className="flex items-center gap-1.5 text-emerald-500">
										<IconSquareCheckFilled size={18} />
										<span className="text-xs font-bold uppercase tracking-widest">Collected</span>
									</div>
								) : (
									<span className="text-pink-600 dark:text-cyber-pink font-display font-bold text-lg">{track.price || '5'} ADA</span>
								)}
								<span className="text-[10px] text-midnight/70 dark:text-white/40 font-display font-bold uppercase tracking-widest">
									{mintData.max === 0
										? `${mintData.minted} Collected`
										: `${mintData.minted} / ${mintData.max} Edition`}
								</span>
							</div>
							<div className="h-[3px] w-full bg-midnight/10 dark:bg-white/10 rounded-full overflow-hidden">
								<div
									className="h-full bg-pink-600 dark:bg-cyber-pink transition-all duration-1000 rounded-full"
									style={{ width: mintData.max === 0 ? '100%' : `${(mintData.minted / (mintData.max || 1)) * 100}%` }}
								/>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-2">
						{!hasOwned && !isSoldOut && (
							<Button
								className="flex-1 h-12 rounded-xl font-display font-bold uppercase tracking-widest text-xs transition-all duration-300 bg-cyber-pink hover:bg-cyber-pink/90 text-white"
								onClick={handleMint}
								disabled={isMinting}
							>
								{isMinting && <IconLoader2 size={16} className="animate-spin mr-2" />}
								Collect
							</Button>
						)}

							<Button
								variant="outline"
								className="flex-1 lg:flex-none lg:w-12 h-12 p-0 rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
								onClick={handleShare}
								title="Share"
							>
								<IconShare size={18} className="text-midnight/60 dark:text-white/60" />
							</Button>

							<Button
								variant="outline"
								className="flex-1 lg:flex-none lg:w-12 h-12 p-0 rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
								onClick={handleCopyLink}
								title="Copy Link"
							>
								<IconCopy size={18} className="text-midnight/60 dark:text-white/60" />
							</Button>

							<Button
								variant="outline"
								className="flex-1 lg:flex-none lg:w-12 h-12 p-0 rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
								asChild
								title="View more"
							>
								<Link
									href={`/${locale}/track/${track.token_id ?? track.id}`}
									onClick={onClose}
									aria-label="View full song details"
								>
									<IconExternalLink size={18} className="text-midnight/60 dark:text-white/60" />
								</Link>
							</Button>
						</div>

						{/* Owner actions */}
						{hasOwned && (
							<div className="grid grid-cols-2 gap-2">
								<Button
									variant="outline"
									className="h-11 rounded-xl text-xs font-display font-bold uppercase tracking-widest border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
									onClick={handleDownload}
								>
									Download
								</Button>
								{!isSoldOut && (
									<Button
										variant="outline"
										className="h-11 rounded-xl text-xs font-display font-bold uppercase tracking-widest border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
										onClick={handleMint}
										disabled={isMinting}
									>
										{isMinting && <IconLoader2 size={16} className="animate-spin mr-2" />}
										Collect More
									</Button>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Mobile full-page extras (desktop uses the bottom player bar) */}
				<div className="lg:hidden space-y-6 pt-6 mt-6 border-t border-midnight/[0.06] dark:border-white/[0.06]">
					{/* Playback controls */}
					<div className="space-y-4">
						<div className="space-y-2">
							<div
								className="h-[3px] w-full bg-midnight/10 dark:bg-white/10 relative cursor-pointer group overflow-hidden rounded-full"
								onClick={handleProgressClick}
								role="slider"
								aria-label="Track Progress"
								aria-valuenow={Math.round(progressPercent)}
								aria-valuemin={0}
								aria-valuemax={100}
							>
								<div
									className="absolute inset-y-0 left-0 bg-pink-600 dark:bg-cyber-pink transition-all h-full rounded-full"
									style={{ width: `${progressPercent}%` }}
								/>
								<div
									className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-pink-600 dark:bg-cyber-pink border border-midnight/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
									style={{ left: `calc(${progressPercent}% - 6px)` }}
								/>
							</div>
							<div className="flex items-center justify-between text-[10px] text-midnight/70 dark:text-white/40 tabular-nums font-bold uppercase tracking-widest">
								<span>{formatTime(currentTime)}</span>
								<span>{formatTime(duration)}</span>
							</div>
						</div>

						<div className="flex items-center justify-center gap-10">
							<button
								onClick={previous}
								className="p-2 text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
								aria-label="Previous"
							>
								<SkipBack size={28} className="fill-midnight dark:fill-white" />
							</button>

							<button
								onClick={togglePlayPause}
								className="w-14 h-14 rounded-xl bg-lavender text-midnight flex items-center justify-center shadow-lg active:scale-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								aria-label={isPlaying ? 'Pause' : 'Play'}
							>
								{isPlaying ? <Pause size={28} className="fill-midnight" /> : <Play size={28} className="fill-midnight ml-1" />}
							</button>

							<button
								onClick={next}
								className="p-2 text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
								aria-label="Next"
							>
								<SkipForward size={28} className="fill-midnight dark:fill-white" />
							</button>
						</div>
					</div>

					{/* Lyrics */}
					{(track.description || track.lyrics) && (
						<div className="space-y-3">
							<p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">Lyrics</p>
							<p className="text-midnight/80 dark:text-white/80 text-sm leading-relaxed whitespace-pre-line">
								{track.description || track.lyrics}
							</p>
						</div>
					)}

					{/* Details grid */}
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2">
							<p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">Genre</p>
							<p className="text-midnight dark:text-white text-sm">{track.genre || 'RARE'}</p>
						</div>
						{(track.token_id !== undefined || track.id !== undefined) && (
							<div className="col-span-2">
								<p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">Token ID</p>
								<Link
									href={`/${locale}/track/${track.token_id ?? track.id}`}
									onClick={onClose}
									className="text-pink-600 dark:text-cyber-pink hover:underline text-sm font-mono block"
								>
									#{track.token_id ?? track.id}
								</Link>
							</div>
						)}
						{(() => {
							const policyId = splitter || track.splitter || process.env.NEXT_PUBLIC_MINTING_POLICY_ID;
							if (!policyId) return null;
							return (
								<div className="col-span-2">
									<p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">Policy ID</p>
									<a
										href={`${EXPLORER_URL}/tokenPolicy/${policyId}`}
										target="_blank"
										rel="noreferrer"
										className="text-pink-600 dark:text-cyber-pink hover:underline text-xs font-mono block truncate"
									>
										{policyId.slice(0, 8)}...{policyId.slice(-8)}
									</a>
								</div>
							);
						})()}
						{(() => {
							const creator = uploaderAddress || track.uploader_address;
							if (!creator) return null;
							return (
								<div className="col-span-2">
									<p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">Creator Address</p>
									<a
										href={`${EXPLORER_URL}/address/${creator}`}
										target="_blank"
										rel="noreferrer"
										className="text-pink-600 dark:text-cyber-pink hover:underline text-xs font-mono block truncate"
									>
										{creator.slice(0, 10)}...{creator.slice(-8)}
									</a>
								</div>
							);
						})()}
					</div>

				</div>
			</div>
		</aside>
	)
}
