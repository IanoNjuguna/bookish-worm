'use client'

import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import SongCard from './SongCard'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface Track {
  id?: number
  token_id: number
  title?: string
  cover?: string
  creator?: string
  url?: string
  collaborators?: number
  name: string
  artist: string
  image_url: string
  audio_url: string
  streaming_url?: string
  genre?: string
  price?: string
  chain_id?: string
  is_owned?: boolean
  play_count?: number
  description?: string
  uploader_address?: string
  album_id?: number | null
}

const API_URL = '/api-backend'
const TRANSIENT_HTTP_STATUSES = new Set([500, 502, 503, 504])

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function MarketplaceGrid({
  onPlay,
  currentTrackId,
  isPlaying,
  searchQuery = '',
  genre = '',
  limit = 24,
  isSidebarOpen = false,
  splitPlaylist = false
}: {
  onPlay?: (track: Track, tracks: Track[]) => void,
  currentTrackId?: number | null,
  isPlaying?: boolean,
  searchQuery?: string,
  genre?: string,
  limit?: number,
  isSidebarOpen?: boolean,
  splitPlaylist?: boolean
}) {
  const t = useTranslations('marketplace')
  const tHome = useTranslations('home')
  const tLibrary = useTranslations('library')
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchTracks = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true)
    else setLoading(true)

    try {
      setFetchError(null)
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
          const parsedAuth = JSON.parse(authData)
          if (parsedAuth && parsedAuth.accessToken) {
            headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`
          }
        } catch (e) {
          logger.error('Failed to parse auth data for tracks fetch', e)
        }
      }

      const maxAttempts = 3
      let lastStatus: number | null = null
      let lastStatusText = ''
      let lastErrorBody = ''
      let responseData: Track[] | null = null

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const attemptHeaders = { ...headers }

        // If upstream keeps failing and we have auth attached, try a no-auth request once.
        if (attempt === 2 && attemptHeaders['Authorization']) {
          delete attemptHeaders['Authorization']
        }

        const res = await fetch(fetchUrl, { headers: attemptHeaders })

        if (res.ok) {
          responseData = await res.json()
          break
        }

        lastStatus = res.status
        lastStatusText = res.statusText
        lastErrorBody = await res.text().catch(() => '')

        const shouldRetry = TRANSIENT_HTTP_STATUSES.has(res.status) && attempt < maxAttempts
        if (!shouldRetry) {
          break
        }

        await delay(attempt * 400)
      }

      if (responseData) {
        const data = responseData
        if (isLoadMore) {
          setTracks(prev => [...prev, ...data])
          setOffset(currentOffset)
        } else {
          setTracks(data)
          setOffset(0)
        }
        setHasMore(data.length === limit)
      } else {
        const status = lastStatus ?? 0
        const statusText = lastStatusText || 'Request failed'
        logger.error(
          `Failed to fetch tracks: ${status} ${statusText}`,
          lastErrorBody ? { responseBody: lastErrorBody, fetchUrl } : { fetchUrl }
        )
        setFetchError(status >= 500 ? 'Service temporarily unavailable. Please try again shortly.' : 'Unable to load tracks right now.')
      }
    } catch (error: any) {
      logger.error('Failed to fetch tracks:', error?.message || error)
      setFetchError('Network error while loading tracks. Please retry.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [searchQuery, genre])

  if (loading) {
    return (
      <div className={cn(
        "grid gap-6",
        isSidebarOpen
          ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          : "grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      )}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-midnight/5 dark:bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!tracks.length) {
    return (
      <div className="bg-midnight/[0.02] dark:bg-white/[0.02] border border-white/5 p-20 text-center">
        <p className="text-midnight/70 dark:text-white/40 italic text-sm">{fetchError || t('noSongs')}</p>
      </div>
    )
  }

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
  const getSongCardProps = (track: Track) => {
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

  const gridClass = cn(
    "grid gap-6",
    isSidebarOpen
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      : "grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
  )

  return (
    <div className="space-y-8">
      {splitPlaylist && collectedTracks.length > 0 ? (
        <>
          {/* My Playlist Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-midnight dark:text-white">{tLibrary('title')}</h2>
            <div className={gridClass}>
              {collectedTracks.map((track) => {
                const cardProps = getSongCardProps(track)
                return (
                  <SongCard
                    key={track.token_id}
                    tokenId={track.token_id}
                    name={track.name}
                    artist={track.artist}
                    imageUrl={track.image_url}
                    audioUrl={track.audio_url}
                    genre={track.genre}
                    price={track.price}
                    onPlay={onPlay ? () => onPlay(track, tracks) : undefined}
                    isPlaying={isPlaying && currentTrackId === track.token_id}
                    is_owned={cardProps.isAlbum ? cardProps.albumTracks.every(t => t.is_owned) : track.is_owned}
                    playCount={cardProps.playCount}
                    isAlbum={cardProps.isAlbum}
                    trackCount={cardProps.trackCount}
                    albumTracks={cardProps.albumTracks}
                    onPlayTrack={onPlay ? (subTrack) => onPlay(subTrack, tracks) : undefined}
                  />
                )
              })}
            </div>
          </div>

          {/* Discover Music Section */}
          {discoverSingles.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-midnight/10 dark:border-white/10">
              <h2 className="text-2xl font-bold text-midnight dark:text-white">{tHome('discoverMusic')}</h2>
              <div className={gridClass}>
                {discoverSingles.map((track) => {
                  const cardProps = getSongCardProps(track)
                  return (
                    <SongCard
                      key={track.token_id}
                      tokenId={track.token_id}
                      name={track.name}
                      artist={track.artist}
                      imageUrl={track.image_url}
                      audioUrl={track.audio_url}
                      genre={track.genre}
                      price={track.price}
                      onPlay={onPlay ? () => onPlay(track, tracks) : undefined}
                      isPlaying={isPlaying && currentTrackId === track.token_id}
                      is_owned={track.is_owned}
                      playCount={cardProps.playCount}
                      isAlbum={false}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Top Albums Section */}
          {discoverAlbums.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-midnight/10 dark:border-white/10">
              <h2 className="text-2xl font-bold text-midnight dark:text-white">Top Albums</h2>
              <div className={gridClass}>
                {discoverAlbums.map((track) => {
                  const cardProps = getSongCardProps(track)
                  return (
                    <SongCard
                      key={track.token_id}
                      tokenId={track.token_id}
                      name={track.name}
                      artist={track.artist}
                      imageUrl={track.image_url}
                      audioUrl={track.audio_url}
                      genre={track.genre}
                      price={track.price}
                      onPlay={onPlay ? () => onPlay(track, tracks) : undefined}
                      isPlaying={isPlaying && currentTrackId === track.token_id}
                      is_owned={cardProps.albumTracks.every(t => t.is_owned)}
                      playCount={cardProps.playCount}
                      isAlbum
                      trackCount={cardProps.trackCount}
                      albumTracks={cardProps.albumTracks}
                      onPlayTrack={onPlay ? (subTrack) => onPlay(subTrack, tracks) : undefined}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Discover Music Section */}
          {discoverSingles.length > 0 && (
            <div className="space-y-4">
              {splitPlaylist && (
                <h2 className="text-2xl font-bold text-midnight dark:text-white mb-4">{tHome('discoverMusic')}</h2>
              )}
              <div className={gridClass}>
                {discoverSingles.map((track) => {
                  const cardProps = getSongCardProps(track)
                  return (
                    <SongCard
                      key={track.token_id}
                      tokenId={track.token_id}
                      name={track.name}
                      artist={track.artist}
                      imageUrl={track.image_url}
                      audioUrl={track.audio_url}
                      genre={track.genre}
                      price={track.price}
                      onPlay={onPlay ? () => onPlay(track, tracks) : undefined}
                      isPlaying={isPlaying && currentTrackId === track.token_id}
                      is_owned={track.is_owned}
                      playCount={cardProps.playCount}
                      isAlbum={false}
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Top Albums Section */}
          {discoverAlbums.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-midnight/10 dark:border-white/10">
              <h2 className="text-2xl font-bold text-midnight dark:text-white">Top Albums</h2>
              <div className={gridClass}>
                {discoverAlbums.map((track) => {
                  const cardProps = getSongCardProps(track)
                  return (
                    <SongCard
                      key={track.token_id}
                      tokenId={track.token_id}
                      name={track.name}
                      artist={track.artist}
                      imageUrl={track.image_url}
                      audioUrl={track.audio_url}
                      genre={track.genre}
                      price={track.price}
                      onPlay={onPlay ? () => onPlay(track, tracks) : undefined}
                      isPlaying={isPlaying && currentTrackId === track.token_id}
                      is_owned={cardProps.albumTracks.every(t => t.is_owned)}
                      playCount={cardProps.playCount}
                      isAlbum
                      trackCount={cardProps.trackCount}
                      albumTracks={cardProps.albumTracks}
                      onPlayTrack={onPlay ? (subTrack) => onPlay(subTrack, tracks) : undefined}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={() => fetchTracks(true)}
            disabled={loadingMore}
            className="px-8 py-3 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5 transition-all font-bold uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
