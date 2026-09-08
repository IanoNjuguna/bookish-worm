export interface Track {
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

export interface MyStudioGridProps {
  address?: string
  onPlay?: (track: Track, tracks: Track[]) => void
  currentTrackId?: number | null
  isPlaying?: boolean
}

export interface LibraryTrackRowProps {
  track: Track
  index: number
  showPlayButton: boolean
  isCurrent: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onPlay: () => void
  onOpenSidebar: () => void
}

export interface LibraryTrackTitleCellProps {
  track: Track
  onPlay: () => void
}
