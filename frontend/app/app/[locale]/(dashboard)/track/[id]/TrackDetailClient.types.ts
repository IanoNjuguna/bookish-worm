import React from 'react'

export interface Track {
  token_id: number
  name: string
  artist: string
  image_url: string
  audio_url: string
  streaming_url?: string
  genre?: string
  price?: string
  description?: string
  chain_id?: string
  max_supply?: string
  uploader_address?: string
  is_owned?: boolean
  mint_count?: number
  splitter?: string
  ticker?: string
  album_id?: number | null
}

export interface TrackDetailClientProps {
  initialTrack: Track | null
}

export interface UseTrackFetchReturn {
  track: Track | null
  loading: boolean
  refetch: () => void
}

export interface UseTrackMintReturn {
  isMinting: boolean
  handleMint: () => Promise<void>
}

export interface UseTrackMintOptions {
  track: Track | null
  hasOwned: boolean
  setHasOwned: (value: boolean) => void
  refetch: () => void
}

export interface UseTrackDownloadReturn {
  handleDownload: () => Promise<void>
}

export interface UseTrackDownloadOptions {
  track: Track | null
  hasOwned: boolean
}

export interface UseTrackShareReturn {
  handleShare: () => void
}

export interface UseTrackCopyReturn {
  handleCopyLink: () => void
}

export interface UseTrackPlayReturn {
  isPlaying: boolean
  isPlayerActive: boolean
  togglePlay: () => void
}

export interface UseTrackDetailReturn {
  track: Track | null
  loading: boolean
  locale: string
  router: ReturnType<typeof import('next/navigation').useRouter>
  isPlayerActive: boolean
  isPlaying: boolean
  togglePlay: () => void
  isMinting: boolean
  handleMint: () => Promise<void>
  handleDownload: () => Promise<void>
  handleShare: () => void
  handleCopyLink: () => void
  hasOwned: boolean
}

export interface TrackArtworkProps {
  track: Track
  isPlaying: boolean
  onTogglePlay: () => void
  onBack: () => void
}

export interface TrackBackButtonProps {
  onBack: () => void
}

export interface TrackInfoHeaderProps {
  track: Track
}

export interface TrackPriceStatusProps {
  track: Track
  hasOwned: boolean
  mintCount: number
  maxSupply: number
}

export interface TrackMintProgressProps {
  mintCount: number
  maxSupply: number
}

export interface TrackActionButtonsProps {
  hasOwned: boolean
  isMinting: boolean
  isSoldOut: boolean
  onMint: () => Promise<void>
  onDownload: () => Promise<void>
  onShare: () => void
  onCopyLink: () => void
}

export interface TrackCollectCardProps {
  track: Track
  hasOwned: boolean
  isMinting: boolean
  onMint: () => Promise<void>
  onDownload: () => Promise<void>
  onShare: () => void
  onCopyLink: () => void
}

export interface TrackDescriptionProps {
  description?: string
}

export interface TrackBlockchainDetailsProps {
  track: Track
}

export interface TrackDetailLayoutProps {
  track: Track
  isPlayerActive: boolean
  children: React.ReactNode
}

export interface TrackNotFoundProps {
  locale: string
  onBack: () => void
}

export interface TrackMintSuccessToastProps {
  track: Track
  txHash: string
}
