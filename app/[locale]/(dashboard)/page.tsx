'use client'

import { useState, useEffect } from 'react'
import MarketplaceGrid from '@/components/MarketplaceGrid'
import { useAudio } from '@/components/AudioProvider'

export default function HomeDashboard() {
  const { playerState, handlePlayTrack, isSidebarOpen } = useAudio()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <MarketplaceGrid
        splitPlaylist
        isSidebarOpen={isSidebarOpen}
        currentTrackId={playerState.currentTrack?.id}
        isPlaying={playerState.isPlaying}
        onPlay={(track, tracks) => handlePlayTrack({
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
        }, tracks.map(t => ({
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
        })))} />
    </div>
  )
}
