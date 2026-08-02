import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { IconEye, IconMusic, IconMicrophone, IconPlayerPause, IconPlayerPlay, IconSquareCheckFilled } from '@tabler/icons-react'
import { DobaVisualizer } from '@/components/icons/DobaVisualizer'
import { useTranslations } from 'next-intl'
import { useAudio } from './AudioProvider'

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
  description?: string
  genre?: string
  tx_hash?: string
  price?: string
  created_at?: string
  is_owned?: boolean
  minted_count?: number
  max_supply?: number
  play_count?: number
  uploader_address?: string
}

interface MyStudioGridProps {
  address?: string
  onPlay?: (track: Track, tracks: Track[]) => void
  currentTrackId?: number | null
  isPlaying?: boolean
}

const API_URL = '/api-backend'

export default function MyStudioGrid({ address, onPlay, currentTrackId, isPlaying }: MyStudioGridProps) {
  const t = useTranslations('library')
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 glass animate-pulse rounded-none" />
        ))}
      </div>
    )
  }

  if (!ownedTracks.length) {
    return (
      <div className="glass p-12 text-center rounded-none bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08]">
        <IconMusic className="w-12 h-12 mx-auto mb-4 text-midnight/50 dark:text-white/20" />
        <h3 className="text-xl font-semibold mb-2">{t('noSongs')}</h3>
        <p className="text-midnight/70 dark:text-white/40 italic text-sm">{t('noSongsDesc') || "You don't own any songs yet. Head to the marketplace to discover music!"}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* List Header */}
      <div className="hidden md:grid md:grid-cols-[48px_1fr_120px_100px_160px_60px] gap-4 px-4 py-2 border-b border-white/5 text-xs font-medium text-midnight/70 dark:text-white/40 uppercase tracking-widest mb-2">
        <div className="flex justify-center">#</div>
        <div>Title</div>
        <div className="hidden md:block">Genre</div>
        <div className="hidden md:block">Streams</div>
        <div className="hidden lg:block">Date Added</div>
        <div className="flex justify-center">
          <IconEye size={14} className="opacity-40" />
        </div>
      </div>

      {/* List Rows */}
      <div className="flex flex-col">
        {ownedTracks.map((track, index) => (
          <div
            key={track.token_id}
            onMouseEnter={() => setHoveredTrackId(track.token_id)}
            onMouseLeave={() => setHoveredTrackId(null)}
            className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[48px_1fr_120px_100px_160px_60px] gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-2 hover:bg-midnight/5 dark:hover:bg-white/5 border-b border-white/[0.02] md:border-none transition-colors group items-center"
          >
            {/* Index / Play Button */}
            <div className="flex justify-center items-center">
              {hoveredTrackId === track.token_id || (isPlaying && currentTrackId === track.token_id) ? (
                <button
                  type="button"
                  onClick={() => onPlay?.({
                    ...track,
                    id: track.token_id,
                    title: track.name,
                    creator: track.artist,
                    cover: track.image_url,
                    url: track.streaming_url || track.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
                    collaborators: 0,
                  }, ownedTracks)}
                  className="w-7 h-7 md:w-6 md:h-6 flex items-center justify-center bg-white text-black rounded-none shadow-sm transition-all active:scale-90"
                >
                  {isPlaying && currentTrackId === track.token_id ? (
                    <IconPlayerPause size={14} className="fill-black" />
                  ) : (
                    <IconPlayerPlay size={14} className="fill-black ml-0.5" />
                  )}
                </button>
              ) : (
                <span className="text-xs md:text-sm font-medium text-midnight/50 dark:text-white/20 tabular-nums">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
              )}
            </div>

            <div
              className="flex items-center gap-5 min-w-0 cursor-pointer"
              onClick={() => onPlay?.({
                ...track,
                id: track.token_id,
                title: track.name,
                creator: track.artist,
                cover: track.image_url,
                url: track.streaming_url || track.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
                collaborators: 0,
              }, ownedTracks)}
            >
              <div className="w-12 h-12 md:w-10 md:h-10 rounded-none overflow-hidden flex-shrink-0 border border-midnight/10 dark:border-white/10">
                <img
                  src={(track.image_url || '').replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                  alt={track.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm md:text-base font-bold text-midnight dark:text-white truncate group-hover:text-cyber-pink transition-colors tracking-tight flex items-center gap-1.5 min-w-0">
                  <span className="truncate">{track.name}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {track.is_owned && (
                      <IconSquareCheckFilled size={12} className="text-[#1DB954] flex-shrink-0" title="Collected" />
                    )}
                    {track.max_supply && track.max_supply > 0 && track.minted_count !== undefined && track.minted_count >= track.max_supply && (
                      <DobaVisualizer size={12} className="text-[#FF1F8A] flex-shrink-0" />
                    )}
                  </div>
                </h4>
                <p className="text-[9px] md:text-xs text-midnight/50 dark:text-white/50 truncate flex items-center gap-1 font-medium uppercase tracking-wider mt-0.5">
                  <IconMicrophone size={10} className="text-cyber-pink/50 flex-shrink-0" />
                  <span className="truncate">{track.artist}</span>
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center text-xs text-midnight/50 dark:text-white/50">
              <span className="bg-midnight/5 dark:bg-white/5 px-2 py-0.5 rounded-none border border-white/5 font-bold uppercase tracking-widest text-[9px]">{track.genre || 'RARE'}</span>
            </div>

            {/* Streams */}
            <div className="hidden md:flex items-center text-[10px] text-midnight/60 dark:text-white/60 font-mono">
              <IconPlayerPlay size={10} className="mr-1 text-cyber-pink/40" />
              {track.play_count || 0}
            </div>

            {/* Date Added */}
            <div className="hidden lg:flex items-center text-xs text-midnight/70 dark:text-white/40 font-mono">
              {track.created_at ? new Date(track.created_at).toLocaleDateString() : 'N/A'}
            </div>

            {/* View Details Button */}
            <div className="flex justify-center pr-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 md:h-8 md:w-8 p-0 hover:bg-midnight/5 dark:hover:bg-white/5 text-midnight/60 dark:text-white/30 hover:text-midnight dark:hover:text-white rounded-none border border-transparent hover:border-white/5"
                onClick={() => handleOpenSidebar(track)}
              >
                <IconEye size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
