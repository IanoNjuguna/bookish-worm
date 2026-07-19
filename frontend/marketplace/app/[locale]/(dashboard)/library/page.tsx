'use client'

import React, { useState, useEffect } from 'react'
import MyStudioGrid from '@/components/MyStudioGrid'
import { useTranslations } from 'next-intl'
import { useAudio } from '@/components/AudioProvider'
import { IconPlaylistAdd as Library } from '@tabler/icons-react'

export default function LibraryDashboard() {
  const tLibrary = useTranslations('library')
  const { playerState, handlePlayTrack, isConnected: isPlayerConnected, effectiveAddress } = useAudio()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">{tLibrary('title')}</h2>
        <p className="text-midnight/60 dark:text-white/60">{tLibrary('subtitle')}</p>
      </div>
      {isPlayerConnected ? (
        <MyStudioGrid
          address={effectiveAddress || undefined}
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
          })))}
        />
      ) : (
        <div className="p-12 text-center rounded-xl bg-midnight/5 dark:bg-white-2 border border-midnight/[0.08] dark:border-white/[0.08]">
          <Library className="w-12 h-12 mx-auto mb-4 text-lavender/40" />
          <h3 className="text-xl font-semibold mb-2">{tLibrary('connectWallet')}</h3>
          <p className="text-midnight/60 dark:text-white/60">{tLibrary('connectToView')}</p>
        </div>
      )}
    </div>
  )
}
