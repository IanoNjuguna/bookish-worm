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
