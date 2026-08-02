import { logger } from '@/lib/logger'
import React, { useEffect, useState } from 'react'
import { IconMusic } from '@tabler/icons-react'
import SongCard from './SongCard'
import { useAudio } from './AudioProvider'

interface Track {
	token_id: number
	name: string
	artist: string
	image_url: string
	audio_url: string
	streaming_url?: string
	description?: string
	genre?: string
	tx_hash?: string
	price?: string
	uploader_address?: string
}

interface MyUploadsGridProps {
	address?: string
}

const API_URL = '/api-backend'

export default function MyUploadsGrid({ address }: MyUploadsGridProps) {
	const { playerState, handlePlayTrack } = useAudio()
	const [uploads, setUploads] = useState<Track[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUploads = async () => {
			if (!address) {
				setLoading(false)
				return
			}

			try {
				const fetchUrl = `${API_URL.replace(/\/$/, '')}/songs?artist=${address}`
				const res = await fetch(fetchUrl)
				if (!res.ok) throw new Error('Failed to fetch user uploads')
				const userTracks: Track[] = await res.json()
				setUploads(userTracks)
			} catch (error) {
				logger.error('Profile: Error fetching uploads', error)
			} finally {
				setLoading(false)
			}
		}

		fetchUploads()
	}, [address])

	if (loading) {
		return (
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="aspect-[3/4] bg-midnight/5 dark:bg-white/5 animate-pulse" />
				))}
			</div>
		)
	}

	if (!uploads.length) {
		return (
			<div className="glass p-12 text-center rounded-none bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08]">
				<IconMusic className="w-12 h-12 mx-auto mb-4 text-midnight/50 dark:text-white/20" />
				<h3 className="text-xl font-semibold mb-2">No Uploads Yet</h3>
				<p className="text-midnight/70 dark:text-white/40 italic text-sm">You haven't published any songs on Doba. Head to the Upload tab to mint your first track!</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
			{uploads.map((track) => (
				<SongCard
					key={track.token_id}
					tokenId={track.token_id}
					name={track.name}
					artist={track.artist}
					imageUrl={track.image_url}
					audioUrl={track.audio_url}
					genre={track.genre}
					price={track.price}
					navigateOnClick={true}
					onPlay={() => handlePlayTrack({
						id: track.token_id,
						title: track.name,
						creator: track.artist,
						cover: track.image_url,
						url: track.streaming_url || track.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
						collaborators: 0,
						price: track.price,
						genre: track.genre,
						description: track.description,
						uploader_address: track.uploader_address
					}, uploads.map(t => ({
						id: t.token_id,
						title: t.name,
						creator: t.artist,
						cover: t.image_url,
						url: t.streaming_url || t.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
						collaborators: 0,
						price: t.price,
						genre: t.genre,
						description: t.description,
						uploader_address: t.uploader_address
					})))}
					isPlaying={playerState.isPlaying && playerState.currentTrack?.id === track.token_id}
				/>
			))}
		</div>
	)
}
