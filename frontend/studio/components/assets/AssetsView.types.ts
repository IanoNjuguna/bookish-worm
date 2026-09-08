export interface Track {
  id?: number
  token_id: number
  name: string
  artist: string
  image_url: string
  price?: string
  is_owned?: boolean
  quantity?: number
  supply?: string | number
  uploader_address?: string
  ticker?: string
  album_id?: number | null
  splitter?: string
}

export interface TokenAsset {
  unit: string
  policyId: string
  name: string
  symbol: string
  balance: number
  usdValue: number
  price: number
  logoUrl?: string
}

export type AssetsTab = 'tokens' | 'nfts'
