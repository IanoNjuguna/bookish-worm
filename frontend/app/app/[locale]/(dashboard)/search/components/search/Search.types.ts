import type { Track as MarketplaceTrack } from '@/lib/types'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export interface GenreSelectProps {
  selectedGenre: string
  onGenreChange: (genre: string) => void
}

export interface UseSearchReturn {
  searchQuery: string
  setSearchQuery: (value: string) => void
  selectedGenre: string
  setSelectedGenre: (genre: string) => void
  debouncedSearch: string
  mounted: boolean
  currentTrackId: number | undefined
  isPlaying: boolean
  isSidebarOpen: boolean
  handleGridPlay: (track: MarketplaceTrack, tracks: MarketplaceTrack[]) => void
}
