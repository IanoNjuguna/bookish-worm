'use client'

import {
  IconPlayerPlay as Play,
  IconPlayerPause as Pause,
  IconPlayerSkipBack as SkipBack,
  IconPlayerSkipForward as SkipForward,
  IconVolume2,
  IconVolumeOff,
  IconArrowsShuffle,
  IconRepeat,
  IconRepeatOnce,
  IconHeart,
  IconLoader2,
  IconLayoutSidebarRight,
} from '@tabler/icons-react'
import { DobaVisualizer } from '@/components/icons/DobaVisualizer'
import { logger } from '@/lib/logger'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { toast } from 'sonner'
import { useAudio } from './AudioProvider'
import { useCardano } from '@/components/Providers'
import { EXPLORER_URL } from '@/lib/config'
import { buyFractionOnChain, formatTxError } from '@/lib/contractHelper'


interface AudioPlayerProps {
  playerState: ReturnType<typeof useAudioPlayer>
}

export default function AudioPlayer({ playerState }: AudioPlayerProps) {
  const { effectiveAddress, isConnected: isAuthenticated, login, toggleSidebar, isSidebarOpen, handleOpenSidebar, getValidToken } = useAudio()
  const { lucid } = useCardano()
  const {
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    togglePlayPause,
    next,
    previous,
    seek,
    setDuration,
    setCurrentTime,
    audioRef,
  } = playerState

  // Local UI & Cardano state
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  const [isMinting, setIsMinting] = useState(false)
  const [hasOwned, setHasOwned] = useState(false)
  const [mintData, setMintData] = useState({ minted: 0, max: 0 })
  const [uploaderAddress, setUploaderAddress] = useState<string | null>(null)
  const [albumId, setAlbumId] = useState<number | null>(null)
  const [ticker, setTicker] = useState<string | null>(null)

  const progressBarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const locale = useLocale()

  // Real-time ownership checking for current track on Cardano
  const checkOwnership = useCallback(async () => {
    if (!effectiveAddress || !currentTrack) return
    const tokenId = currentTrack.id
    if (tokenId === undefined || tokenId === null) return

    try {
      const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
      const headers: Record<string, string> = {}
      if (authData) {
        const parsedAuth = JSON.parse(authData)
        if (parsedAuth && parsedAuth.accessToken) {
          headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`
        }
      }

      const res = await fetch(`/api-backend/songs/${tokenId}`, { headers })
      if (res.ok) {
        const data = await res.json()
        setHasOwned(!!data.is_owned)
        if (data.uploader_address) {
          setUploaderAddress(data.uploader_address)
        }
        if (data.album_id !== undefined) {
          setAlbumId(data.album_id)
        }
        if (data.ticker) {
          setTicker(data.ticker)
        }
      }
    } catch (e) {
      logger.error('AudioPlayer: Error checking ownership', e)
    }
  }, [effectiveAddress, currentTrack])

  const fetchMintData = useCallback(async () => {
    if (!currentTrack) return
    const tokenId = currentTrack.id
    if (tokenId === undefined || tokenId === null) {
      setMintData({ minted: 0, max: 0 })
      return
    }

    try {
      const res = await fetch(`/api-backend/songs/${tokenId}`)
      if (res.ok) {
        const data = await res.json()
        setMintData({
          minted: Number(data.mint_count || 0),
          max: Number(data.max_supply || 0)
        })
        if (data.uploader_address) {
          setUploaderAddress(data.uploader_address)
        }
        if (data.album_id !== undefined) {
          setAlbumId(data.album_id)
        }
        if (data.ticker) {
          setTicker(data.ticker)
        }
      }
    } catch (err) {
      logger.error('AudioPlayer: Error fetching mint data', err)
    }
  }, [currentTrack])

  useEffect(() => {
    checkOwnership()
    fetchMintData()
  }, [currentTrack?.id, (currentTrack as any)?.token_id, effectiveAddress, checkOwnership, fetchMintData])

  const handleMint = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated || !currentTrack) {
      login()
      return
    }

    if (hasOwned) {
      return
    }

    const targetUploader = uploaderAddress || currentTrack.uploader_address
    if (!targetUploader) {
      toast.error("Creator address not found. Please try again.")
      return
    }

    setIsMinting(true)
    const mainToast = toast.loading(`Preparing to collect "${currentTrack.title}"...`)

    try {
      logger.info('AudioPlayer: Starting purchase for track', { id: currentTrack.id, price: currentTrack.price })
      if (!lucid) throw new Error("Cardano wallet not connected or initialized")

      toast.loading(`Creating, signing and submitting transaction...`, { id: mainToast })
      const txHash = await buyFractionOnChain(lucid, {
        token_id: currentTrack.id,
        uploader_address: targetUploader,
        album_id: albumId,
        ticker: ticker || undefined
      })

      toast.loading(
        <div className="flex flex-col gap-1">
          <span>Transaction submitted!</span>
          <a
            href={`${EXPLORER_URL}/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            View on Explorer
          </a>
        </div>,
        { id: mainToast }
      )

      // Record mint in backend database
      const token = await getValidToken()
      if (token) {
        const recordRes = await fetch(`/api-backend/mints`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            track_id: currentTrack.id,
            tx_hash: txHash
          })
        })

        if (!recordRes.ok) {
          logger.error('AudioPlayer: Failed to record transaction in database')
        }
      }

      setHasOwned(true)
      toast.success(`"${currentTrack.title}" collected!`, { id: mainToast })
    } catch (error: any) {
      logger.error('AudioPlayer: Collection Error', error)
      toast.error(formatTxError(error), { id: mainToast })
    } finally {
      setIsMinting(false)
    }
  }
  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted, audioRef])


  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setCurrentTime(e.currentTarget.currentTime)
  }

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (e.currentTarget.duration && e.currentTarget.duration !== Infinity) {
      setDuration(e.currentTarget.duration)
    }
  }

  const handleDurationChange = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (e.currentTarget.duration && e.currentTarget.duration !== Infinity) {
      setDuration(e.currentTarget.duration)
    }
  }

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      next()
    }
  }

  const pendingPlayPromise = useRef<Promise<void> | null>(null)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    const syncSourceAndPlay = async () => {
      // Sync source if changed
      const trackUrl = currentTrack.url || ''
      if (trackUrl && audio.src !== trackUrl) {
        // If we have a pending play promise, we should wait or handle it
        // However, changing .src automatically aborts previous requests.
        audio.src = trackUrl
        audio.load()
        setCurrentTime(0)
        setDuration(0)
      }

      if (isPlaying) {
        try {
          // If already playing or loading, don't start a new request if unnecessary
          // but browser handles .play() calls gracefully if already pending.
          pendingPlayPromise.current = audio.play()
          await pendingPlayPromise.current
        } catch (e: any) {
          if (e.name !== 'AbortError') {
            logger.warn('[AudioPlayer] Play failed:', e)
          }
        } finally {
          pendingPlayPromise.current = null
        }
      } else {
        // If we are pausing, wait for any pending play to settle if possible
        // or just pause. pausing an aborted/settled play is safe.
        audio.pause()
      }
    }

    syncSourceAndPlay()
  }, [isPlaying, currentTrack, audioRef, setCurrentTime, setDuration])

  // Global Spacebar shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input, textarea, etc.
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

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || time === Infinity) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercent = (duration > 0 && duration !== Infinity) ? (currentTime / duration) * 100 : 0

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))

      const targetTime = percent * (duration || 0)
      if (duration && duration !== Infinity) {
        seek(targetTime)
      } else if (audioRef.current && audioRef.current.duration) {
        seek(percent * audioRef.current.duration)
      }
    },
    [seek, duration, audioRef]
  )

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const val = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setVolume(val)
    if (val > 0) setIsMuted(false)
  }

  const cycleRepeat = () => {
    setRepeatMode((m) => (m === 'off' ? 'all' : m === 'all' ? 'one' : 'off'))
  }

  if (!currentTrack) return null

  const accentActive = 'text-[#FF1F8A]'

  return (
    <div className="relative w-full h-auto md:h-[90px] bg-transparent pb-[env(safe-area-inset-bottom)] flex-shrink-0 z-50">
      {/* Mobile Continuous Divider */}
      <div className="lg:hidden absolute top-0 left-4 right-4 h-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />

      {/* Desktop Left Segment */}
      <div className={cn(
        "hidden lg:block absolute top-0 left-6 h-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]",
        isSidebarOpen ? "right-[calc(20rem+12px)]" : "right-6"
      )} />

      {/* Desktop Right Segment */}
      {isSidebarOpen && (
        <div className="hidden lg:block absolute top-0 left-[calc(100%-20rem+12px)] right-6 h-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
      )}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
        onPlay={handleDurationChange}
      />

      {/* ─── DESKTOP LAYOUT (md+) ─── */}
      <div className="hidden md:flex items-center gap-4 px-6 h-[90px] max-w-screen-2xl mx-auto">
        <div
          className="flex items-center gap-6 w-[30%] min-w-[240px] flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            handleOpenSidebar({
              ...currentTrack,
              token_id: currentTrack.id, // Ensure token_id is available for mint counter
              name: currentTrack.title,
              artist: currentTrack.creator,
              image_url: currentTrack.cover
            })
          }}
        >
          <div className="w-12 h-12 rounded-md flex-shrink-0 overflow-hidden bg-midnight/5 dark:bg-white/5 text-xs">
            <img
              src={(currentTrack.cover || '').replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/')}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 pl-2">
            <div className="marquee-container">
              <div className="marquee-content">
                <span className="text-sm font-semibold text-midnight dark:text-white pr-12">{currentTrack.title}</span>
              </div>
            </div>
            <p className="text-xs text-midnight/50 dark:text-white/50 truncate mt-0.5">
              {currentTrack.creator}
            </p>
          </div>

          {isPlaying && (
            <div className="flex items-end gap-[2px] h-3 flex-shrink-0 ml-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-[3px] bg-[#FF1F8A] equalizer-bar h-full"
                  style={{ '--delay': `${i * 0.2}s` } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 min-w-0 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShuffle((s) => !s)}
              className={`relative p-1.5 transition-all hover:scale-110 ${isShuffle ? accentActive : 'text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white'}`}
              aria-label="Shuffle"
            >
              <IconArrowsShuffle size={16} />
              {isShuffle && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF1F8A]" />}
            </button>

            <button
              onClick={previous}
              className="p-1.5 text-midnight dark:text-white hover:text-midnight dark:hover:text-white transition-all hover:scale-110"
              aria-label="Previous"
            >
              <SkipBack size={20} className="fill-midnight dark:fill-white" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all bg-midnight dark:bg-white hover:bg-midnight/90 dark:hover:bg-white/90 text-white dark:text-black active:scale-95 active:brightness-75 rounded-none"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <Pause size={18} className="fill-white dark:fill-black" />
                : <Play size={18} className="fill-white dark:fill-black ml-0.5" />
              }
            </button>

            <button
              onClick={next}
              className="p-1.5 text-midnight dark:text-white hover:text-midnight dark:hover:text-white transition-all hover:scale-110"
              aria-label="Next"
            >
              <SkipForward size={20} className="fill-midnight dark:fill-white" />
            </button>

            <button
              onClick={cycleRepeat}
              className={`relative p-1.5 transition-all hover:scale-110 ${repeatMode !== 'off' ? accentActive : 'text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white'}`}
              aria-label="Repeat"
            >
              {repeatMode === 'one' ? <IconRepeatOnce size={16} /> : <IconRepeat size={16} />}
              {repeatMode !== 'off' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF1F8A]" />}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full max-w-[500px]">
            <span className="text-[10px] text-midnight/70 dark:text-white/40 tabular-nums w-8 text-right flex-shrink-0">
              {formatTime(currentTime)}
            </span>

            <div
              ref={progressBarRef}
              className="group relative flex-1 h-3 flex items-center cursor-pointer"
              onClick={handleProgressClick}
              role="slider"
              aria-label="Track Progress"
            >
              <div className="absolute inset-y-0 my-auto h-[3px] w-full bg-midnight/10 dark:bg-white/10" />
              <div
                className="absolute inset-y-0 my-auto h-[3px] bg-cyber-pink"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="absolute w-3 h-3 bg-white shadow-md transition-opacity -translate-x-1/2 opacity-0 group-hover:opacity-100 clip-diamond"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            <span className="text-[10px] text-midnight/70 dark:text-white/40 tabular-nums w-8 flex-shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-[30%] min-w-[240px] flex-shrink-0 justify-end">
          <button
            onClick={(!hasOwned && !(mintData.max > 0 && mintData.minted >= mintData.max)) ? handleMint : undefined}
            disabled={isMinting || (mintData.max > 0 && mintData.minted >= mintData.max)}
            className={cn(
              "p-2 transition-all hover:scale-110 active:scale-95 flex items-center justify-center flex-shrink-0 group/heart",
              hasOwned ? "text-cyber-pink" : (mintData.max > 0 && mintData.minted >= mintData.max) ? "text-lavender" : "text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white"
            )}
            title={hasOwned ? "Collected" : (mintData.max > 0 && mintData.minted >= mintData.max) ? "Sold Out" : "Collect"}
          >
            {isMinting ? (
              <IconLoader2 size={22} className="animate-spin text-cyber-pink" />
            ) : hasOwned ? (
              <IconHeart
                size={22}
                className="fill-cyber-pink text-cyber-pink"
              />
            ) : (mintData.max > 0 && mintData.minted >= mintData.max) ? (
              <DobaVisualizer size={22} className="text-[#FF1F8A]" />
            ) : (
              <IconHeart
                size={22}
                className="text-midnight/70 dark:text-white/40 group-hover/heart:text-midnight dark:text-white"
              />
            )}
          </button>

          <div className="flex items-center gap-2 min-w-[100px]">
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="p-1.5 text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white transition-colors flex-shrink-0"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0
                ? <IconVolumeOff size={18} />
                : <IconVolume2 size={18} />
              }
            </button>
            <div
              className="group relative flex-1 h-3 flex items-center cursor-pointer"
              onClick={handleVolumeClick}
              role="slider"
              aria-label="Volume"
            >
              <div className="absolute inset-y-0 my-auto h-[3px] w-full bg-white/20" />
              <div
                className="absolute inset-y-0 my-auto h-[3px] bg-[#FF1F8A]"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
              <div
                className="absolute w-3 h-3 bg-white shadow-md transition-opacity -translate-x-1/2 opacity-0 group-hover:opacity-100 clip-diamond"
                style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={toggleSidebar}
            className={cn(
              "p-1.5 transition-all hover:scale-110",
              isSidebarOpen ? "text-[#FF1F8A]" : "text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white"
            )}
            title="Now Playing View"
          >
            <IconLayoutSidebarRight size={18} />
          </button>
        </div>
      </div>

      {/* ─── MOBILE LAYOUT (< md) ─── */}
      <div className="flex md:hidden flex-col items-center">
        {/* Mobile Progress Bar (Stick to top of player) */}
        <div
          className="h-2 w-full bg-midnight/10 dark:bg-white/10 relative cursor-pointer group"
          onClick={handleProgressClick}
          role="slider"
          aria-label="Track Progress"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-cyber-pink"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div
          className="flex items-center w-full gap-5 px-3 py-3"
        >
          {/* Row 1: Artwork */}
          <div
            className="w-10 h-10 flex-shrink-0 overflow-hidden bg-midnight/5 dark:bg-white/5 cursor-pointer rounded-none"
            onClick={() => {
              handleOpenSidebar({
                ...currentTrack,
                token_id: currentTrack.id,
                name: currentTrack.title,
                artist: currentTrack.creator,
                image_url: currentTrack.cover
              })
            }}
          >
            <img
              src={(currentTrack.cover || '').replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/')}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Song Info & Status Icon - All Horizontal */}
          <div
            className="flex-1 min-w-0 flex items-center gap-2 pl-2"
            onClick={() => {
              handleOpenSidebar({
                ...currentTrack,
                token_id: currentTrack.id,
                name: currentTrack.title,
                artist: currentTrack.creator,
                image_url: currentTrack.cover
              })
            }}
          >
            <div className="min-w-0 flex-shrink truncate">
              <h4 className="text-sm font-bold text-midnight dark:text-white truncate">{currentTrack.title}</h4>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={!hasOwned && !(mintData.max > 0 && mintData.minted >= mintData.max) ? handleMint : undefined}
                disabled={isMinting}
                className={cn(
                  "flex items-center active:scale-95 transition-transform",
                  hasOwned ? "text-cyber-pink" : (mintData.max > 0 && mintData.minted >= mintData.max) ? "text-[#FF1F8A]" : "text-midnight/70 dark:text-white/40"
                )}
              >
                {isMinting ? (
                  <IconLoader2 size={16} className="animate-spin text-cyber-pink" />
                ) : hasOwned ? (
                  <IconHeart
                    size={16}
                    className="fill-cyber-pink text-cyber-pink"
                  />
                ) : (mintData.max > 0 && mintData.minted >= mintData.max) ? (
                  <DobaVisualizer size={16} className="text-[#FF1F8A]" />
                ) : (
                  <IconHeart
                    size={16}
                    className="text-midnight/70 dark:text-white/40 fill-none"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Controls - Horizontal */}
          <div className="flex items-center gap-3">
            <button
              onClick={previous}
              className="p-1 text-midnight/70 dark:text-white/70 active:text-midnight dark:text-white"
              aria-label="Previous"
            >
              <SkipBack size={20} className="fill-midnight dark:fill-white" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-9 h-9 flex items-center justify-center bg-midnight dark:bg-white text-white dark:text-black active:scale-90 rounded-none shadow-md shadow-black/20"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <Pause size={18} className="fill-white dark:fill-black" />
                : <Play size={18} className="fill-white dark:fill-black ml-0.5" />
              }
            </button>

            <button
              onClick={next}
              className="p-1 text-midnight/70 dark:text-white/70 active:text-midnight dark:text-white"
              aria-label="Next"
            >
              <SkipForward size={20} className="fill-midnight dark:fill-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
