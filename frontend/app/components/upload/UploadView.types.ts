import type React from 'react'

export interface Collaborator {
  address: string
  split: string | number
}

export interface AlbumTrack {
  id: number
  title: string
  file: File | null
  audioHash: string
  audioName: string
  duration: string
  streamingUrl: string
}

export type UploadStep = 0 | 1 | 2 | 3 | 4 | 5

export interface UseAlbumTracksReturn {
  albumTracks: AlbumTrack[]
  setAlbumTracks: React.Dispatch<React.SetStateAction<AlbumTrack[]>>
  addAlbumTrack: () => void
  removeAlbumTrack: (index: number) => void
  updateAlbumTrack: (index: number, field: keyof Omit<AlbumTrack, 'id'>, value: unknown) => void
  handleAlbumTrackFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface UseUploadReturn {
  // Release type
  isAlbum: boolean
  setIsAlbum: React.Dispatch<React.SetStateAction<boolean>>

  // Basic details
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  ticker: string
  setTicker: React.Dispatch<React.SetStateAction<string>>
  userEditedTicker: boolean
  setUserEditedTicker: React.Dispatch<React.SetStateAction<boolean>>
  artistName: string
  setArtistName: React.Dispatch<React.SetStateAction<string>>
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
  genre: string
  setGenre: React.Dispatch<React.SetStateAction<string>>
  genreOpen: boolean
  setGenreOpen: React.Dispatch<React.SetStateAction<boolean>>

  // Pricing & supply
  price: string
  setPrice: React.Dispatch<React.SetStateAction<string>>
  supply: string
  setSupply: React.Dispatch<React.SetStateAction<string>>

  // Royalties
  royaltyPercentage: string
  setRoyaltyPercentage: React.Dispatch<React.SetStateAction<string>>
  royaltyAddress: string
  setRoyaltyAddress: React.Dispatch<React.SetStateAction<string>>

  // Media
  audioFile: File | null
  setAudioFile: React.Dispatch<React.SetStateAction<File | null>>
  coverFile: File | null
  setCoverFile: React.Dispatch<React.SetStateAction<File | null>>
  audioDuration: string
  setAudioDuration: React.Dispatch<React.SetStateAction<string>>

  // Background upload state
  audioHash: string
  imageHash: string
  audioFilename: string
  imageFilename: string
  streamingUrl: string
  assetsCid: string | null
  isAssetsUploading: boolean

  // Collaborators
  collaborators: Collaborator[]
  setCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>
  addCollaborator: () => void
  updateCollaborator: (index: number, field: keyof Collaborator, value: string | number) => void
  removeCollaborator: (index: number) => void

  // Progress / publishing
  isUploading: boolean
  isMinting: boolean
  uploadStep: UploadStep
  uploadStatusText: string
  elapsedSeconds: number
  displaySeg1: number
  displaySeg2: number
  displaySeg3: number
  displaySeg4: number
  publishedSongId: number | null
  hasCollected: boolean

  // Wallet
  adaBalance: bigint | null
  cardanoAddress: string | null

  // Attestation
  attested: boolean
  setAttested: React.Dispatch<React.SetStateAction<boolean>>

  // Handlers
  handleAudioChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent, albumTracks: AlbumTrack[]) => Promise<void>
}
