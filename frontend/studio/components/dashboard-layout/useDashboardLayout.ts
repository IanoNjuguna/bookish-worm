'use client'

import React, { useState, useEffect } from 'react'
import { useCardano } from '@/components/Providers'
import { useAudio } from '@/components/audio'
import type { AudioContextType } from '@/components/audio/AudioPlayer.types'

export interface UseDashboardLayoutReturn {
  mounted: boolean
  headerMenuOpen: boolean
  setHeaderMenuOpen: (open: boolean) => void
  desktopSidebarOpen: boolean
  setDesktopSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  effectiveAddress: AudioContextType['effectiveAddress']
  playerState: AudioContextType['playerState']
  sidebarTrack: AudioContextType['sidebarTrack']
  isSidebarOpen: boolean
  toggleSidebar: () => void
  handleLogout: () => void
}

export function useDashboardLayout(): UseDashboardLayoutReturn {
  const [mounted, setMounted] = useState(false)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)

  const { disconnect } = useCardano()

  const {
    playerState,
    effectiveAddress,
    sidebarTrack,
    isSidebarOpen,
    toggleSidebar,
    logout: backendLogout,
  } = useAudio()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = React.useCallback(() => {
    try {
      backendLogout()
      disconnect()
    } catch (e) {
      console.error('Logout failed', e)
    }
  }, [disconnect, backendLogout])

  return {
    mounted,
    headerMenuOpen,
    setHeaderMenuOpen,
    desktopSidebarOpen,
    setDesktopSidebarOpen,
    effectiveAddress,
    playerState,
    sidebarTrack,
    isSidebarOpen,
    toggleSidebar,
    handleLogout,
  }
}
