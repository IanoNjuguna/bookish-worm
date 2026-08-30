import type { RefObject } from 'react'

export interface Track {
  id: number
  title: string
  creator: string
  price?: string
  cover: string
  collaborators: number
  url?: string
  genre?: string
  description?: string
  uploader_address?: string
  ticker?: string | null
  album_id?: number | null
  album_name?: string | null
}

export type RepeatMode = 'off' | 'all' | 'one'

export interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  queue: Track[]
  currentIndex: number
  duration: number
  currentTime: number
}

export interface PlayerActions {
  play: (track: Track, tracks?: Track[]) => void
  pause: () => void
  resume: () => void
  togglePlayPause: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setDuration: (duration: number) => void
  setCurrentTime: (time: number) => void
}

export interface AudioPlayerState extends PlayerState, PlayerActions {
  audioRef: RefObject<HTMLAudioElement | null>
  volume: number
  isMuted: boolean
  setVolume: (volume: number) => void
  toggleMute: () => void
}

export interface AudioContextType {
  playerState: AudioPlayerState
  handlePlayTrack: (track: Track, tracks?: Track[]) => void
  effectiveAddress: string | undefined
  isConnected: boolean
  isAuthenticated: boolean
  isCheckingAuth: boolean
  accessToken: string | null
  getValidToken: () => Promise<string | null>
  sidebarTrack: any | null
  isSidebarOpen: boolean
  handleOpenSidebar: (track: any) => void
  toggleSidebar: () => void
  login: () => Promise<string | null>
  logout: () => void
  isLoading: boolean
}
