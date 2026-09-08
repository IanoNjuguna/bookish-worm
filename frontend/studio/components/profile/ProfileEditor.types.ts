export interface UserProfile {
  address: string
  username: string | null
  bio: string | null
  avatar_url: string | null
  artist_mode?: boolean
}

export interface ProfileEditorProps {
  address: string
  tProfile?: any
  logout: () => void
}
