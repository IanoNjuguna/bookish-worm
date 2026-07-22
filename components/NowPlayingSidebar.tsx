'use client'

import React from 'react'
import { IconX, IconMicrophone, IconExternalLink, IconShare, IconCopy, IconSquareCheckFilled, IconLoader2 } from '@tabler/icons-react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { DobaVisualizer } from '@/components/icons/DobaVisualizer'
import { Button } from '@/components/ui/button'
import { useCardano } from '@/components/Providers'
import { EXPLORER_URL } from '@/lib/config'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAudio } from '@/components/AudioProvider'
import { buyFractionOnChain, formatTxError, isUserDeclinedTxError } from '@/lib/contractHelper'
import { IconPlayerPlay as Play, IconPlayerPause as Pause, IconPlayerSkipBack as SkipBack, IconPlayerSkipForward as SkipForward } from '@tabler/icons-react'

const formatTokenId = (id: string | number) => {
	const s = String(id)
	if (s.length <= 10) return s
	return `${s.slice(0, 4)}...${s.slice(-4)}`
}

interface NowPlayingSidebarProps {
	track: any | null
	isVisible: boolean
	onClose: () => void
}

export default function NowPlayingSidebar({ track, isVisible, onClose }: NowPlayingSidebarProps) {
	const { playerState, effectiveAddress, isAuthenticated, getValidToken, login, accessToken } = useAudio()
	const locale = useLocale()
	const { address: cardanoAddress, isConnected, lucid } = useCardano()

	const {
		isPlaying,
		duration,
		currentTime,
		togglePlayPause,
		next,
		previous,
		seek,
		audioRef
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
							className="text-xs text-[#B794F4] hover:underline"
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
			fetchMintData()
			if (mainToast) {
				toast.success(`"${track.name || track.title}" collected!`, { id: mainToast })
			}

		} catch (error: any) {
			console.error('Sidebar: Collection Error', error)
			if (mainToast) {
				if (isUserDeclinedTxError(error)) {
					toast.info('You declined the transaction.', { id: mainToast })
				} else {
					toast.error(formatTxError(error), { id: mainToast })
				}
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

	if (!isVisible || !track) return null

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

	return (
		<aside className="fixed inset-0 z-[100] bg-[rgba(250,249,246,0.95)] dark:bg-[rgba(13,13,18,0.95)] lg:bg-transparent lg:dark:bg-transparent backdrop-blur-md lg:backdrop-blur-none flex flex-col lg:static lg:z-0 lg:w-80 overflow-hidden animate-slide-in-right h-[100dvh] lg:h-full relative">
			{/* Mobile Top Border Partial */}
			<div className="lg:hidden absolute top-0 left-4 right-4 h-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
			
			<div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 relative pb-32">
				{/* Main Content Group */}
				<div className="relative pb-6">
					<div className="hidden lg:block absolute left-[-24px] top-[-8px] bottom-[-12px] w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
					<div className="space-y-6">
				{/* Top Label & Close Button */}
				<div className="flex items-center justify-between mb-2">
					<p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">Explore</p>
					<button
						onClick={onClose}
						className="p-1.5 hover:bg-midnight/5 dark:hover:bg-white/5 rounded-full transition-colors text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white"
						title="Close"
					>
						<IconX size={16} />
					</button>
				</div>

				{/* Large Album Art */}
				<div className="aspect-square w-full rounded-none overflow-hidden border border-midnight/10 dark:border-white/10 group">
					<img
						src={imageUrl}
						alt={track.name || track.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>

				{/* Mobile Audio Controls */}
				<div className="lg:hidden space-y-6 pt-2">
					<div className="space-y-2">
						<div
							className="h-1.5 w-full bg-midnight/10 dark:bg-white/10 relative cursor-pointer group"
							onClick={handleProgressClick}
							role="slider"
							aria-label="Track Progress"
							aria-valuenow={Math.round(progressPercent)}
							aria-valuemin={0}
							aria-valuemax={100}
						>
							<div
								className="absolute inset-y-0 left-0 bg-cyber-pink transition-all h-full"
								style={{ width: `${progressPercent}%` }}
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
							className="p-2 text-midnight/60 dark:text-white/60 active:text-midnight dark:text-white active:scale-95 transition-all"
							aria-label="Previous"
						>
							<SkipBack size={28} className="fill-midnight dark:fill-white" />
						</button>

						<button
							onClick={togglePlayPause}
							className="w-14 h-14 bg-white text-black flex items-center justify-center active:scale-90 active:brightness-90 transition-all shadow-xl shadow-black/40"
							aria-label={isPlaying ? 'Pause' : 'Play'}
						>
							{isPlaying ? <Pause size={28} className="fill-black" /> : <Play size={28} className="fill-black ml-1" />}
						</button>

						<button
							onClick={next}
							className="p-2 text-midnight/60 dark:text-white/60 active:text-midnight dark:text-white active:scale-95 transition-all"
							aria-label="Next"
						>
							<SkipForward size={28} className="fill-midnight dark:fill-white" />
						</button>
					</div>
				</div>

				{/* Track Info */}
				<div className="space-y-4">
					<div className="space-y-1">
						<h2 className="text-2xl font-display font-bold text-midnight dark:text-white tracking-tight leading-tight">
							{track.name || track.title}
						</h2>
						<div className="flex items-center gap-2 text-[#B794F4] font-bold">
							<IconMicrophone size={14} />
							<p className="text-sm font-display font-bold uppercase tracking-widest">{track.artist || track.creator}</p>
						</div>
					</div>

					{/* Price & Mint Info */}
					<div className="space-y-2 pt-2">
						<div className="flex items-center justify-between">
							{hasOwned ? (
								<div className="flex items-center gap-1.5 text-[#1DB954]">
									<IconSquareCheckFilled size={18} />
								</div>
							) : (
								<span className="text-cyber-pink font-display font-bold text-lg">{track.price || '5'} ADA</span>
							)}
							<span className="text-[10px] text-midnight/70 dark:text-white/40 font-display font-bold uppercase tracking-widest">
								{mintData.max === 0
									? `${mintData.minted} Collected`
									: `${mintData.minted} / ${mintData.max} Edition`}
							</span>
						</div>
						<div className="h-[2px] w-full bg-midnight/5 dark:bg-white/5 relative overflow-hidden">
							<div
								className="absolute inset-y-0 left-0 bg-cyber-pink transition-all duration-1000"
								style={{ width: mintData.max === 0 ? '100%' : `${(mintData.minted / (mintData.max || 1)) * 100}%` }}
							/>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2 pt-2">
						<Button
							className={cn(
								"flex-1 h-12 rounded-none font-display font-bold uppercase tracking-widest text-xs transition-all duration-300",
								(mintData.max > 0 && mintData.minted >= mintData.max)
									? "bg-[#FF1F8A]/10 text-[#FF1F8A] border border-[#FF1F8A]/20 cursor-not-allowed disabled:opacity-100"
									: hasOwned
										? "bg-[#1DB954]/10 border border-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/20 cursor-default disabled:opacity-100"
										: "bg-[#B794F4] hover:bg-[#A080E0] text-black"
							)}
							onClick={!(mintData.max > 0 && mintData.minted >= mintData.max) && !hasOwned && !isMinting ? handleMint : undefined}
							disabled={(mintData.max > 0 && mintData.minted >= mintData.max) || hasOwned || isMinting}
						>
							{isMinting ? (
								<IconLoader2 size={16} className="animate-spin mr-2" />
							) : (mintData.max > 0 && mintData.minted >= mintData.max) ? (
								<DobaVisualizer size={16} className="mr-2 text-[#FF1F8A]" />
							) : hasOwned ? (
								<IconSquareCheckFilled size={16} className="mr-2" />
							) : null}
							{(mintData.max > 0 && mintData.minted >= mintData.max) ? 'SOLD OUT' : hasOwned ? 'Collected' : 'Collect'}
						</Button>

						<Button
							variant="outline"
							className="w-12 h-12 p-0 border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5 rounded-none"
							onClick={handleShare}
							title="Share"
						>
							<IconShare size={18} className="text-midnight/60 dark:text-white/60" />
						</Button>

						<Button
							variant="outline"
							className="w-12 h-12 p-0 border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5 rounded-none"
							onClick={handleCopyLink}
							title="Copy Link"
						>
							<IconCopy size={18} className="text-midnight/60 dark:text-white/60" />
						</Button>
					</div>
				</div>
			</div>
		</div>

				{/* Lyrics Section */}
				{(track.description || track.lyrics) && (
					<div className="relative pb-6">
						<div className="hidden lg:block absolute left-[-24px] top-[12px] bottom-[-12px] w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
						<div className="space-y-3 pt-6 border-t border-white/5 relative">
							<p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">Lyrics</p>
							<p className="text-midnight/80 dark:text-white/80 text-sm leading-relaxed whitespace-pre-line">
								{track.description || track.lyrics}
							</p>
						</div>
					</div>
				)}

				{/* Blockchain Info */}
				<div className="relative pb-6">
					<div className="hidden lg:block absolute left-[-24px] top-[12px] bottom-[0px] w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
					<div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 relative">
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
									className="text-cyber-pink hover:underline text-sm font-mono block"
								>
									#{formatTokenId(track.token_id ?? track.id)}
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
										className="text-cyber-pink hover:underline text-xs font-mono block truncate"
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
										className="text-cyber-pink hover:underline text-xs font-mono block truncate"
									>
										{creator.slice(0, 10)}...{creator.slice(-8)}
									</a>
								</div>
							);
						})()}
						{(() => {
							const policyId = splitter || track.splitter;
							if (!policyId) return null;
							const targetTokenId = albumId !== null ? albumId : (track.album_id ? Number(track.album_id) : (track.id !== undefined ? track.id : track.token_id));
							const tokenNameStr = ticker
								? ticker.toUpperCase().replace(/[^A-Z0-9]/g, "")
								: (track.ticker
									? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "")
									: 'T' + String(targetTokenId).slice(-11));
							const toHex = (str: string) => Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
							const assetNameHex = toHex(tokenNameStr);
							const assetUnit = policyId + '000643b0' + assetNameHex;
							return (
								<div className="col-span-2">
									<p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">Provenance</p>
									<a
										href={`${EXPLORER_URL}/token/${assetUnit}`}
										target="_blank"
										rel="noreferrer"
										className="text-cyber-pink hover:underline text-xs font-mono block truncate"
									>
										{tokenNameStr} (Reference NFT)
									</a>
								</div>
							);
						})()}
					</div>
				</div>

				{/* Actions */}
				<div className="relative">
					<div className="hidden lg:block absolute left-[-24px] top-[12px] bottom-[-102px] w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
					<div className="flex flex-col gap-3 pt-6 border-t border-white/5 relative">
						<Button
							className={cn(
								"w-full font-display font-bold py-6 rounded-none transition-all duration-300",
								hasOwned
									? "bg-[#B794F4] hover:bg-[#B794F4]/90 text-black"
									: "bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 text-midnight/50 dark:text-white/20 cursor-not-allowed"
							)}
							onClick={hasOwned ? handleDownload : undefined}
							disabled={!hasOwned}
						>
							{hasOwned ? 'Download' : 'Collect to Download'}
						</Button>

						{hasOwned && !(mintData.max > 0 && mintData.minted >= mintData.max) && (
							<div className="flex flex-col gap-2 pt-2 relative">
								<p className="text-[11px] italic text-midnight/60 dark:text-white/60 text-center font-serif leading-relaxed px-2 mt-1">
									you can collect another song token to support the artist
								</p>
								<Button
									variant="outline"
									className={cn(
										"w-full border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5 text-[10px] uppercase font-display font-bold text-midnight/60 dark:text-white/60 tracking-widest py-4 rounded-none h-auto",
										(mintData.max > 0 && mintData.minted >= mintData.max) && "opacity-50 cursor-not-allowed"
									)}
									onClick={handleMint}
									disabled={isMinting || (mintData.max > 0 && mintData.minted >= mintData.max)}
								>
									{isMinting && <IconLoader2 size={16} className="animate-spin mr-2" />}
									{(mintData.max > 0 && mintData.minted >= mintData.max) ? 'SOLD OUT' : 'Collect More'}
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</aside>
	)
}
