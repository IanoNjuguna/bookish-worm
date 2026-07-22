'use client'

import { logger } from '@/lib/logger'
import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { IconUpload, IconX, IconPlus, IconMusic, IconPhoto, IconTrash, IconCheck, IconChevronDown } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { GENRES } from '@/constants/genres'
import { useCardano } from '@/components/Providers'
import { toast } from 'sonner'
import { useAudio } from '@/components/AudioProvider'
import { mintTrackOnChain, formatTxError, isUserDeclinedTxError } from '@/lib/contractHelper'
import { CARDANO_NETWORK } from '@/lib/config'
import { notifyOnRampInitiated, notifyMintedTrack } from '@/lib/notifications'

interface Collaborator {
	address: string
	split: number
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '/api-backend').replace(/\/$/, '')

async function readErrorBody(res: Response): Promise<string> {
	const contentType = res.headers.get('content-type') || ''
	if (contentType.includes('application/json')) {
		const data = await res.json().catch(() => ({} as any))
		return data?.message || data?.error || JSON.stringify(data)
	}
	return await res.text().catch(() => '')
}

async function assertOk(res: Response, context: string): Promise<void> {
	if (res.ok) return
	const body = (await readErrorBody(res)).trim()
	const details = body || `${res.status} ${res.statusText}`
	throw new Error(`${context}: ${details}`)
}

function mapUploadErrorMessage(error: any): string {
	const raw = typeof error === 'string' ? error : (error?.message || '')
	const msg = raw.toLowerCase()

	if (msg.includes('pinata jwt not configured')) {
		return 'Upload service is not configured. Set PINATA_JWT on core-api backend and retry.'
	}
	if (msg.includes('payload too large') || msg.includes('413')) {
		return 'Uploaded file is too large. Please use a smaller audio/image file and try again.'
	}
	if (
		msg.includes('missing or invalid authorization header')
		|| msg.includes('invalid or expired access token')
		|| msg.includes('401')
	) {
		return 'Your session expired. Please sign the authentication message again and retry.'
	}
	if (msg.includes('invalid or expired nonce') || msg.includes('missing nonce')) {
		return 'Secure session expired during signing. Please authenticate again and retry.'
	}
	if (msg.includes('failed to fetch') || msg.includes('networkerror')) {
		return 'Cannot reach backend upload service. Check that core-api is running and reachable.'
	}

	return formatTxError(error)
}

export default function UploadView() {
	const t = useTranslations('upload')
	const { address: cardanoAddress, lucid } = useCardano()
	const { accessToken, getValidToken, login, effectiveAddress } = useAudio()

	const [open, setOpen] = useState(false)
	const [title, setTitle] = useState('')
	const [ticker, setTicker] = useState('')
	const [userEditedTicker, setUserEditedTicker] = useState(false)
	const [artistName, setArtistName] = useState('')
	const [description, setDescription] = useState('')
	const [genre, setGenre] = useState('')
	const [price, setPrice] = useState('5') // Default to 5 ADA
	const [supply, setSupply] = useState('5000')
	const [royaltyPercentage, setRoyaltyPercentage] = useState('5') // Default to 5%
	const [royaltyAddress, setRoyaltyAddress] = useState('')
	const [audioFile, setAudioFile] = useState<File | null>(null)
	const [coverFile, setCoverFile] = useState<File | null>(null)
	const [collaborators, setCollaborators] = useState<Collaborator[]>([])
	const [isUploading, setIsUploading] = useState(false)
	const [assetsCid, setAssetsCid] = useState<string | null>(null)
	const [audioHash, setAudioHash] = useState<string>('')
	const [imageHash, setImageHash] = useState<string>('')
	const [audioFilename, setAudioFilename] = useState<string>('')
	const [imageFilename, setImageFilename] = useState<string>('')
	const [streamingUrl, setStreamingUrl] = useState<string>('')
	const [isAssetsUploading, setIsAssetsUploading] = useState(false)
	const [publishedSongId, setPublishedSongId] = useState<number | null>(null)
	const [isMinting, setIsMinting] = useState(false)
	const [adaBalance, setAdaBalance] = useState<bigint | null>(null)
	const [hasCollected, setHasCollected] = useState(false)
	const [audioDuration, setAudioDuration] = useState<string>('PT3M45S')
	const [attested, setAttested] = useState(false)
	
	const [isAlbum, setIsAlbum] = useState(false)
	const [albumTracks, setAlbumTracks] = useState<any[]>([
		{ id: Date.now(), title: '', file: null, audioHash: '', audioName: '', duration: 'PT3M45S', streamingUrl: '' }
	])

	const addAlbumTrack = () => {
		setAlbumTracks([...albumTracks, { id: Date.now() + Math.random(), title: '', file: null, audioHash: '', audioName: '', duration: 'PT3M45S', streamingUrl: '' }])
	}

	const removeAlbumTrack = (index: number) => {
		setAlbumTracks(albumTracks.filter((_, i) => i !== index))
	}

	const updateAlbumTrack = (index: number, field: string, value: any) => {
		const updated = [...albumTracks]
		updated[index] = { ...updated[index], [field]: value }
		setAlbumTracks(updated)
	}

	const handleAlbumTrackFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			const updated = [...albumTracks]
			updated[index].file = file

			// Dynamically extract metadata duration
			const objectUrl = URL.createObjectURL(file)
			const audio = new Audio(objectUrl)
			audio.addEventListener('loadedmetadata', () => {
				const durationSec = Math.floor(audio.duration)
				const minutes = Math.floor(durationSec / 60)
				const seconds = durationSec % 60
				const isoDuration = `PT${minutes}M${seconds}S`
				updated[index].duration = isoDuration
				setAlbumTracks([...updated])
				URL.revokeObjectURL(objectUrl)
			})
			setAlbumTracks(updated)
		}
	}

	// Fetch ADA Balance
	useEffect(() => {
		const fetchBalance = async () => {
			if (!cardanoAddress || !lucid) return
			try {
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
				} else if (typeof lucid.utxosAt === 'function') {
					const utxos = (await lucid.utxosAt(cardanoAddress)) || []
					lovelace = utxos.reduce(
						(total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
						0n
					)
				}

				setAdaBalance(lovelace)
			} catch (e) {
				logger.error('UploadView: Failed to fetch ADA balance', e)
			}
		}

		if (cardanoAddress && lucid) {
			fetchBalance()
			const interval = setInterval(fetchBalance, 15000)
			return () => clearInterval(interval)
		}
	}, [cardanoAddress, lucid])

	// Auto-populate ticker based on title if not edited by user
	useEffect(() => {
		if (!userEditedTicker && title) {
			const autoTicker = title
				.toUpperCase()
				.replace(/[^A-Z0-9]/g, "")
				.slice(0, 12);
			setTicker(autoTicker);
		}
	}, [title, userEditedTicker])

	// Background Upload Effect
	useEffect(() => {
		const triggerBackgroundUpload = async () => {
			if (isAlbum) return
			if (!audioFile || !coverFile || assetsCid || isAssetsUploading || !accessToken) return

			setIsAssetsUploading(true)
			try {
				const formData = new FormData()
				formData.append('audio', audioFile)
				formData.append('image', coverFile)
				formData.append('title', title || 'Untitled')

				const token = await getValidToken()
				const response = await fetch(`${API_URL.replace(/\/$/, '')}/upload-assets`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`
					},
					body: formData,
				})

				if (response.ok) {
					const data = await response.json()
					setAudioHash(data.audioHash)
					setImageHash(data.imageHash)
					setAudioFilename(data.audioName || '')
					setImageFilename(data.imageName || '')
					setStreamingUrl(data.streamingUrl || '')
					setAssetsCid("READY")
				}
			} catch (e) {
				logger.error('Background upload failed', e)
				toast.error(mapUploadErrorMessage(e))
			} finally {
				setIsAssetsUploading(false)
			}
		}

		triggerBackgroundUpload()
	}, [audioFile, coverFile, title, accessToken])

	const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setAudioFile(file)

			// Dynamically extract metadata duration
			const objectUrl = URL.createObjectURL(file)
			const audio = new Audio(objectUrl)
			audio.addEventListener('loadedmetadata', () => {
				const durationSec = Math.floor(audio.duration)
				const minutes = Math.floor(durationSec / 60)
				const seconds = durationSec % 60
				
				// Format as ISO-8601 duration: PT[M]M[S]S
				const isoDuration = `PT${minutes}M${seconds}S`
				setAudioDuration(isoDuration)
				URL.revokeObjectURL(objectUrl)
			})
		}
	}

	const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setCoverFile(e.target.files[0])
		}
	}

	const addCollaborator = () => {
		setCollaborators([...collaborators, { address: '', split: 0 }])
	}

	const updateCollaborator = (index: number, field: keyof Collaborator, value: string | number) => {
		const newCollaborators = [...collaborators]
		if (field === 'split') {
			newCollaborators[index].split = Number(value)
		} else {
			newCollaborators[index].address = String(value)
		}
		setCollaborators(newCollaborators)
	}

	const removeCollaborator = (index: number) => {
		const newCollaborators = collaborators.filter((_, i) => i !== index)
		setCollaborators(newCollaborators)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		let token = await getValidToken()
		if (!token) {
			toast.info("Session expired or missing. Please sign the secure authentication message in your wallet.")
			token = await login()
			if (!token) return
		}

		// Perform conditional validation for album vs single track
		if (isAlbum) {
			if (albumTracks.length === 0 || albumTracks.some(t => !t.file || !t.title)) {
				toast.error("Please ensure all album tracks have a title and an audio file selected.")
				return
			}
		} else {
			if (!audioFile) {
				toast.error("Please select an audio file for your track.")
				return
			}
		}

		if (!coverFile || !cardanoAddress) {
			toast.error("Please ensure you have selected a cover image, and your wallet is connected.")
			return
		}

		// Collaborators split validation
		const otherSharesSum = collaborators.reduce((sum, c) => sum + (Number(c.split) || 0), 0)
		if (otherSharesSum >= 100) {
			toast.error("Total collaborator split cannot exceed or equal 100% (need to reserve split for yourself).")
			return
		}

		setIsUploading(true)
		const mainToast = toast.loading("Initiating upload process...")

		try {
			let currentAudioHash = audioHash || ''
			let currentImageHash = imageHash || ''
			let currentAudioName = audioFilename || (audioHash ? `audio_${audioHash}.mp3` : '')
			let currentImageName = imageFilename || (imageHash ? `cover_${imageHash}.jpg` : '')
			let currentStreamingUrl = streamingUrl || ''

			if (isAlbum) {
				// 1. Upload cover image first
				toast.loading("Uploading album cover image...", { id: mainToast })
				const imageFormData = new FormData()
				imageFormData.append('image', coverFile!)
				imageFormData.append('title', title)

				const imgRes = await fetch(`${API_URL.replace(/\/$/, '')}/upload-assets`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`
					},
					body: imageFormData,
				})
				await assertOk(imgRes, 'Cover image upload failed')
				const imgData = await imgRes.json()
				currentImageHash = imgData.imageHash
				currentImageName = imgData.imageName

				// 2. Upload each track audio file sequentially
				for (let i = 0; i < albumTracks.length; i++) {
					const t = albumTracks[i]
					toast.loading(`Uploading album track ${i + 1}/${albumTracks.length}: ${t.title}...`, { id: mainToast })
					const trackFormData = new FormData()
					trackFormData.append('audio', t.file!)
					trackFormData.append('title', t.title)

					const trackRes = await fetch(`${API_URL.replace(/\/$/, '')}/upload-assets`, {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${token}`
						},
						body: trackFormData,
					})
					await assertOk(trackRes, `Track "${t.title}" audio upload failed`)
					const trackData = await trackRes.json()
					t.audioHash = trackData.audioHash
					t.audioName = trackData.audioName
					t.streamingUrl = trackData.streamingUrl
				}
				
				currentAudioHash = albumTracks[0].audioHash
				currentAudioName = albumTracks[0].audioName
				currentStreamingUrl = albumTracks[0].streamingUrl
			} else {
				// Upload single track assets if not already uploaded
				if (!assetsCid || assetsCid !== "READY" || !currentAudioHash) {
					toast.loading("Uploading media to IPFS...", { id: mainToast })
					const formData = new FormData()
					formData.append('audio', audioFile!)
					formData.append('image', coverFile!)
					formData.append('title', title)

					const assetRes = await fetch(`${API_URL.replace(/\/$/, '')}/upload-assets`, {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${token}`
						},
						body: formData,
					})
					await assertOk(assetRes, 'Media upload failed')
					const assetData = await assetRes.json()

					currentAudioHash = assetData.audioHash
					currentImageHash = assetData.imageHash
					currentAudioName = assetData.audioName
					currentImageName = assetData.imageName
					currentStreamingUrl = assetData.streamingUrl
				}
			}

			// 2. Upload Metadata
			toast.loading("Generating release metadata...", { id: mainToast })
			const metaResponse = await fetch(`${API_URL.replace(/\/$/, '')}/upload-metadata`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					title: title,
					ticker: ticker || undefined,
					description,
					artist: artistName || 'Unknown Artist',
					genre,
					audioHash: currentAudioHash,
					imageHash: currentImageHash,
					audioName: currentAudioName,
					imageName: currentImageName,
					duration: audioDuration,
					isAlbum: isAlbum,
					tracks: isAlbum ? albumTracks.map((t, idx) => ({
						title: t.title,
						audioHash: t.audioHash,
						audioName: t.audioName,
						duration: t.duration,
						track_number: idx + 1
					})) : undefined,
					royaltyRate: (Number(royaltyPercentage) / 100).toString(),
					royaltyAddress: royaltyAddress || cardanoAddress || ''
				}),
			})
			await assertOk(metaResponse, 'Metadata generation failed')
			const { metadataUri } = await metaResponse.json()

			// Generate a unique token_id (millisecond timestamp)
			const tokenId = Math.floor(Date.now())

			// 2.5 Mint track/album on Cardano chain using Lucid smart contract
			toast.loading("Signing and submitting mint transaction on-chain...", { id: mainToast })
			const { txHash, policyId } = await mintTrackOnChain(lucid, {
				token_id: tokenId,
				ticker: ticker || undefined,
				name: title,
				artist: artistName || 'Unknown Artist',
				description,
				imageUrl: `ipfs://${currentImageHash}`,
				audioUrl: `ipfs://${currentAudioHash}`,
				price: price || '5',
				supply: supply || '5000',
				duration: audioDuration,
				isAlbum: isAlbum,
				tracks: isAlbum ? albumTracks.map(t => ({
					name: t.title,
					audioUrl: `ipfs://${t.audioHash}`,
					duration: t.duration
				})) : undefined,
				royaltyRate: (Number(royaltyPercentage) / 100).toString(),
				royaltyAddress: royaltyAddress || cardanoAddress || ''
			})
			console.log("On-chain release minted:", txHash, "Policy ID:", policyId)

			// 3. Register Release and Tracks in Backend (Catalog Index)
			toast.loading("Registering release catalog...", { id: mainToast })

			if (isAlbum) {
				// Register the main Album release entry
				const albumResponse = await fetch(`${API_URL.replace(/\/$/, '')}/songs`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({
						token_id: tokenId,
						name: title,
						ticker: ticker || undefined,
						description,
						artist: artistName || 'Unknown Artist',
						genre,
						image_url: `ipfs://${currentImageHash}`,
						audio_url: `ipfs://${currentAudioHash}`,
						streaming_url: currentStreamingUrl,
						external_url: metadataUri,
						price: price || '5',
						max_supply: supply || '5000',
						uploader_address: effectiveAddress || cardanoAddress,
						uploader_payment_address: cardanoAddress,
						chain_id: 'cardano',
						splitter: policyId,
						tx_hash: txHash,
						duration: audioDuration,
						release_date: new Date().toISOString().split('T')[0],
						album_id: null,
						track_number: null
					}),
				})
				await assertOk(albumResponse, 'Backend album indexing failed')

				// Register each track inside the album
				for (let idx = 0; idx < albumTracks.length; idx++) {
					const t = albumTracks[idx]
					const trackResponse = await fetch(`${API_URL.replace(/\/$/, '')}/songs`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({
							token_id: tokenId + idx + 1,
							name: t.title,
							ticker: ticker || undefined,
							description: `Track ${idx + 1} from the album "${title}"`,
							artist: artistName || 'Unknown Artist',
							genre,
							image_url: `ipfs://${currentImageHash}`,
							audio_url: `ipfs://${t.audioHash}`,
							streaming_url: t.streamingUrl,
							external_url: metadataUri,
							price: price || '5',
							max_supply: supply || '5000',
							uploader_address: effectiveAddress || cardanoAddress,
							uploader_payment_address: cardanoAddress,
							chain_id: 'cardano',
							splitter: policyId,
							tx_hash: txHash,
							duration: t.duration,
							release_date: new Date().toISOString().split('T')[0],
							album_id: tokenId,
							track_number: idx + 1
						}),
					})
					await assertOk(trackResponse, `Backend track "${t.title}" indexing failed`)
				}
			} else {
				// Register Single Track
				const songResponse = await fetch(`${API_URL.replace(/\/$/, '')}/songs`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({
						token_id: tokenId,
						name: title,
						ticker: ticker || undefined,
						description,
						artist: artistName || 'Unknown Artist',
						genre,
						image_url: `ipfs://${currentImageHash}`,
						audio_url: `ipfs://${currentAudioHash}`,
						streaming_url: currentStreamingUrl,
						external_url: metadataUri,
						price: price || '5',
						max_supply: supply || '5000',
						uploader_address: effectiveAddress || cardanoAddress,
						uploader_payment_address: cardanoAddress,
						chain_id: 'cardano',
						splitter: policyId,
						tx_hash: txHash,
						duration: audioDuration,
						release_date: new Date().toISOString().split('T')[0]
					}),
				})
				await assertOk(songResponse, 'Backend indexing failed')
			}

			// 4. Register Collaborators in Backend
			if (collaborators.length > 0) {
				for (const collab of collaborators) {
					if (!collab.address) continue
					await fetch(`${API_URL.replace(/\/$/, '')}/collaborators`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({
							track_id: tokenId,
							wallet_address: collab.address,
							split_percentage: Number(collab.split) || 0
						}),
					})
				}
			}

			// Pre-collect first copy in backend automatically for creator
			try {
				await fetch(`${API_URL.replace(/\/$/, '')}/mints`, {
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
				setHasCollected(true)
			} catch (e) {
				logger.error('Failed to auto-record creator first copy', e)
			}

			setPublishedSongId(tokenId)
			notifyMintedTrack(title, isAlbum, `/track/${tokenId}`)
			toast.success(isAlbum ? "Album published successfully!" : "Track published successfully!", { id: mainToast })

		} catch (error: any) {
			logger.error('Submit Error', error)
			if (isUserDeclinedTxError(error)) {
				toast.info('You declined the transaction.', { id: mainToast })
			} else {
				toast.error(mapUploadErrorMessage(error), { id: mainToast })
			}
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-20">
			<div className="border-b border-midnight/10 dark:border-white/10 pb-6">
				<h2 className="text-3xl font-bold mb-2 text-midnight dark:text-white">{t('title')}</h2>
				
				<div className="flex gap-3 mt-4">
					<button
						type="button"
						onClick={() => setIsAlbum(false)}
						className={cn(
							"px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border border-midnight/10 dark:border-white/10",
							!isAlbum 
								? "bg-cyber-pink text-white border-cyber-pink shadow-md" 
								: "bg-transparent text-midnight/60 dark:text-white/90 hover:bg-midnight/5 dark:hover:bg-white/5"
						)}
					>
						Single Track
					</button>
					<button
						type="button"
						onClick={() => setIsAlbum(true)}
						className={cn(
							"px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border border-midnight/10 dark:border-white/10",
							isAlbum 
								? "bg-cyber-pink text-white border-cyber-pink shadow-md" 
								: "bg-transparent text-midnight/60 dark:text-white/90 hover:bg-midnight/5 dark:hover:bg-white/5"
						)}
					>
						Album / Release
					</button>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-10">
				{/* Track Details */}
				<div className="space-y-6">
					<h3 className="text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white">
						<span className="w-1 h-6 bg-cyber-pink rounded-none"></span>
						{isAlbum ? "Album Details" : t('details')}
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white">{isAlbum ? "Album Title" : t('trackTitleLabel')}</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder={isAlbum ? "Enter album title" : t('trackTitlePlaceholder')}
								className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white">Artist Name</label>
							<input
								type="text"
								value={artistName}
								onChange={(e) => setArtistName(e.target.value)}
								placeholder="Enter artist name"
								className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white flex items-center gap-1.5">
								Token Ticker
								<span className="text-[10px] text-midnight/70 dark:text-white/70 font-mono font-normal">(on-chain identifier)</span>
							</label>
							<input
								type="text"
								value={ticker}
								onChange={(e) => {
									setUserEditedTicker(true)
									const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12)
									setTicker(val)
								}}
								placeholder="e.g. FTOIC01"
								className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40 font-mono text-sm"
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white">{t('genreLabel')}</label>
							<div className="relative">
								<Command className="bg-[#FAF9F6] dark:bg-[#0D0D12] text-midnight dark:text-white rounded-none overflow-visible">
									<Popover open={open} onOpenChange={setOpen}>
										<PopoverTrigger asChild>
											<div 
												className={cn(
													"relative flex items-center w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 px-1 text-midnight dark:text-white transition-all cursor-text",
													open ? "border-cyber-pink" : "hover:bg-midnight/10 dark:hover:bg-white/10"
												)}
												onClick={() => setOpen(true)}
											>
												<CommandInput 
													placeholder={genre || t('genrePlaceholder')}
													value={open ? undefined : genre}
													onValueChange={(val) => {
														if (!open) setOpen(true);
													}}
													className="h-11 text-base border-0 focus:ring-0 placeholder:text-midnight/90 dark:placeholder:text-white/90"
													wrapperClassName="border-0 w-full"
												/>
												<IconChevronDown className="absolute right-4 h-4 w-4 shrink-0 opacity-50 pointer-events-none" />
											</div>
										</PopoverTrigger>
										<PopoverContent 
											className="w-[--radix-popover-trigger-width] p-0 bg-[#FAF9F6] dark:bg-[#0D0D12] border-midnight/10 dark:border-white/10 border-t-0 rounded-none"
											onOpenAutoFocus={(e) => e.preventDefault()}
										>
											<CommandList>
												<CommandEmpty>{t('noGenre')}</CommandEmpty>
												<CommandGroup>
													{GENRES.map((g) => (
														<CommandItem
															key={g}
															value={g}
															onSelect={(currentValue) => {
																setGenre(currentValue === genre ? "" : currentValue)
																setOpen(false)
															}}
															className={cn(
																"text-midnight dark:text-white data-[selected=true]:text-midnight dark:data-[selected=true]:text-white cursor-pointer transition-all !bg-transparent",
																genre === g ? "font-bold" : "font-normal data-[selected=true]:font-semibold"
															)}
														>
															<IconCheck
																className={cn(
																	"mr-2 h-4 w-4",
																	genre === g ? "opacity-100 text-cyber-pink" : "opacity-0"
																)}
															/>
															{g}
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</PopoverContent>
									</Popover>
								</Command>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-midnight/80 dark:text-white">{t('descriptionLabel')}</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder={t('descriptionPlaceholder')}
							rows={4}
							className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all resize-none placeholder:text-midnight/60 dark:placeholder:text-white/40"
						/>
					</div>
				</div>

				{/* Pricing */}
				<div className="space-y-6">
					<h3 className="text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white">
						<span className="w-1 h-6 bg-purple-400 rounded-none"></span>
						Pricing & Supply
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white">Price (in ADA)</label>
							<div className="relative">
								<input
									type="number"
									step="0.1"
									min="0.1"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									placeholder="e.g. 5"
									className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 pr-14 text-midnight dark:text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
									required
								/>
								<div className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight/70 dark:text-white/70 text-xs font-bold font-mono">
									ADA
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white">{t('maxSupplyLabel')}</label>
							<input
								type="number"
								min="1"
								value={supply}
								onChange={(e) => setSupply(e.target.value)}
								placeholder={t('maxSupplyPlaceholder')}
								className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
								required
							/>
						</div>
					</div>
				</div>

				{/* Royalties */}
				<div className="space-y-6">
					<h3 className="text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white">
						<span className="w-1 h-6 bg-pink-400 rounded-none"></span>
						Secondary Sales Royalties
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white">Royalty Percentage (%)</label>
							<div className="relative">
								<input
									type="number"
									step="0.1"
									min="0"
									max="100"
									value={royaltyPercentage}
									onChange={(e) => setRoyaltyPercentage(e.target.value)}
									placeholder="e.g. 5"
									className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 pr-14 text-midnight dark:text-white focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
									required
								/>
								<div className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight/70 dark:text-white/70 text-xs font-bold font-mono">
									%
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white">Royalty Address (Optional)</label>
							<input
								type="text"
								value={royaltyAddress}
								onChange={(e) => setRoyaltyAddress(e.target.value)}
								placeholder="Defaults to creator address"
								className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40 font-mono text-xs"
							/>
						</div>
					</div>
				</div>

				{/* Media */}
				<div className="space-y-6">
					<h3 className="text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white">
						<span className="w-1 h-6 bg-blue-400 rounded-none"></span>
						{t('media')}
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{isAlbum ? (
							<div className="space-y-4 col-span-1 md:col-span-2">
								<label className="text-sm font-medium text-midnight/80 dark:text-white">Album Tracks</label>
								<div className="space-y-4">
									{albumTracks.map((track, idx) => (
										<div key={track.id} className="p-4 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
											<div className="flex-1 space-y-2 w-full">
												<label className="text-xs font-semibold text-midnight/60 dark:text-white/90">Track {idx + 1} Title</label>
												<input
													type="text"
													placeholder="Track Title"
													value={track.title}
													onChange={(e) => updateAlbumTrack(idx, 'title', e.target.value)}
													className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-3 py-2 text-sm text-midnight dark:text-white focus:outline-none focus:border-cyber-pink"
													required
												/>
											</div>
											<div className="flex-1 space-y-2 w-full">
												<label className="text-xs font-semibold text-midnight/60 dark:text-white/90">Audio File</label>
												<div className="flex items-center gap-2">
													<label className="cursor-pointer bg-midnight/10 dark:bg-white/10 hover:bg-white/20 text-midnight dark:text-white px-3 py-2 rounded-none text-xs font-medium transition-colors">
														{track.file ? "Change" : "Choose File"}
														<input
															type="file"
															accept="audio/*"
															onChange={(e) => handleAlbumTrackFileChange(idx, e)}
															className="hidden"
														/>
													</label>
													<span className="text-xs text-midnight/60 dark:text-white/90 truncate max-w-[150px]">
														{track.file ? track.file.name : "No file selected"}
													</span>
												</div>
											</div>
											<div className="text-xs text-midnight/70 dark:text-white/70 min-w-[60px] text-right font-mono">
												{track.duration ? track.duration.replace('PT', '').replace('M', ':').replace('S', '') : '--:--'}
											</div>
											<button
												type="button"
												onClick={() => removeAlbumTrack(idx)}
												className="text-red-400 hover:text-red-300 p-2"
												disabled={albumTracks.length <= 1}
											>
												<IconTrash size={16} />
											</button>
										</div>
									))}
									<button
										type="button"
										onClick={addAlbumTrack}
										className="w-full py-3 bg-midnight/10 dark:bg-white/10 hover:bg-midnight/20 text-midnight dark:text-white text-sm font-medium transition-colors border border-dashed border-midnight/20 dark:border-white/20 flex items-center justify-center gap-1.5"
									>
										<IconPlus size={16} /> Add Track
									</button>
								</div>
							</div>
						) : (
							/* Audio Upload */
							<div className="space-y-2">
								<label className="text-sm font-medium text-midnight/80 dark:text-white">{t('audioLabel')}</label>
								<div
									className={`border-2 border-dashed rounded-none h-64 flex flex-col items-center justify-center gap-4 transition-all bg-midnight/[0.02] dark:bg-white/[0.02] group
                  ${audioFile ? 'border-cyber-pink/50 bg-cyber-pink/[0.05]' : 'border-midnight/10 dark:border-white/10 hover:border-midnight/30 dark:hover:border-white/30 hover:bg-midnight/5 dark:hover:bg-white/5'}`}
								>
									<div className={`p-4 rounded-none transition-colors ${audioFile ? 'bg-cyber-pink/20 text-cyber-pink' : 'bg-midnight/5 dark:bg-white/5 text-midnight/70 dark:text-white/40 group-hover:text-midnight dark:hover:text-white'}`}>
										<IconMusic size={32} />
									</div>
									<div className="text-center px-4">
										<p className="text-sm text-midnight/80 dark:text-white mb-1 font-medium truncate max-w-[200px]">
											{audioFile ? audioFile.name : t('dragDrop')}
										</p>
										<p className="text-xs text-midnight/70 dark:text-white/70 mb-4">{audioFile ? (audioFile.size / 1024 / 1024).toFixed(2) + ' MB' : t('audioHint')}</p>
										<label className="cursor-pointer inline-block">
											<span className="bg-midnight/10 dark:bg-white/10 hover:bg-white/20 text-midnight dark:text-white px-5 py-2.5 rounded-none text-sm font-medium transition-colors">
												{audioFile ? t('changeFile') : t('chooseFile')}
											</span>
											<input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
										</label>
									</div>
								</div>
							</div>
						)}

						{/* Cover Art Upload */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white">{t('coverArtLabel')}</label>
							<div
								className={`border-2 border-dashed rounded-none h-64 flex flex-col items-center justify-center gap-4 transition-all bg-midnight/[0.02] dark:bg-white/[0.02] group relative overflow-hidden
                ${coverFile ? 'border-purple-400/50' : 'border-midnight/10 dark:border-white/10 hover:border-midnight/30 dark:hover:border-white/30 hover:bg-midnight/5 dark:hover:bg-white/5'}`}
							>
								{coverFile ? (
									<>
										<div className="absolute inset-0 w-full h-full">
											<img
												src={URL.createObjectURL(coverFile)}
												alt="Preview"
												className="w-full h-full object-cover opacity-50 blur-sm"
											/>
											<div className="absolute inset-0 bg-black/40"></div>
										</div>
										<div className="relative z-10 flex flex-col items-center">
											<img
												src={URL.createObjectURL(coverFile)}
												alt="Preview"
												className="w-32 h-32 object-cover rounded-none shadow-2xl mb-4 border border-midnight/20 dark:border-white/20"
											/>
											<p className="text-xs text-midnight/60 dark:text-white/90 mb-2 truncate max-w-[200px]">{coverFile.name}</p>
										</div>
									</>
								) : (
									<>
										<div className="p-4 rounded-none bg-midnight/5 dark:bg-white/5 text-midnight/70 dark:text-white/40 group-hover:text-midnight dark:hover:text-white transition-colors">
											<IconPhoto size={32} />
										</div>
										<div className="text-center">
											<p className="text-sm text-midnight/60 dark:text-white/90 mb-1">Drag and drop your cover art or click to browse</p>
											<p className="text-xs text-midnight/60 dark:text-white/60 mb-4">{t('coverArtHint')}</p>
										</div>
									</>
								)}

								<div className="relative z-10 text-center">
									<label className="cursor-pointer inline-block">
										<span className="bg-midnight/10 dark:bg-white/10 hover:bg-white/20 text-midnight dark:text-white px-5 py-2.5 rounded-none text-sm font-medium transition-colors backdrop-blur-sm">
											{coverFile ? t('changeCover') : t('chooseFile')}
										</span>
										<input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Collaborators */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white">
								<span className="w-1 h-6 bg-green-400 rounded-none"></span>
								{t('collaborators')}
							</h3>
							<p className="text-[10px] text-midnight/70 dark:text-white/70 mt-1 font-medium">Configure collaborator payment addresses for instant sales payouts on Cardano.</p>
						</div>
						<button
							type="button"
							onClick={addCollaborator}
							className="text-sm text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20 px-3 py-1.5 rounded-none flex items-center gap-1.5 transition-colors font-medium"
						>
							<IconPlus size={16} />
							{t('addCollaborator')}
						</button>
					</div>

					<div className="space-y-3">
						{/* Uploader Share (Read-only) */}
						<div className="flex gap-3 items-start p-3 bg-purple-400/5 border border-purple-400/20 rounded-none mb-4">
							<div className="flex-1 flex items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center text-purple-400 uppercase font-bold text-xs">Me</div>
								<div>
									<p className="text-sm font-medium text-midnight/90 dark:text-white">You (Uploader)</p>
									<p className="text-[10px] text-midnight/70 dark:text-white/70 font-mono truncate">{cardanoAddress || 'No Cardano wallet connected'}</p>
								</div>
							</div>
							<div className="w-28 relative">
								<div className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white text-sm text-center font-bold">
									{Math.max(0, 100 - collaborators.reduce((sum, c) => sum + (Number(c.split) || 0), 0))}
								</div>
								<div className="absolute right-3 top-1/2 -translate-y-1/2 text-midnight/70 dark:text-white/70 text-xs font-bold">%</div>
							</div>
							<div className="w-[44px]"></div>
						</div>

						{collaborators.map((collaborator, index) => (
							<div key={index} className="flex gap-3 items-start animate-fade-in group">
								<div className="flex-1">
									<input
										type="text"
										value={collaborator.address}
										onChange={(e) => updateCollaborator(index, 'address', e.target.value)}
										placeholder="Cardano wallet address (addr1...)"
										className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50 transition-all font-mono"
									/>
								</div>
								<div className="w-28 relative">
									<input
										type="number"
										value={collaborator.split}
										onChange={(e) => updateCollaborator(index, 'split', e.target.value)}
										placeholder="Split %"
										className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50 transition-all text-center"
									/>
									<div className="absolute right-3 top-1/2 -translate-y-1/2 text-midnight/70 dark:text-white/70 text-xs font-bold">%</div>
								</div>
								<button
									type="button"
									onClick={() => removeCollaborator(index)}
									className="p-3 text-midnight/50 dark:text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-none transition-colors"
									aria-label={t('remove')}
								>
									<IconTrash size={20} />
								</button>
							</div>
						))}
						{collaborators.length === 0 && (
							<div className="text-center py-8 border border-white/5 rounded-none bg-midnight/[0.02] dark:bg-white/[0.02]">
								<p className="text-sm text-midnight/70 dark:text-white/70 italic">{t('collaboratorsHint')}</p>
							</div>
						)}
					</div>
				</div>

				{/* Status & Tracking */}
				{publishedSongId !== null && (
					<div className="bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/10 dark:border-white/10 p-4 space-y-3">
						<div className="flex items-center justify-between text-xs">
							<span className="text-midnight/70 dark:text-white/70 uppercase tracking-wider font-bold">Catalog Status</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-midnight/80 dark:text-white">Song ID: {publishedSongId.toString()}</span>
							<span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-none font-bold">PUBLISHED</span>
						</div>
					</div>
				)}

				{/* Insufficient Balance Warning */}
				{cardanoAddress && adaBalance !== null && adaBalance < 2000000n && (
					<div className="bg-red-500/10 border border-red-500/30 p-5 text-red-400 text-xs space-y-3 rounded-none backdrop-blur-sm">
						<div className="flex items-center justify-between">
							<p className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
								<span>⚠️</span> INSUFFICIENT WALLET BALANCE
							</p>
							<span className="text-[10px] font-mono px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/40">
								{CARDANO_NETWORK.toUpperCase()}
							</span>
						</div>
						<p className="leading-relaxed">
							Your wallet address <code className="font-mono bg-red-950/40 px-1 py-0.5 border border-red-500/20 text-white">{cardanoAddress.slice(0, 10)}...{cardanoAddress.slice(-8)}</code> has less than 2 ADA ({(Number(adaBalance) / 1000000).toFixed(2)} ADA). You need at least 2 ADA to cover minting transaction fees and the minimum UTxO storage deposit on {CARDANO_NETWORK}.
						</p>

						{CARDANO_NETWORK === 'Mainnet' ? (
							<div className="pt-1 flex items-center">
								<a
									href={`https://utxos.dev/onramp${cardanoAddress ? `?address=${encodeURIComponent(cardanoAddress)}` : ''}`}
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => notifyOnRampInitiated()}
									className="inline-flex items-center justify-center px-5 py-2.5 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-none transition-all text-xs shadow-lg uppercase tracking-wider cursor-pointer"
								>
									Fund your wallet with ADA
								</a>
							</div>
						) : (
							<div className="pt-1 flex items-center gap-3">
								<a
									href="https://docs.cardano.org/cardano-testnet/tools/faucet/"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 text-white font-bold hover:bg-red-500/30 transition-all text-xs uppercase tracking-wider"
								>
									Request Free Test ADA (Cardano Preprod Faucet) →
								</a>
							</div>
						)}
					</div>
				)}

				{/* Attestation Checkbox */}
				{publishedSongId === null && (
					<div className="flex items-start gap-3 p-4 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none">
						<input
							type="checkbox"
							id="attestation"
							checked={attested}
							onChange={(e) => setAttested(e.target.checked)}
							className="mt-1 h-4 w-4 rounded-none border-midnight/20 dark:border-white/20 text-cyber-pink focus:ring-cyber-pink bg-transparent cursor-pointer"
						/>
						<label htmlFor="attestation" className="text-sm font-medium text-midnight/80 dark:text-white cursor-pointer select-none">
							I own or have licensed all content I am minting, and agree to the Terms of Service.
						</label>
					</div>
				)}

				{/* Action Bar */}
				<div className="pt-8 flex flex-col gap-4">
					{publishedSongId !== null ? (
						<div className="flex gap-4">
							<div className="flex-1 bg-[#1DB954]/10 border border-[#1DB954] text-[#1DB954] font-medium py-4 px-6 rounded-none flex items-center justify-center gap-2 cursor-default">
								<IconCheck size={20} />
								PUBLISHED & READY ON-CHAIN
							</div>
						</div>
					) : (
						<button
							type="submit"
							disabled={
								isUploading || 
								isAssetsUploading || 
								(!isAlbum && !audioFile) || 
								(isAlbum && albumTracks.some(t => !t.file || !t.title)) || 
								!coverFile || 
								!cardanoAddress ||
								!attested
							}
							className="w-full bg-[#B794F4] hover:bg-[#A080E0] text-black font-bold py-4 px-6 rounded-none flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group text-xs uppercase tracking-widest"
						>
							{isUploading ? (
								<>
									<div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
									Publishing...
								</>
							) : (
								<>
									<IconUpload size={20} className="group-hover:-translate-y-0.5 transition-transform" />
									{isAlbum ? "Publish Album" : "Publish Track"}
								</>
							)}
						</button>
					)}
				</div>
			</form>
		</div>
	)
}
