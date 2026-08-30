import type { Track } from '@/lib/types'
import type { MouseEvent, RefObject } from 'react'

export interface SongCardProps {
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
  albumTracks?: Track[]
  onPlayTrack?: (track: Track) => void
}

export interface MintData {
  minted: number
  max: number
}

export interface ArtworkPlayButtonProps {
  onPlay: () => void
  isPlaying: boolean
}

export interface PlayCountBadgeProps {
  playCount: number
  isAlbum: boolean
}

export interface MintDiamondOverlayProps {
  mintData: MintData
  hasOwned: boolean
  isMinting: boolean
  onMint: (e: MouseEvent) => Promise<void>
}

export interface CardArtworkProps {
  name: string
  imageUrl: string
  isAlbum: boolean
  isPlaying: boolean
  playCount?: number
  onPlay?: () => void
  mintData: MintData
  hasOwned: boolean
  isMinting: boolean
  onMint: (e: MouseEvent) => Promise<void>
}

export interface MarqueeTextProps {
  text: string
  scrollAmount: number
  isActive: boolean
  containerRef: RefObject<HTMLDivElement | null>
  textRef: RefObject<HTMLSpanElement | null>
  containerClassName: string
  textClassName: string
}

export interface CardMetadataProps {
  name: string
  artist: string
  price?: string
  isAlbum: boolean
  trackCount: number
  albumTracks: Track[]
  isExpanded: boolean
  isHovered: boolean
  isPlaying: boolean
  isLongPressed: boolean
  titleScrollAmount: number
  artistScrollAmount: number
  titleContainerRef: RefObject<HTMLDivElement | null>
  titleTextRef: RefObject<HTMLSpanElement | null>
  artistContainerRef: RefObject<HTMLDivElement | null>
  artistTextRef: RefObject<HTMLSpanElement | null>
}
