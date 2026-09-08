import type { Collaborator, AlbumTrack } from './UploadView.types'

export interface UploadDraftData {
  isAlbum: boolean
  title: string
  artistName: string
  ticker: string
  description: string
  genre: string
  price: string
  supply: string
  royaltyAddress: string
  collaborators: Collaborator[]
  albumTracks: Omit<AlbumTrack, 'file'>[]
  attested: boolean
}

export interface UploadDraft {
  id: number
  name?: string
  type: 'single' | 'album'
  data_json: string
  audio_hash?: string
  image_hash?: string
  audio_filename?: string
  image_filename?: string
  streaming_url?: string
  updated_at: string
}

export interface UploadDraftListItem {
  id: number
  name?: string
  type: 'single' | 'album'
  updated_at: string
}

export interface UploadDraftInput {
  name?: string
  type: 'single' | 'album'
  data_json: string
  audio_hash?: string
  image_hash?: string
  audio_filename?: string
  image_filename?: string
  streaming_url?: string
}
