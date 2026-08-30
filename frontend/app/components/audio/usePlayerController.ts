'use client'

import type { RefObject } from 'react'
import { useAudio } from './useAudio'
import { useCardano } from '@/components/Providers'
import { useAudioQueue } from './useAudioQueue'
import type { QueueActions } from './useAudioQueue'
import { useTrackDetails } from './useTrackDetails'
import { useMediaSession } from './useMediaSession'
import { usePlayerMint } from './usePlayerMint'
import type { AudioPlayerState, Track } from './AudioPlayer.types'

export interface UsePlayerControllerResult {
  track: Track | null
  queue: QueueActions
  ticker: string | null
  isMinting: boolean
  hasOwned: boolean
  isSoldOut: boolean
  isSidebarOpen: boolean
  audioRef: RefObject<HTMLAudioElement | null>
  onMint: (e: React.MouseEvent) => Promise<void>
  onOpenSidebar: () => void
  onToggleSidebar: () => void
  handleTimeUpdate: (e: React.SyntheticEvent<HTMLAudioElement>) => void
  handleLoadedMetadata: (e: React.SyntheticEvent<HTMLAudioElement>) => void
  handleDurationChange: (e: React.SyntheticEvent<HTMLAudioElement>) => void
  handleEnded: () => void
}

export function usePlayerController(playerState: AudioPlayerState): UsePlayerControllerResult {
  const {
    effectiveAddress,
    isConnected: isAuthenticated,
    login,
    toggleSidebar,
    isSidebarOpen,
    handleOpenSidebar,
    getValidToken,
  } = useAudio()
  const { lucid } = useCardano()
  const queue = useAudioQueue(playerState)
  const { currentTrack, isPlaying, togglePlayPause, setDuration, setCurrentTime, audioRef } = playerState
  const { hasOwned, mintData, uploaderAddress, albumId, albumName, ticker, setHasOwned } = useTrackDetails(currentTrack, effectiveAddress)

  useMediaSession({
    currentTrack,
    isPlaying,
    albumName,
    ticker,
    togglePlayPause,
    next: queue.next,
    previous: queue.previous,
  })

  const { isMinting, handleMint } = usePlayerMint({
    currentTrack,
    uploaderAddress,
    albumId,
    ticker,
    hasOwned,
    setHasOwned,
    lucid,
    isAuthenticated,
    login,
    getValidToken,
  })

  const isSoldOut = mintData.max > 0 && mintData.minted >= mintData.max
  const track = currentTrack as Track | null

  const openSidebar = () => {
    if (!track) return
    handleOpenSidebar({
      ...track,
      token_id: track.id,
      name: track.title,
      artist: track.creator,
      image_url: track.cover,
    })
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => setCurrentTime(e.currentTarget.currentTime)
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (e.currentTarget.duration && e.currentTarget.duration !== Infinity) setDuration(e.currentTarget.duration)
  }
  const handleDurationChange = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (e.currentTarget.duration && e.currentTarget.duration !== Infinity) setDuration(e.currentTarget.duration)
  }
  const handleEnded = () => queue.handleEnded()

  return {
    track,
    queue,
    ticker,
    isMinting,
    hasOwned,
    isSoldOut,
    isSidebarOpen,
    audioRef,
    onMint: handleMint,
    onOpenSidebar: openSidebar,
    onToggleSidebar: toggleSidebar,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleDurationChange,
    handleEnded,
  }
}
