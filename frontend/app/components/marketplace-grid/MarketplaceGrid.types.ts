import type { Track } from '@/lib/types'

export interface MarketplaceGridProps {
  onPlay?: (track: Track, tracks: Track[]) => void
  currentTrackId?: number | null
  isPlaying?: boolean
  searchQuery?: string
  genre?: string
  limit?: number
  isSidebarOpen?: boolean
  splitPlaylist?: boolean
}

export interface SongCardDerivedProps {
  isAlbum: boolean
  trackCount: number
  albumTracks: Track[]
  playCount: number | undefined
}

export type GridSectionVariant = 'collected' | 'single' | 'album'

export interface GridSectionProps {
  variant: GridSectionVariant
  tracks: Track[]
  allTracks: Track[]
  title?: string
  titleClassName?: string
  withTopBorder?: boolean
  onPlay?: (track: Track, tracks: Track[]) => void
  currentTrackId?: number | null
  isPlaying?: boolean
  isSidebarOpen: boolean
  getSongCardProps: (track: Track) => SongCardDerivedProps
}

export interface UseMarketplaceGridOptions {
  searchQuery: string
  genre: string
  limit: number
  splitPlaylist: boolean
}

export interface UseMarketplaceGridReturn {
  tracks: Track[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  collectedTracks: Track[]
  discoverSingles: Track[]
  discoverAlbums: Track[]
  fetchTracks: (isLoadMore?: boolean) => Promise<void>
  getSongCardProps: (track: Track) => SongCardDerivedProps
}
