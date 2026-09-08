'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { logger } from '@/lib/logger'
import type { Track, AudioPlayerState } from './AudioPlayer.types'

export function useAudioPlayer(): AudioPlayerState {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    currentIndex: 0,
    duration: 0,
    currentTime: 0,
  })

  const [volume, setVolumeState] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  const setDuration = useCallback((duration: number) => {
    setState(prev => ({ ...prev, duration }))
  }, [])

  const setCurrentTime = useCallback((currentTime: number) => {
    setState(prev => ({ ...prev, currentTime }))
  }, [])

  const play = useCallback((track: Track, tracks?: Track[]) => {
    setState(prev => {
      const queue = tracks || [track]
      const index = queue.findIndex(t => t.id === track.id)
      return {
        ...prev,
        currentTrack: track,
        queue,
        currentIndex: index >= 0 ? index : 0,
        isPlaying: true,
      }
    })
  }, [])

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }))
    audioRef.current?.pause()
  }, [])

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }))
    if (audioRef.current) {
      audioRef.current.play().catch((e: any) => {
        if (e.name !== 'AbortError') {
          logger.warn('[useAudioPlayer] Resume failed:', e)
        }
      })
    }
  }, [])

  const togglePlayPause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }, [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
    setState(prev => ({ ...prev, currentTime: time }))
  }, [])

  const next = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) return prev
      const nextIndex = (prev.currentIndex + 1) % prev.queue.length
      return {
        ...prev,
        currentTrack: prev.queue[nextIndex],
        currentIndex: nextIndex,
        isPlaying: true,
      }
    })
  }, [])

  const previous = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) return prev
      const prevIndex =
        prev.currentIndex === 0
          ? prev.queue.length - 1
          : prev.currentIndex - 1
      return {
        ...prev,
        currentTrack: prev.queue[prevIndex],
        currentIndex: prevIndex,
        isPlaying: true,
      }
    })
  }, [])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted(m => !m)
  }, [])

  // Sync audio source and play state with the current track.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const sync = async () => {
      if (state.currentTrack) {
        const trackUrl = state.currentTrack.url || ''
        if (trackUrl && audio.src !== trackUrl) {
          audio.src = trackUrl
          audio.load()
          setState(prev => ({ ...prev, currentTime: 0, duration: 0 }))
        }
      }

      if (state.isPlaying) {
        try {
          await audio.play()
        } catch (e: any) {
          if (e.name !== 'AbortError') {
            logger.warn('[useAudioPlayer] Play failed:', e)
          }
        }
      } else {
        audio.pause()
      }
    }

    sync()
  }, [state.currentTrack, state.isPlaying])

  // Keep the audio element volume in sync with player state.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Global spacebar shortcut.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }
      if (e.code === 'Space') {
        e.preventDefault()
        togglePlayPause()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlayPause])

  return useMemo(
    () => ({
      audioRef,
      ...state,
      play,
      pause,
      resume,
      togglePlayPause,
      next,
      previous,
      seek,
      setDuration,
      setCurrentTime,
      volume,
      isMuted,
      setVolume,
      toggleMute,
    }),
    [state, play, pause, resume, togglePlayPause, next, previous, seek, setDuration, setCurrentTime, volume, isMuted, setVolume, toggleMute]
  )
}

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  queue: Track[]
  currentIndex: number
  duration: number
  currentTime: number
}
