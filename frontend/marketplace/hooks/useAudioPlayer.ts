'use client';

import { useState, useRef, useCallback } from 'react'

export interface Track {
  id: number
  title: string
  creator: string
  price?: string
  cover: string
  collaborators: number
  url?: string
  genre?: string
  description?: string
  uploader_address?: string
}

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  queue: Track[]
  currentIndex: number
  duration: number
  currentTime: number
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    currentIndex: 0,
    duration: 0,
    currentTime: 0,
  })

  const play = useCallback((track: Track, tracks?: Track[]) => {
    setPlayerState((prev) => {
      const newQueue = tracks || [track]
      const index = newQueue.findIndex((t) => t.id === track.id)
      return {
        ...prev,
        currentTrack: track,
        queue: newQueue,
        currentIndex: index >= 0 ? index : 0,
        isPlaying: true,
      }
    })
  }, [])

  const pause = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isPlaying: false }))
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  const resume = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isPlaying: true }))
    if (audioRef.current) {
      audioRef.current.play().catch((e) => {
        if (e.name !== 'AbortError') {
          console.error('[AudioPlayer] Resume failed:', e)
        }
      })
    }
  }, [])

  const togglePlayPause = useCallback(() => {
    if (playerState.isPlaying) {
      pause()
    } else {
      resume()
    }
  }, [playerState.isPlaying, pause, resume])

  const next = useCallback(() => {
    setPlayerState((prev) => {
      const nextIndex = (prev.currentIndex + 1) % prev.queue.length
      const nextTrack = prev.queue[nextIndex]
      return {
        ...prev,
        currentTrack: nextTrack,
        currentIndex: nextIndex,
      }
    })
  }, [])

  const previous = useCallback(() => {
    setPlayerState((prev) => {
      const prevIndex =
        prev.currentIndex === 0
          ? prev.queue.length - 1
          : prev.currentIndex - 1
      const prevTrack = prev.queue[prevIndex]
      return {
        ...prev,
        currentTrack: prevTrack,
        currentIndex: prevIndex,
      }
    })
  }, [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
    setPlayerState((prev) => ({ ...prev, currentTime: time }))
  }, [])

  const setDuration = useCallback((duration: number) => {
    setPlayerState((prev) => ({ ...prev, duration }))
  }, [])

  const setCurrentTime = useCallback((time: number) => {
    setPlayerState((prev) => ({ ...prev, currentTime: time }))
  }, [])

  return {
    audioRef,
    ...playerState,
    play,
    pause,
    resume,
    togglePlayPause,
    next,
    previous,
    seek,
    setDuration,
    setCurrentTime,
  }
}
