'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'
import { IPFS_GATEWAY } from './AudioPlayer.constants'
import type { Track } from './AudioPlayer.types'

interface UseMediaSessionArgs {
  currentTrack: Track | null
  isPlaying: boolean
  albumName: string | null
  ticker: string | null
  togglePlayPause: () => void
  next: () => void
  previous: () => void
}

export function useMediaSession({
  currentTrack,
  isPlaying,
  albumName,
  ticker,
  togglePlayPause,
  next,
  previous,
}: UseMediaSessionArgs) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator) || !currentTrack) return

    try {
      const artworkUrl = (currentTrack.cover || '').replace('ipfs://', IPFS_GATEWAY)
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.creator,
        album: ticker ? `$${ticker} · Doba` : albumName ? `${albumName} · Doba` : 'Single · Doba',
        artwork: artworkUrl
          ? [
              { src: artworkUrl, sizes: '96x96', type: 'image/jpeg' },
              { src: artworkUrl, sizes: '128x128', type: 'image/jpeg' },
              { src: artworkUrl, sizes: '192x192', type: 'image/jpeg' },
              { src: artworkUrl, sizes: '256x256', type: 'image/jpeg' },
              { src: artworkUrl, sizes: '384x384', type: 'image/jpeg' },
              { src: artworkUrl, sizes: '512x512', type: 'image/jpeg' },
            ]
          : [],
      })
      navigator.mediaSession.setActionHandler('play', togglePlayPause)
      navigator.mediaSession.setActionHandler('pause', togglePlayPause)
      navigator.mediaSession.setActionHandler('previoustrack', previous)
      navigator.mediaSession.setActionHandler('nexttrack', next)
    } catch (err) {
      logger.error('useMediaSession: Failed to set mediaSession metadata', err)
    }
  }, [currentTrack, isPlaying, albumName, ticker, togglePlayPause, next, previous])
}
