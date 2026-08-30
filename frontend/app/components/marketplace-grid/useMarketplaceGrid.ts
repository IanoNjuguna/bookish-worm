'use client'

import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import { Track } from '@/lib/types'
import { API_URL } from './MarketplaceGrid.constants'
import type {
  SongCardDerivedProps,
  UseMarketplaceGridOptions,
  UseMarketplaceGridReturn,
} from './MarketplaceGrid.types'

export function useMarketplaceGrid({
  searchQuery,
  genre,
  limit,
  splitPlaylist,
}: UseMarketplaceGridOptions): UseMarketplaceGridReturn {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const fetchTracks = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true)
    else setLoading(true)

    try {
      const currentOffset = isLoadMore ? offset + limit : 0
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (genre && genre !== 'All') params.append('genre', genre)
      params.append('limit', limit.toString())
      params.append('offset', currentOffset.toString())

      const fetchUrl = `${API_URL.replace(/\/$/, '')}/songs?${params.toString()}`

      const headers: Record<string, string> = {}
      const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
      if (authData && authData !== 'null') {
        try {
          const parsedAuth = JSON.parse(authData) as { accessToken?: string } | null
          if (parsedAuth && parsedAuth.accessToken) {
            headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`
          }
        } catch (e) {
          logger.error('Failed to parse auth data for tracks fetch', e)
        }
      }

      const res = await fetch(fetchUrl, { headers })
      if (res.ok) {
        const data: Track[] = await res.json()
        if (isLoadMore) {
          setTracks(prev => [...prev, ...data])
          setOffset(currentOffset)
        } else {
          setTracks(data)
          setOffset(0)
        }
        setHasMore(data.length === limit)
      } else {
        logger.error(`Failed to fetch tracks: ${res.status} ${res.statusText}`)
      }
    } catch (error) {
      logger.error('Failed to fetch tracks:', error instanceof Error && error.message ? error.message : error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [searchQuery, genre])

  // Filter out any child tracks (tracks that belong to an album)
  const mainReleases = tracks.filter(t => !t.album_id)

  // Identify token_ids that act as album parents (i.e. some track in the DB has it as its album_id)
  const albumIds = new Set(tracks.filter(t => t.album_id).map(t => t.album_id))

  // Separate singles and albums
  const singles = mainReleases.filter(t => !albumIds.has(t.token_id))
  const albums = mainReleases.filter(t => albumIds.has(t.token_id))

  const isReleaseOwned = (track: Track) => {
    if (albumIds.has(track.token_id)) {
      const albumTracksList = tracks.filter(t => t.album_id === track.token_id)
      return albumTracksList.length > 0 && albumTracksList.every(t => t.is_owned)
    }
    return track.is_owned
  }

  const collectedTracks = splitPlaylist ? mainReleases.filter(isReleaseOwned) : []
  const discoverSingles = splitPlaylist ? singles.filter(t => !t.is_owned) : singles
  const discoverAlbums = albums.filter(t => !isReleaseOwned(t))

  // Helper function to prepare album props
  const getSongCardProps = (track: Track): SongCardDerivedProps => {
    const isAlbum = albumIds.has(track.token_id)
    const albumTracksList = isAlbum ? tracks.filter(t => t.album_id === track.token_id) : []
    const trackCount = isAlbum ? albumTracksList.length : 0
    const playCount = isAlbum
      ? (track.play_count || 0) + albumTracksList.reduce((sum, t) => sum + (t.play_count || 0), 0)
      : track.play_count

    return {
      isAlbum,
      trackCount,
      albumTracks: albumTracksList,
      playCount
    }
  }

  return {
    tracks,
    loading,
    loadingMore,
    hasMore,
    collectedTracks,
    discoverSingles,
    discoverAlbums,
    fetchTracks,
    getSongCardProps,
  }
}
