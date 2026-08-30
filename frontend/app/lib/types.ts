export interface Track {
  id?: number
  token_id: number
  name: string
  artist: string
  image_url: string
  audio_url: string
  streaming_url?: string
  description?: string
  genre?: string
  tx_hash?: string
  price?: string
  uploader_address?: string
  album_id?: number | null
  is_owned?: boolean
  play_count?: number
  ticker?: string
  mint_count?: number
  max_supply?: number
  created_at?: string
  // Transformed/audio-player aliases used by some callers
  title?: string
  cover?: string
  creator?: string
  url?: string
  collaborators?: number
  chain_id?: string
}
