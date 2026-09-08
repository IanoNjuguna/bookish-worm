'use client'

import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import { useAudio } from '@/components/audio'
import { API_URL, IPFS_GATEWAY_URL } from './MyStudioGrid.constants'
import type { Track } from './MyStudioGrid.types'

export interface UseMyStudioGridReturn {
  ownedTracks: Track[]
  loading: boolean
  hoveredTrackId: number | null
  setHoveredTrackId: (id: number | null) => void
  handleOpenSidebar: (track: Track) => void
  playTrack: (track: Track) => void
}

export function toPlayableTrack(track: Track): Track {
  return {
    ...track,
    id: track.token_id,
    title: track.name,
    creator: track.artist,
    cover: track.image_url,
    url: track.streaming_url || track.audio_url.replace('ipfs://', IPFS_GATEWAY_URL),
    collaborators: 0,
  }
}

export function useMyStudioGrid(
  address: string | undefined,
  onPlay?: (track: Track, tracks: Track[]) => void
): UseMyStudioGridReturn {
  const [ownedTracks, setOwnedTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredTrackId, setHoveredTrackId] = useState<number | null>(null)
  const { handleOpenSidebar } = useAudio()

  useEffect(() => {
    const fetchOwnedTracks = async () => {
      if (!address) {
        setLoading(false)
        return
      }

      try {
        const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
        const headers: Record<string, string> = {}
        if (authData) {
          const parsedAuth = JSON.parse(authData)
          if (parsedAuth && parsedAuth.accessToken) {
            headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`
          }
        }

        // 1. Fetch all tracks from backend with ownership status
        const res = await fetch(`${API_URL.replace(/\/$/, '')}/songs`, { headers })
        if (!res.ok) throw new Error('Failed to fetch tracks')
        const allTracks: Track[] = await res.json()

        // 2. Filter for owned tracks
        const owned = allTracks.filter(t => t.is_owned)

        setOwnedTracks(owned)
      } catch (error) {
        logger.error('Library: Error fetching owned tracks', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOwnedTracks()
  }, [address])

  const playTrack = (track: Track) => {
    onPlay?.(toPlayableTrack(track), ownedTracks)
  }

  return {
    ownedTracks,
    loading,
    hoveredTrackId,
    setHoveredTrackId,
    handleOpenSidebar,
    playTrack,
  }
}
