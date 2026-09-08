'use client'

import { useEffect, useState, useCallback } from 'react'
import type React from 'react'
import type { AudioPlayerState } from './AudioPlayer.types'

interface UseSidebarArgs {
  playerState: AudioPlayerState
}

export interface UseSidebarReturn {
  sidebarTrack: any | null
  isSidebarOpen: boolean
  handleOpenSidebar: (track: any) => void
  toggleSidebar: () => void
  setSidebarTrack: React.Dispatch<React.SetStateAction<any | null>>
}

export function useSidebar({ playerState }: UseSidebarArgs): UseSidebarReturn {
  const [sidebarTrack, setSidebarTrack] = useState<any | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (playerState.currentTrack && isSidebarOpen) {
      const sidebarId = sidebarTrack?.id ?? sidebarTrack?.token_id
      const currentTrack = playerState.currentTrack as any
      const currentId = currentTrack?.id ?? currentTrack?.token_id
      if (!sidebarTrack || sidebarId !== currentId) {
        setSidebarTrack(playerState.currentTrack)
      }
    }
  }, [playerState.currentTrack?.id, isSidebarOpen, sidebarTrack, playerState.currentTrack])

  const handleOpenSidebar = useCallback((track: any) => {
    const trackId = track?.id ?? track?.token_id
    setIsSidebarOpen(prev => {
      if (prev) {
        const currentSidebarId = sidebarTrack?.id ?? sidebarTrack?.token_id
        if (currentSidebarId === trackId) {
          return false
        }
      }
      setSidebarTrack(track)
      return true
    })
  }, [sidebarTrack])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  return {
    sidebarTrack,
    isSidebarOpen,
    handleOpenSidebar,
    toggleSidebar,
    setSidebarTrack,
  }
}
