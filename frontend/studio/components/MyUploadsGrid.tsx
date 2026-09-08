'use client'

import React from 'react'
import SongCard from './SongCard'
import { useMyUploadsGrid } from './my-uploads-grid/useMyUploadsGrid'
import { UploadsSkeleton } from './my-uploads-grid/UploadsSkeleton'
import { UploadsEmptyState } from './my-uploads-grid/UploadsEmptyState'
import type { MyUploadsGridProps } from './my-uploads-grid/MyUploadsGrid.types'

export default function MyUploadsGrid({ address, onUploadsLoaded }: MyUploadsGridProps) {
	const { uploads, loading, playerState, handlePlayTrack } = useMyUploadsGrid({ address, onUploadsLoaded })

	if (loading) {
		return <UploadsSkeleton />
	}

	if (!uploads.length) {
		return <UploadsEmptyState />
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
