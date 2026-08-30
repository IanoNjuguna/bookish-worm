export interface NowPlayingSidebarProps {
  track: any | null
  isVisible: boolean
  onClose: () => void
}

export interface SidebarTrack {
  id?: number
  token_id?: number
  name?: string
  title?: string
  artist?: string
  creator?: string
  image_url?: string
  cover?: string
  price?: string
  description?: string
  lyrics?: string
  genre?: string
  splitter?: string
  uploader_address?: string
  uploader_payment_address?: string
  album_id?: number | null
  ticker?: string | null
  is_owned?: boolean
}

export interface MintData {
  minted: number
  max: number
}
