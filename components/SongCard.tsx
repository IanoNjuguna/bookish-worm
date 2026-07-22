'use client'

import { logger } from '@/lib/logger'
import { buyFractionOnChain, buyAlbumFractionsOnChain, formatTxError, isUserDeclinedTxError } from '@/lib/contractHelper'
import React from 'react'
import { IconPlayerPlay, IconPlayerPause, IconLoader2, IconDiamond, IconDiamondFilled, IconDisc } from '@tabler/icons-react'
import { DobaVisualizer } from '@/components/icons/DobaVisualizer'
import { cn } from '@/lib/utils'
import { useCardano } from '@/components/Providers'
import { EXPLORER_URL } from '@/lib/config'
import { toast } from 'sonner'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useAudio } from './AudioProvider'

interface SongCardProps {
  tokenId: number
  name: string
  artist: string
  imageUrl: string
  audioUrl: string
  genre?: string
  price?: string
  onPlay?: () => void
  isPlaying?: boolean
  navigateOnClick?: boolean
  is_owned?: boolean
  playCount?: number
  isAlbum?: boolean
  trackCount?: number
  // deno-lint-ignore no-explicit-any
  albumTracks?: any[]
  // deno-lint-ignore no-explicit-any
  onPlayTrack?: (track: any) => void
}

export default function SongCard({
  tokenId,
  name,
  artist,
  imageUrl,
  audioUrl,
  genre: _genre,
  price,
  onPlay,
  isPlaying = false,
  navigateOnClick = false,
  is_owned = false,
  playCount,
  isAlbum = false,
  trackCount = 0,
  albumTracks = [],
  onPlayTrack,
}: SongCardProps) {
  const router = useRouter()
  const locale = useLocale()
  const { address, isConnected, lucid } = useCardano()
  const { isAuthenticated, login, accessToken, playerState } = useAudio()

  const [isMinting, setIsMinting] = React.useState(false)
  const [hasOwned, setHasOwned] = React.useState(is_owned)
  const [mintData, setMintData] = React.useState<{ minted: number, max: number }>({ minted: 0, max: 0 })
  const [uploaderAddress, setUploaderAddress] = React.useState<string | null>(null)
  const [albumId, setAlbumId] = React.useState<number | null>(null)
  const [ticker, setTicker] = React.useState<string | null>(null)

  const [isHovered, setIsHovered] = React.useState(false)
  const [isLongPressed, setIsLongPressed] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [titleScrollAmount, setTitleScrollAmount] = React.useState(0)
  const [artistScrollAmount, setArtistScrollAmount] = React.useState(0)

  const titleContainerRef = React.useRef<HTMLDivElement>(null)
  const titleTextRef = React.useRef<HTMLSpanElement>(null)
  const artistContainerRef = React.useRef<HTMLDivElement>(null)
  const artistTextRef = React.useRef<HTMLSpanElement>(null)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const hasLongPressedRef = React.useRef(false)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const lastClickTimeRef = React.useRef<number>(0)

  const measureScrolls = () => {
    if (titleContainerRef.current && titleTextRef.current) {
      const cWidth = titleContainerRef.current.clientWidth
      const tWidth = titleTextRef.current.scrollWidth
      setTitleScrollAmount(tWidth > cWidth ? tWidth - cWidth : 0)
    }
    if (artistContainerRef.current && artistTextRef.current) {
      const cWidth = artistContainerRef.current.clientWidth
      const tWidth = artistTextRef.current.scrollWidth
      setArtistScrollAmount(tWidth > cWidth ? tWidth - cWidth : 0)
    }
  }

  React.useEffect(() => {
    measureScrolls()
  }, [name, artist])

  const handleTouchStart = () => {
    hasLongPressedRef.current = false
    timerRef.current = setTimeout(() => {
      setIsLongPressed(true)
      hasLongPressedRef.current = true
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50)
      }
    }, 500)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (hasLongPressedRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsLongPressed(false)
  }

  const handleTouchCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsLongPressed(false)
  }

  const handleTouchMove = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    measureScrolls()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  React.useEffect(() => {
    if (is_owned) {
      setHasOwned(true)
    } else {
      const checkBack = async () => {
        if (!address) return
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
          logger.error('SongCard: Error checking ownership', e)
        }
      }
      checkBack()
    }
  }, [is_owned, address, tokenId])

  React.useEffect(() => {
    const fetchMints = async () => {
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
        logger.error('Error fetching mint data', err)
      }
    }
    fetchMints()
  }, [tokenId])

  const handleMint = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      login()
      return
    }

    if (hasOwned) {
      toast.info("You already own this track! Check your library.")
      return
    }

    // Check if sold out
    if (mintData.max > 0 && mintData.minted >= mintData.max) {
      toast.error("This edition is sold out!")
      return
    }

    const targetUploader = uploaderAddress
    if (!targetUploader) {
      toast.error("Creator address not found. Please try again.")
      return
    }

    setIsMinting(true)
    const mainToast = toast.loading(`Collecting "${name}"...`)

    const unownedTracks = isAlbum ? (albumTracks || []).filter((t: { is_owned?: boolean }) => !t.is_owned) : []
    if (isAlbum && unownedTracks.length === 0) {
      toast.info("You already own all tracks in this album!", { id: mainToast })
      setIsMinting(false)
      return
    }

    try {
      if (!lucid) throw new Error("Cardano wallet not connected or initialized")

      toast.loading(`Creating, signing and submitting transaction...`, { id: mainToast })
      
      let txHash: string
      if (isAlbum) {
        txHash = await buyAlbumFractionsOnChain(
          lucid,
          unownedTracks.map((t: { token_id: number; uploader_address?: string; ticker?: string; price?: string }) => ({
            token_id: t.token_id,
            uploader_address: t.uploader_address || targetUploader,
            ticker: t.ticker,
            price: t.price
          }))
        )
      } else {
        txHash = await buyFractionOnChain(lucid, {
          token_id: tokenId,
          uploader_address: targetUploader,
          album_id: albumId,
          ticker: ticker || undefined
        })
      }

      // Update local state immediately
      setHasOwned(true)
      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-bold">"{name}" collected!</p>
          <a
            href={`${EXPLORER_URL}/tx/${txHash}`}
            target="_blank"
            className="text-[10px] text-cyber-pink hover:underline flex items-center gap-1"
          >
            View on Explorer
          </a>
        </div>,
        { id: mainToast }
      )

      // Record mint in backend
      if (isAlbum) {
        for (const track of unownedTracks) {
          try {
            if (isAuthenticated && accessToken) {
              await fetch(`/api-backend/mints`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                  track_id: track.token_id,
                  tx_hash: txHash
                })
              })
            }
          } catch (err: unknown) {
            logger.error('Failed to record album track mint in backend', track.token_id, err)
          }
        }
      } else {
        try {
          if (isAuthenticated && accessToken) {
            await fetch(`/api-backend/mints`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              },
              body: JSON.stringify({
                track_id: tokenId,
                tx_hash: txHash
              })
            })
          }
        } catch (err: unknown) {
          logger.error('Failed to record mint in backend', err)
        }
      }

    } catch (error: unknown) {
      logger.error('Mint Error', error)
      if (isUserDeclinedTxError(error)) {
        toast.info('You declined the transaction.', { id: mainToast })
      } else {
        toast.error(formatTxError(error), { id: mainToast })
      }
    } finally {
      setIsMinting(false)
    }
  }



  const handleClick = (e: React.MouseEvent) => {
    if (hasLongPressedRef.current) {
      return
    }

    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300
    if (now - lastClickTimeRef.current < DOUBLE_TAP_DELAY) {
      e.preventDefault()
      e.stopPropagation()
      handleMint(e)
      lastClickTimeRef.current = 0
      return
    }
    lastClickTimeRef.current = now

    if (isAlbum) {
      e.preventDefault()
      e.stopPropagation()
      setIsExpanded(prev => !prev)
      return
    }
    if (navigateOnClick) {
      router.push(`/${locale}/track/${tokenId}`)
      return
    }
    if (!isConnected) {
      login()
      return
    }
    onPlay?.()
  }

  const currentPlayingId = (playerState?.currentTrack as { token_id?: number; id?: number })?.token_id || playerState?.currentTrack?.id

  return (
    <div className="flex flex-col">
      <div
        ref={cardRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onTouchMove={handleTouchMove}
        className={cn(
          "group relative flex flex-col p-3 rounded-lg transition-all duration-300 cursor-pointer select-none",
          "bg-black/[0.03] dark:bg-white/[0.03] border border-[#f0f0f0] dark:border-white/5",
          "hover:bg-black/[0.06] dark:hover:bg-white/[0.06] hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg dark:hover:shadow-black/40",
          isLongPressed && "scale-[0.97] duration-150",
          isAlbum && isExpanded && "border-b-0 rounded-b-none"
        )}
      >
        {/* Top Section - Artwork Container */}
        <div className="relative w-full aspect-square flex-shrink-0">
          {isAlbum && (
            <>
              {/* Third layer card (furthest back) */}
              <div className="absolute inset-0 transform translate-x-2 -translate-y-2 scale-[0.96] bg-black/[0.04] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-md transition-transform duration-300 group-hover:translate-x-2.5 group-hover:-translate-y-2.5 -z-10" />
              {/* Second layer card (middle) */}
              <div className="absolute inset-0 transform translate-x-1 -translate-y-1 scale-[0.98] bg-black/[0.08] dark:bg-white/[0.08] border border-black/10 dark:border-white/10 rounded-md transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-2.5 -z-10" />
            </>
          )}

          {/* Main Artwork Cover */}
          <div className="relative w-full h-full rounded-md overflow-hidden z-0">
            <img
              src={(imageUrl || '').replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/')}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Play Button - bottom right of artwork, appears on hover */}
            {onPlay && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onPlay()
                }}
                className={cn(
                  "absolute right-3 bottom-3 z-30 w-10 h-10 bg-lavender hover:bg-lavender/90 hover:scale-105 active:scale-95 text-black rounded-full flex items-center justify-center transition-all duration-300 transform translate-y-2 opacity-0",
                  "group-hover:translate-y-0 group-hover:opacity-100",
                  isPlaying && "translate-y-0 opacity-100"
                )}
              >
                {isPlaying ? (
                  <IconPlayerPause size={18} className="fill-black text-black" />
                ) : (
                  <IconPlayerPlay size={18} className="fill-black text-black ml-0.5" />
                )}
              </button>
            )}

            {/* Plays data in top right corner */}
            {playCount !== undefined && playCount > 0 && (
              <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 rounded flex-shrink-0">
                {isAlbum ? (
                  <IconDisc size={10} className="text-white/80 animate-[spin_4s_linear_infinite]" />
                ) : (
                  <IconPlayerPlay size={8} className="fill-white/80 text-white/80" />
                )}
                <span className="text-[8px] font-mono font-bold text-white/80">
                  {playCount >= 1000 ? `${(playCount / 1000).toFixed(1)}k` : playCount}
                </span>
              </div>
            )}

            {/* Diamonds data in top left corner */}
            <div className="absolute top-2 left-2 z-20">
              {(mintData.max > 0 && mintData.minted >= mintData.max) ? (
                <IconDiamondFilled size={22} className="text-[#FF1F8A]" />
              ) : hasOwned ? (
                <IconDiamondFilled size={22} className="text-[#1DB954]" />
              ) : (
                <button 
                  type="button"
                  disabled={isMinting}
                  onClick={handleMint}
                  className="text-white/70 hover:text-[#FF1F8A] transition-colors duration-200"
                >
                  {isMinting ? <IconLoader2 size={22} className="animate-spin text-[#FF1F8A]" /> : <IconDiamond size={22} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - Metadata */}
        <div className="mt-3 flex flex-col gap-1 px-1 min-w-0">
          <div ref={titleContainerRef} className="overflow-hidden whitespace-nowrap w-full relative">
            <span
              ref={titleTextRef}
              style={{ '--scroll-x': `-${titleScrollAmount}px` } as React.CSSProperties}
              className={cn(
                "inline-block font-display font-bold text-sm text-black dark:text-white leading-tight group-hover:text-black dark:group-hover:text-lavender transition-colors duration-200",
                titleScrollAmount > 0 && (isHovered || isPlaying || isLongPressed) 
                  ? "animate-marquee-dynamic overflow-visible" 
                  : "truncate w-full"
              )}
            >
              {name}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div ref={artistContainerRef} className="overflow-hidden whitespace-nowrap flex-grow relative min-w-0">
              <span
                ref={artistTextRef}
                style={{ '--scroll-x': `-${artistScrollAmount}px` } as React.CSSProperties}
                className={cn(
                  "inline-block text-[10px] text-black/50 dark:text-white/50 font-sans font-medium uppercase tracking-[1px]",
                  artistScrollAmount > 0 && (isHovered || isPlaying || isLongPressed)
                    ? "animate-marquee-dynamic overflow-visible"
                    : "truncate w-full"
                )}
              >
                {artist}
              </span>
            </div>
            <span className="text-[10px] font-sans font-bold text-purple-600 dark:text-[#B794F4] flex-shrink-0">
              {isAlbum ? (
                albumTracks && albumTracks.length > 0
                  ? `${albumTracks.filter((t: { is_owned?: boolean }) => !t.is_owned).reduce((sum, t: { price?: string }) => sum + Number(t.price || 5), 0)} ADA`
                  : `${Number(price || 5) * trackCount} ADA`
              ) : (
                `${price || '5'} ADA`
              )}
            </span>
          </div>
          {isAlbum && (
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[9px] font-sans font-semibold tracking-wider text-black/40 dark:text-white/40 uppercase">
                {trackCount} TRACKS
              </span>
              <span className={cn(
                "text-[9px] font-sans font-semibold tracking-wider text-black/30 dark:text-white/30 uppercase transition-transform duration-300",
                isExpanded && "rotate-180"
              )}>
                ▾
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Tracklist Panel — slides down below the card */}
      {isAlbum && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border border-t-0 border-[#f0f0f0] dark:border-white/5 rounded-b-lg bg-black/[0.02] dark:bg-white/[0.02] px-3 pb-3 pt-1">
            <div className="overflow-y-auto max-h-[260px] space-y-0.5 custom-scrollbar">
              {albumTracks.map((t, index) => {
                const isTrackPlaying = playerState?.isPlaying && (currentPlayingId === t.token_id || currentPlayingId === t.id)
                return (
                  <div 
                    key={t.token_id || t.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onPlayTrack) {
                        onPlayTrack(t)
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between py-2 px-2 rounded text-[11px] cursor-pointer transition-colors w-full min-w-0",
                      isTrackPlaying 
                        ? "bg-purple-600/10 dark:bg-[#B794F4]/15 text-purple-600 dark:text-[#B794F4] font-semibold" 
                        : "hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 mr-2">
                      <span className="font-mono text-black/35 dark:text-white/35 text-[9px] flex-shrink-0 w-4 text-right">{index + 1}</span>
                      <span className="truncate font-medium">{t.name}</span>
                    </div>
                    <div className="flex-shrink-0">
                      {isTrackPlaying ? (
                        <IconPlayerPause size={12} className="text-cyber-pink fill-cyber-pink" />
                      ) : (
                        <IconPlayerPlay size={12} className="text-black/25 dark:text-white/25" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
