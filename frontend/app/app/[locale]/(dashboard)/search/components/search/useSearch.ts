'use client'

import { useState, useEffect } from 'react'
import { useAudio } from '@/components/audio'
import type { Track as PlayerTrack } from '@/components/audio'
import type { Track as MarketplaceTrack } from '@/lib/types'
import { SEARCH_DEBOUNCE_MS, IPFS_PROTOCOL_PREFIX, IPFS_GATEWAY_URL } from './Search.constants'
import type { UseSearchReturn } from './Search.types'

function mapToPlayerTrack(track: MarketplaceTrack): PlayerTrack {
  return {
    ...track,
    id: track.token_id,
    title: track.name,
    creator: track.artist,
    cover: track.image_url,
    url: track.streaming_url || track.audio_url.replace(IPFS_PROTOCOL_PREFIX, IPFS_GATEWAY_URL),
    collaborators: 0,
    genre: track.genre,
    description: track.description
  }
}

export function useSearch(): UseSearchReturn {
  const { playerState, handlePlayTrack, isSidebarOpen } = useAudio()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const handleGridPlay = (track: MarketplaceTrack, tracks: MarketplaceTrack[]) => {
    handlePlayTrack(mapToPlayerTrack(track), tracks.map(mapToPlayerTrack))
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    debouncedSearch,
    mounted,
    currentTrackId: playerState.currentTrack?.id,
    isPlaying: playerState.isPlaying,
    isSidebarOpen,
    handleGridPlay,
  }
}
