'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAudio } from '@/components/audio'
import { useCardano } from '@/components/Providers'
import { useTrackDetail } from './useTrackDetail'
import { useTrackMint } from './useTrackMint'
import { useTrackDownload } from './useTrackDownload'
import { useTrackShare } from './useTrackShare'
import type { Track } from './TrackDetailClient.types'

export function useTrackDetailPage(initialTrack: Track | null) {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const locale = (params?.locale as string) || 'en'

  const { playerState, handlePlayTrack, getValidToken, login, isAuthenticated } = useAudio()
  const { address, lucid } = useCardano()
  const { track, loading, refresh } = useTrackDetail(id, initialTrack, address)

  const [hasOwned, setHasOwned] = useState(initialTrack?.is_owned ?? false)

  const { isMinting, handleMint } = useTrackMint({
    track,
    hasOwned,
    address,
    lucid,
    isAuthenticated,
    login,
    getValidToken,
    onSuccess: () => {
      setHasOwned(true)
      refresh()
    },
  })
  const { handleDownload } = useTrackDownload({ track, address, hasOwned, getValidToken })
  const { handleShare, handleCopyLink } = useTrackShare(track, locale)

  const isPlaying = playerState.currentTrack?.id === track?.token_id && playerState.isPlaying

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(`/${locale}`)
    }
  }

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
      uploader_address: track.uploader_address,
    })
  }

  const mintCount = track?.mint_count || 0
  const maxSupply = track?.max_supply ? parseInt(track.max_supply) : 5000
  const isSoldOut = maxSupply > 0 && mintCount >= maxSupply

  return {
    track,
    loading,
    locale,
    playerState,
    isPlaying,
    hasOwned,
    isMinting,
    isSoldOut,
    mintCount,
    maxSupply,
    handleBack,
    togglePlay,
    handleMint,
    handleDownload,
    handleShare,
    handleCopyLink,
    onNotFoundBack: () => router.push(`/${locale}/assets`),
  }
}
