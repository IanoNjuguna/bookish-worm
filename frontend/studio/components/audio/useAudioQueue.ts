'use client'

import { useState, useCallback } from 'react'
import type { AudioPlayerState, RepeatMode } from './AudioPlayer.types'

export interface QueueActions {
  next: () => void
  previous: () => void
  isShuffle: boolean
  toggleShuffle: () => void
  repeatMode: RepeatMode
  cycleRepeat: () => void
  handleEnded: () => void
}

export function useAudioQueue(playerState: AudioPlayerState): QueueActions {
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off')

  const next = useCallback(() => {
    playerState.next()
  }, [playerState])

  const previous = useCallback(() => {
    playerState.previous()
  }, [playerState])

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev)
  }, [])

  const cycleRepeat = useCallback(() => {
    setRepeatMode(prev => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'))
  }, [])

  const handleEnded = useCallback(() => {
    if (repeatMode === 'one') {
      const audio = playerState.audioRef.current
      if (audio) {
        audio.currentTime = 0
        audio.play().catch((e: any) => {
          if (e.name !== 'AbortError') {
            // ignore auto-play restrictions
          }
        })
      }
    } else {
      playerState.next()
    }
  }, [playerState, repeatMode])

  return {
    next,
    previous,
    isShuffle,
    toggleShuffle,
    repeatMode,
    cycleRepeat,
    handleEnded,
  }
}
