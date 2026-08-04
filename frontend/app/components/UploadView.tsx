'use client'

import { logger } from '@/lib/logger'
import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { IconUpload, IconX, IconPlus, IconMusic, IconPhoto, IconTrash, IconCheck, IconChevronDown, IconLoader2, IconAlertTriangle, IconClock } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { GENRES } from '@/constants/genres'
import { useCardano } from '@/components/Providers'
import { toast } from 'sonner'
import { useAudio } from '@/components/AudioProvider'
import { mintTrackOnChain, formatTxError } from '@/lib/contractHelper'

interface Collaborator {
	address: string
	split: number
}

const DIRECT_BACKEND_URL = (process.env.NEXT_PUBLIC_DIRECT_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://bookish-worm-production.up.railway.app').replace(/\/$/, '')
const API_URL = '/api-backend'

async function uploadAssetsWithFallback(formData: FormData, headers: Record<string, string>): Promise<Response> {
	try {
		const directRes = await fetch(`${DIRECT_BACKEND_URL}/upload-assets`, {
			method: 'POST',
			headers,
			body: formData,
		})
		if (directRes.ok) return directRes
		console.warn("Direct asset upload returned non-200 status, attempting proxy fallback...")
	} catch (err) {
		console.warn("Direct asset upload network error, attempting proxy fallback...", err)
	}

	return await fetch(`${API_URL}/upload-assets`, {
		method: 'POST',
		headers,
		body: formData,
	})
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
	const [price, setPrice] = useState('10') // Default to 10 ADA
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

	// Publishing progress tracking state
	const [uploadStep, setUploadStep] = useState<number>(0) // 0: idle, 1: IPFS, 2: Metadata, 3: Minting, 4: Catalog, 5: Done
	const [uploadStatusText, setUploadStatusText] = useState<string>('')
	
	// Target progress values set by async workflow steps
	const [targetSeg1, setTargetSeg1] = useState<number>(0) // Media IPFS (#D946EF - Muted Pink)
	const [targetSeg2, setTargetSeg2] = useState<number>(0) // CIP-60 Metadata (#A855F7 - Muted Purple)
	const [targetSeg3, setTargetSeg3] = useState<number>(0) // On-Chain Minting (#3B82F6 - Muted Blue)
	const [targetSeg4, setTargetSeg4] = useState<number>(0) // Catalog Indexing (#10B981 - Muted Emerald)

	// Display progress values smoothly ticking towards target values
	const [displaySeg1, setDisplaySeg1] = useState<number>(0)
	const [displaySeg2, setDisplaySeg2] = useState<number>(0)
	const [displaySeg3, setDisplaySeg3] = useState<number>(0)
	const [displaySeg4, setDisplaySeg4] = useState<number>(0)

	// Elapsed timer for modal
	const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)

	useEffect(() => {
		if (!isUploading) {
			setElapsedSeconds(0)
			return
		}

		const timer = setInterval(() => {
			setElapsedSeconds(prev => prev + 1)
		}, 1000)

		return () => clearInterval(timer)
	}, [isUploading])

	const formatElapsed = (sec: number) => {
		const m = Math.floor(sec / 60)
		const s = sec % 60
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
	}

	// Smooth gradual progress interpolation interval
	useEffect(() => {
		if (!isUploading) {
			setDisplaySeg1(0)
			setDisplaySeg2(0)
			setDisplaySeg3(0)
			setDisplaySeg4(0)
			setTargetSeg1(0)
			setTargetSeg2(0)
			setTargetSeg3(0)
			setTargetSeg4(0)
			return
		}

		const timer = setInterval(() => {
			setDisplaySeg1(prev => (prev < targetSeg1 ? Math.min(prev + 1, targetSeg1) : prev))
			setDisplaySeg2(prev => (prev < targetSeg2 ? Math.min(prev + 1, targetSeg2) : prev))
			setDisplaySeg3(prev => (prev < targetSeg3 ? Math.min(prev + 1, targetSeg3) : prev))
			setDisplaySeg4(prev => (prev < targetSeg4 ? Math.min(prev + 1, targetSeg4) : prev))
		}, 35)

		return () => clearInterval(timer)
	}, [isUploading, targetSeg1, targetSeg2, targetSeg3, targetSeg4])

	// Prevent accidental tab closure or refresh while publishing
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (isUploading) {
				e.preventDefault()
				e.returnValue = 'Publishing release in progress. Please do not close or refresh this page.'
				return e.returnValue
			}
		}
		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [isUploading])

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
				if (!token) return

				const bgHeaders: Record<string, string> = {}
				const apiKey = process.env.NEXT_PUBLIC_API_KEY
				if (apiKey && apiKey.trim() !== '') {
					bgHeaders['X-API-Key'] = apiKey.trim()
				}
				if (token && token.trim() !== '') {
					bgHeaders['Authorization'] = `Bearer ${token.trim()}`
				}

				const response = await uploadAssetsWithFallback(formData, bgHeaders)

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
		setUploadStep(1)
		setTargetSeg1(20)
		setTargetSeg2(0)
		setTargetSeg3(0)
		setTargetSeg4(0)
		setUploadStatusText("Initiating IPFS asset pinning...")
		const mainToast = toast.loading("Initiating upload process...")

		try {
			let currentAudioHash = audioHash || ''
			let currentImageHash = imageHash || ''
			let currentAudioName = audioFilename || (audioHash ? `audio_${audioHash}.mp3` : '')
			let currentImageName = imageFilename || (imageHash ? `cover_${imageHash}.jpg` : '')
			let currentStreamingUrl = streamingUrl || ''

			const getHeaders = () => {
				const headers: Record<string, string> = {}
				const apiKey = process.env.NEXT_PUBLIC_API_KEY
				if (apiKey && apiKey.trim() !== '') {
					headers['X-API-Key'] = apiKey.trim()
				}
				if (token && token.trim() !== '') {
					headers['Authorization'] = `Bearer ${token.trim()}`
				}
				return headers
			}

			if (isAlbum) {
				// 1. Upload cover image first
				setTargetSeg1(35)
				setUploadStatusText("Uploading album cover image to IPFS...")
				toast.loading("Uploading album cover image...", { id: mainToast })
				const imageFormData = new FormData()
				imageFormData.append('image', coverFile!)
				imageFormData.append('title', title)

				const imgRes = await uploadAssetsWithFallback(imageFormData, getHeaders())

				if (!imgRes.ok) throw new Error(`Cover image upload failed: ${await imgRes.text()}`)
				const imgData = await imgRes.json()
				currentImageHash = imgData.imageHash
				currentImageName = imgData.imageName

				// 2. Upload each track audio file sequentially
				for (let i = 0; i < albumTracks.length; i++) {
					const t = albumTracks[i]
					const trackProg = 35 + Math.round(((i + 1) / albumTracks.length) * 65)
					setTargetSeg1(trackProg)
					setUploadStatusText(`Uploading album track ${i + 1}/${albumTracks.length}: "${t.title}" to IPFS...`)
					toast.loading(`Uploading album track ${i + 1}/${albumTracks.length}: ${t.title}...`, { id: mainToast })
					const trackFormData = new FormData()
					trackFormData.append('audio', t.file!)
					trackFormData.append('title', t.title)

					const trackRes = await uploadAssetsWithFallback(trackFormData, getHeaders())

					if (!trackRes.ok) throw new Error(`Track "${t.title}" audio upload failed: ${await trackRes.text()}`)
					const trackData = await trackRes.json()
					t.audioHash = trackData.audioHash
					t.audioName = trackData.audioName
					t.streamingUrl = trackData.streamingUrl
				}
				
				currentAudioHash = albumTracks[0].audioHash
				currentAudioName = albumTracks[0].audioName
				currentStreamingUrl = albumTracks[0].streamingUrl
			} else {
				// Upload single track assets if not already uploaded or if hashes are missing
				if (!currentAudioHash || !currentImageHash || !assetsCid) {
					setTargetSeg1(65)
					setUploadStatusText("Uploading cover artwork and audio track to IPFS...")
					toast.loading("Uploading media to IPFS...", { id: mainToast })
					const formData = new FormData()
					formData.append('audio', audioFile!)
					formData.append('image', coverFile!)
					formData.append('title', title)

					const assetRes = await uploadAssetsWithFallback(formData, getHeaders())

					if (!assetRes.ok) throw new Error(`Media upload failed: ${await assetRes.text()}`)
					const assetData = await assetRes.json()

					currentAudioHash = assetData.audioHash
					currentImageHash = assetData.imageHash
					currentAudioName = assetData.audioName
					currentImageName = assetData.imageName
					currentStreamingUrl = assetData.streamingUrl
				}
			}

			// Validate IPFS hashes before proceeding to on-chain minting
			if (!currentAudioHash || !currentImageHash) {
				throw new Error("Media files were not successfully pinned to IPFS. Please re-select your audio and cover files, then try again.")
			}

			setTargetSeg1(100)

			// 2. Upload Metadata
			setUploadStep(2)
			setTargetSeg2(45)
			setUploadStatusText("Generating CIP-60 release metadata JSON & pinning to IPFS...")
			toast.loading("Generating release metadata...", { id: mainToast })
			toast.loading("Generating release metadata...", { id: mainToast })
			const metaResponse = await fetch(`${API_URL.replace(/\/$/, '')}/upload-metadata`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...getHeaders()
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

			if (!metaResponse.ok) throw new Error(`Metadata generation failed: ${await metaResponse.text()}`)
			const { metadataUri } = await metaResponse.json()
			setTargetSeg2(100)

			// Generate a unique token_id (millisecond timestamp)
			const tokenId = Math.floor(Date.now())

			// 2.5 Mint track/album on Cardano chain using Lucid smart contract
			setUploadStep(3)
			setTargetSeg3(35)
			setUploadStatusText("Awaiting wallet signature & submitting on-chain Cardano transaction...")
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
			setTargetSeg3(100)

			// 3. Register Release and Tracks in Backend (Catalog Index)
			setUploadStep(4)
			setTargetSeg4(45)
			setUploadStatusText("Registering release catalog & recording creator copy...")
			toast.loading("Registering release catalog...", { id: mainToast })

			if (isAlbum) {
				// Register the main Album release entry
				const albumResponse = await fetch(`${API_URL.replace(/\/$/, '')}/songs`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						...getHeaders()
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
				if (!albumResponse.ok) throw new Error(`Backend album indexing failed: ${await albumResponse.text()}`)

				// Register each track inside the album
				for (let idx = 0; idx < albumTracks.length; idx++) {
					const t = albumTracks[idx]
					const trackResponse = await fetch(`${API_URL.replace(/\/$/, '')}/songs`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							...getHeaders()
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
					if (!trackResponse.ok) throw new Error(`Backend track "${t.title}" indexing failed: ${await trackResponse.text()}`)
				}
			} else {
				// Register Single Track
				const songResponse = await fetch(`${API_URL.replace(/\/$/, '')}/songs`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						...getHeaders()
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
				if (!songResponse.ok) throw new Error(`Backend indexing failed: ${await songResponse.text()}`)
			}

			// 4. Register Collaborators in Backend
			if (collaborators.length > 0) {
				for (const collab of collaborators) {
					if (!collab.address) continue
					await fetch(`${API_URL.replace(/\/$/, '')}/collaborators`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							...getHeaders()
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
						...getHeaders()
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
			setTargetSeg4(100)
			setUploadStep(5)
			setUploadStatusText("Release published successfully!")
			toast.success(isAlbum ? "Album published successfully!" : "Track published successfully!", { id: mainToast })

		} catch (error: any) {
			logger.error('Submit Error', error)
			toast.error(formatTxError(error), { id: mainToast })
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
								placeholder={isAlbum ? "e.g. Bitcoin" : t('trackTitlePlaceholder')}
								className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white">Artist Name</label>
							<input
								type="text"
								value={artistName}
								onChange={(e) => setArtistName(e.target.value)}
								placeholder="e.g. Satoshi Nakamoto"
								className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
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
								placeholder="e.g. BTC"
								className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40 font-mono text-sm"
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
									step="1"
									min="10"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									placeholder="e.g. 10"
									className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 pr-14 text-midnight dark:text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
									required
								/>
								<div className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight/70 dark:text-white/70 text-xs font-bold font-mono">
									ADA
								</div>
							</div>
							<p className="text-xs text-midnight/60 dark:text-white/40">
								Recommended minimum price is 10 ADA
							</p>
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
					<div>
						<h3 className="text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white mb-1">
							<span className="w-1 h-6 bg-pink-400 rounded-none"></span>
							Secondary Sales Royalties
						</h3>
						<p className="text-xs text-midnight/70 dark:text-white/60 pl-3">
							💡 Earn recurring royalties on-chain whenever fans trade your song tokens on secondary marketplaces.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-midnight/80 dark:text-white">Royalty Percentage (%)</label>
							<div className="relative">
								<input
									type="number"
									value="5"
									disabled
									readOnly
									className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 pr-14 text-midnight dark:text-white/90 cursor-not-allowed opacity-75 font-mono select-none"
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
								placeholder="Defaults to your wallet address"
								className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 transition-all placeholder:text-midnight/70 dark:placeholder:text-white/50 font-mono text-xs"
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
									className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center gap-4 transition-all bg-midnight/[0.02] dark:bg-white/[0.02] group
                  ${audioFile ? 'border-cyber-pink/50 bg-cyber-pink/[0.05]' : 'border-midnight/10 dark:border-white/10 hover:border-midnight/30 dark:hover:border-white/30 hover:bg-midnight/5 dark:hover:bg-white/5'}`}
								>
									<div className={`p-4 rounded-xl transition-colors ${audioFile ? 'bg-cyber-pink/20 text-cyber-pink' : 'bg-midnight/5 dark:bg-white/5 text-midnight/70 dark:text-white/40 group-hover:text-midnight dark:group-hover:text-white'}`}>
										<IconMusic size={32} />
									</div>
									<div className="text-center px-4">
										<p className="text-sm text-midnight/80 dark:text-white mb-1 font-medium truncate max-w-[200px]">
											{audioFile ? audioFile.name : t('dragDrop')}
										</p>
										<p className="text-xs text-midnight/70 dark:text-white/70 mb-4">{audioFile ? (audioFile.size / 1024 / 1024).toFixed(2) + ' MB' : t('audioHint')}</p>
										<label className="cursor-pointer inline-block">
											<span className="bg-midnight/10 dark:bg-white/10 hover:bg-white/20 text-midnight dark:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
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
								className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center gap-4 transition-all bg-midnight/[0.02] dark:bg-white/[0.02] group relative overflow-hidden
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
												className="w-32 h-32 object-cover rounded-xl shadow-2xl mb-4 border border-midnight/20 dark:border-white/20"
											/>
											<p className="text-xs text-midnight/60 dark:text-white/90 mb-2 truncate max-w-[200px]">{coverFile.name}</p>
										</div>
									</>
								) : (
									<>
										<div className="p-4 rounded-xl bg-midnight/5 dark:bg-white/5 text-midnight/70 dark:text-white/40 group-hover:text-midnight dark:group-hover:text-white transition-colors">
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
										<span className="bg-midnight/10 dark:bg-white/10 hover:bg-white/20 text-midnight dark:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm">
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
					<div className="bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-xs space-y-2">
						<p className="font-bold uppercase tracking-wider">⚠️ INSUFFICIENT WALLET BALANCE</p>
						<p>Your wallet address has less than 2 ADA ({ (Number(adaBalance) / 1000000).toFixed(2) } ADA). You need at least 2 ADA to cover minting transaction fees and the minimum UTxO storage deposit on the Cardano Preprod network.</p>
						<p>You can request free test ADA using the <a href="https://docs.cardano.org/cardano-testnet/tools/faucet/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white hover:text-cyber-pink">Cardano Preprod Faucet</a>.</p>
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
								(!isAlbum && !audioFile) || 
								(isAlbum && albumTracks.some(t => !t.file || !t.title)) || 
								!coverFile || 
								!cardanoAddress ||
								!attested
							}
							className="w-full bg-[#B794F4] hover:bg-[#A080E0] text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group text-xs uppercase tracking-widest"
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

			{/* Real-Time Aesthetic Angular Matte Progress Modal */}
			{isUploading && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-transparent backdrop-blur-xl md:backdrop-blur-2xl animate-fade-in">
					<div className="w-full max-w-md bg-[#FAF9F6] dark:bg-[#141419] border border-midnight/20 dark:border-white/20 rounded-none p-6 shadow-2xl space-y-6">
						{/* Top Status Header */}
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-start gap-4">
								<div className="p-3 rounded-none bg-purple-500/10 text-purple-400 shrink-0 border border-purple-500/20">
									<IconLoader2 size={28} className="animate-spin text-[#D946EF]" />
								</div>
								<div className="space-y-1">
									<h3 className="text-base font-bold text-midnight dark:text-white flex items-center gap-2 tracking-tight">
										Publishing Release
									</h3>
									<p className="text-xs font-semibold text-amber-500 flex items-center gap-1.5 uppercase tracking-wide">
										<IconAlertTriangle size={14} className="shrink-0 text-amber-500" />
										Please do not close or refresh this page
									</p>
									<p className="text-xs text-midnight/60 dark:text-white/60">
										Media assets are being pinned to IPFS and signed on Cardano.
									</p>
								</div>
							</div>

							{/* Subtle Elapsed Timer Badge */}
							<div className="flex items-center gap-1 text-[11px] font-mono text-midnight/60 dark:text-white/60 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 px-2 py-1 rounded-none shrink-0" title="Elapsed publishing time">
								<IconClock size={13} className="shrink-0 text-midnight/40 dark:text-white/40" />
								<span>{formatElapsed(elapsedSeconds)}</span>
							</div>
						</div>

						{/* Progress Section */}
						<div className="space-y-2">
							<div className="flex items-center justify-between text-xs">
								<span className="font-medium text-midnight/70 dark:text-white/70 truncate max-w-[260px]">
									{uploadStatusText || "Processing release..."}
								</span>
								<span className="font-extrabold text-midnight dark:text-white font-mono text-sm">
									{Math.round((displaySeg1 * 0.25) + (displaySeg2 * 0.25) + (displaySeg3 * 0.25) + (displaySeg4 * 0.25))}%
								</span>
							</div>

							{/* 4-Color Segmented Angular Progress Bar (Matte Finish) */}
							<div className="w-full bg-midnight/10 dark:bg-white/10 h-3 rounded-none overflow-hidden flex gap-1 p-0.5 border border-midnight/15 dark:border-white/15">
								{/* Segment 1: Media IPFS (Muted Pink #D946EF) */}
								<div 
									className="h-full rounded-none transition-all duration-150 ease-linear bg-[#D946EF]" 
									style={{ width: `${displaySeg1}%` }} 
									title="1. Media IPFS Upload"
								/>
								{/* Segment 2: Metadata (Muted Purple #A855F7) */}
								<div 
									className="h-full rounded-none transition-all duration-150 ease-linear bg-[#A855F7]" 
									style={{ width: `${displaySeg2}%` }} 
									title="2. CIP-60 Metadata"
								/>
								{/* Segment 3: Cardano Minting (Muted Blue #3B82F6) */}
								<div 
									className="h-full rounded-none transition-all duration-150 ease-linear bg-[#3B82F6]" 
									style={{ width: `${displaySeg3}%` }} 
									title="3. On-Chain Minting"
								/>
								{/* Segment 4: Catalog Index (Muted Emerald #10B981) */}
								<div 
									className="h-full rounded-none transition-all duration-150 ease-linear bg-[#10B981]" 
									style={{ width: `${displaySeg4}%` }} 
									title="4. Catalog Indexing"
								/>
							</div>
						</div>

						{/* 4 Steps Checklist */}
						<div className="space-y-3 pt-3 border-t border-midnight/10 dark:border-white/10 text-xs">
							{[
								{ title: "1. Media IPFS Upload", color: "bg-[#D946EF]" },
								{ title: "2. CIP-60 Metadata Generation", color: "bg-[#A855F7]" },
								{ title: "3. On-Chain Cardano Minting", color: "bg-[#3B82F6]" },
								{ title: "4. Catalog Indexing & Finalize", color: "bg-[#10B981]" }
							].map((stepItem, idx) => {
								const stepNum = idx + 1
								const isDone = uploadStep > stepNum
								const isCurrent = uploadStep === stepNum
								return (
									<div key={idx} className="flex items-center justify-between">
										<div className="flex items-center gap-2.5">
											<span className={cn("w-2.5 h-2.5 rounded-none shrink-0", stepItem.color)} />
											<span className={cn(
												"font-medium transition-colors",
												isCurrent ? "text-midnight dark:text-white font-bold" : isDone ? "text-midnight/50 dark:text-white/50" : "text-midnight/30 dark:text-white/30"
											)}>
												{stepItem.title}
											</span>
										</div>
										{isDone ? (
											<IconCheck size={16} className="text-[#10B981] shrink-0" />
										) : isCurrent ? (
											<IconLoader2 size={16} className="animate-spin text-purple-400 shrink-0" />
										) : (
											<span className="text-[10px] text-midnight/30 dark:text-white/30 font-mono">Pending</span>
										)}
									</div>
								)
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
