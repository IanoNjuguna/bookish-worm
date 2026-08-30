'use client'

import { useCardano } from '@/components/Providers'
import { useAudio } from '@/components/audio'
import { useLongPress } from '@/hooks/use-long-press'
import { useSongOwnership } from '@/hooks/use-song-ownership'
import { useMint } from '@/hooks/use-mint'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'
import { DOUBLE_TAP_DELAY_MS } from './SongCard.constants'
import type { MintData, SongCardProps } from './SongCard.types'

type LongPressBind = ReturnType<typeof useLongPress>['bind']

export interface UseSongCardReturn {
  cardRef: React.RefObject<HTMLDivElement | null>
  titleContainerRef: React.RefObject<HTMLDivElement | null>
  titleTextRef: React.RefObject<HTMLSpanElement | null>
  artistContainerRef: React.RefObject<HTMLDivElement | null>
  artistTextRef: React.RefObject<HTMLSpanElement | null>
  isHovered: boolean
  isExpanded: boolean
  titleScrollAmount: number
  artistScrollAmount: number
  isLongPressed: boolean
  longPressBind: LongPressBind
  hasOwned: boolean
  mintData: MintData
  isMinting: boolean
  handleMint: (e: React.MouseEvent) => Promise<void>
  handleClick: (e: React.MouseEvent) => void
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  currentPlayingId: number | undefined
  isPlayerPlaying: boolean | undefined
}

export function useSongCard({
  tokenId,
  name,
  artist,
  onPlay,
  navigateOnClick = false,
  is_owned = false,
  isAlbum = false,
  albumTracks = [],
}: SongCardProps): UseSongCardReturn {
  const router = useRouter()
  const locale = useLocale()
  const { address, isConnected, lucid } = useCardano()
  const { isAuthenticated, login, accessToken, playerState } = useAudio()

  const [isHovered, setIsHovered] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [titleScrollAmount, setTitleScrollAmount] = React.useState(0)
  const [artistScrollAmount, setArtistScrollAmount] = React.useState(0)

  const titleContainerRef = React.useRef<HTMLDivElement>(null)
  const titleTextRef = React.useRef<HTMLSpanElement>(null)
  const artistContainerRef = React.useRef<HTMLDivElement>(null)
  const artistTextRef = React.useRef<HTMLSpanElement>(null)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const lastClickTimeRef = React.useRef<number>(0)

  const { isLongPressed, hasLongPressedRef, bind: longPressBind } = useLongPress()

  const {
    hasOwned,
    setHasOwned,
    mintData,
    uploaderAddress,
    albumId,
    ticker,
  } = useSongOwnership({ tokenId, initialOwned: is_owned, address })

  const { isMinting, handleMint } = useMint({
    tokenId,
    name,
    isAlbum,
    albumTracks,
    hasOwned,
    setHasOwned,
    uploaderAddress,
    albumId,
    ticker,
    mintData,
    isAuthenticated,
    login,
    accessToken,
    lucid,
  })

  const measureScrolls = React.useCallback(() => {
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
  }, [])

  React.useEffect(() => {
    measureScrolls()
  }, [name, artist, measureScrolls])

  const handleMouseEnter = () => {
    setIsHovered(true)
    measureScrolls()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (hasLongPressedRef.current) {
      return
    }

    const now = Date.now()
    if (now - lastClickTimeRef.current < DOUBLE_TAP_DELAY_MS) {
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
      setIsExpanded((prev) => !prev)
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

  const currentPlayingId =
    (playerState?.currentTrack as { token_id?: number; id?: number })?.token_id ||
    playerState?.currentTrack?.id

  return {
    cardRef,
    titleContainerRef,
    titleTextRef,
    artistContainerRef,
    artistTextRef,
    isHovered,
    isExpanded,
    titleScrollAmount,
    artistScrollAmount,
    isLongPressed,
    longPressBind,
    hasOwned,
    mintData,
    isMinting,
    handleMint,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    currentPlayingId,
    isPlayerPlaying: playerState?.isPlaying,
  }
}
