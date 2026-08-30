'use client'

import { useCallback, useMemo } from 'react'
import { useCardano } from '@/components/Providers'
import { useBackendAuth } from '@/hooks/useBackendAuth'
import { useAudioPlayer } from './useAudioPlayer'
import { useStreamAnalytics } from './useStreamAnalytics'
import { useSidebar } from './useSidebar'
import type { AudioContextType, Track } from './AudioPlayer.types'

export interface UseAudioProviderResult {
  value: AudioContextType
}

export function useAudioProvider(): UseAudioProviderResult {
  const playerState = useAudioPlayer()
  const { isConnected } = useCardano()
  const {
    accessToken,
    getValidToken,
    login: baseLogin,
    isAuthenticated: isAuth,
    isCheckingAuth,
    isLoading,
    logout,
    effectiveAddress,
  } = useBackendAuth()

  const { recordedTracks, setRecordedTracks, lastTrackId } = useStreamAnalytics({
    playerState,
    accessToken,
  })
  const { sidebarTrack, isSidebarOpen, handleOpenSidebar, toggleSidebar, setSidebarTrack } = useSidebar({
    playerState,
  })

  const login = useCallback(() => {
    if (isAuth && accessToken) {
      return Promise.resolve(accessToken)
    }
    return baseLogin()
  }, [isAuth, accessToken, baseLogin])

  const handlePlayTrack = useCallback(
    (track: Track, tracks?: Track[]) => {
      if (!isConnected) {
        login()
        return
      }

      if (playerState.currentTrack?.id === track.id) {
        playerState.togglePlayPause()
        return
      }

      const trackId = track.id
      if (trackId !== lastTrackId) {
        setRecordedTracks(prev => {
          const next = new Set(prev)
          next.delete(trackId)
          return next
        })
      }

      playerState.play(track, tracks)

      if (isSidebarOpen) {
        setSidebarTrack(track)
      }
    },
    [playerState, isConnected, login, isSidebarOpen, lastTrackId, setRecordedTracks, setSidebarTrack]
  )

  const value = useMemo<AudioContextType>(
    () => ({
      playerState,
      handlePlayTrack,
      effectiveAddress: effectiveAddress || undefined,
      isConnected,
      isAuthenticated: isAuth,
      isCheckingAuth,
      isLoading,
      accessToken,
      getValidToken,
      sidebarTrack,
      isSidebarOpen,
      handleOpenSidebar,
      toggleSidebar,
      login,
      logout,
    }),
    [
      playerState,
      handlePlayTrack,
      effectiveAddress,
      isConnected,
      isAuth,
      isCheckingAuth,
      isLoading,
      accessToken,
      getValidToken,
      sidebarTrack,
      isSidebarOpen,
      handleOpenSidebar,
      toggleSidebar,
      login,
      logout,
    ]
  )

  return { value }
}
