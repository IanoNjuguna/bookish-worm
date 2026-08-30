'use client'

import { useEffect, useState, useCallback } from 'react'
import { logger } from '@/lib/logger'
import { useAudio } from '@/components/audio'
import { API_URL } from './ProfileEditor.constants'
import type { UserProfile } from './ProfileEditor.types'

export interface UseProfileReturn {
  profile: UserProfile | null
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
  isLoading: boolean
  username: string
  setUsername: (value: string) => void
  bio: string
  setBio: (value: string) => void
  avatarUrl: string
  setAvatarUrl: (value: string) => void
  artistMode: boolean
  setArtistMode: (value: boolean) => void
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSave: (e: React.FormEvent) => Promise<void>
  isSaving: boolean
  handleArtistModeToggle: (enabled: boolean) => Promise<void>
}

export function useProfile(address: string): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [artistMode, setArtistMode] = useState(false)
  const { getValidToken } = useAudio()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL.replace(/\/$/, '')}/users/${address}`)
        if (res.ok) {
          const data: UserProfile = await res.json()
          const storedMode =
            typeof window !== 'undefined' && address
              ? window.localStorage.getItem(`doba_artist_mode_${address}`)
              : null
          setProfile(data)
          setUsername(data.username || '')
          setBio(data.bio || '')
          setAvatarUrl(data.avatar_url || '')
          setArtistMode(storedMode !== null ? storedMode === 'true' : data.artist_mode || false)
        }
      } catch (err) {
        logger.error('Failed to fetch profile', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (address) {
      fetchProfile()
    }
  }, [address])

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const saveProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      const token = await getValidToken()
      if (!token) return null

      const res = await fetch(`${API_URL.replace(/\/$/, '')}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address,
          username,
          bio,
          avatar_url: avatarUrl,
          ...updates,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        logger.error('Failed to save profile', { status: res.status, error: errorData })
        throw new Error(errorData.message || 'Failed to save profile')
      }
      return res
    },
    [address, username, bio, avatarUrl, getValidToken]
  )

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSaving(true)
      try {
        await saveProfile({ artist_mode: artistMode })
        setProfile({ address, username, bio, avatar_url: avatarUrl, artist_mode: artistMode })
      } catch (err) {
        logger.error('Failed to save profile', err)
        throw err
      } finally {
        setIsSaving(false)
      }
    },
    [address, username, bio, avatarUrl, artistMode, saveProfile]
  )

  const handleArtistModeToggle = useCallback(
    async (enabled: boolean) => {
      setArtistMode(enabled)
      if (typeof window !== 'undefined' && address) {
        window.localStorage.setItem(`doba_artist_mode_${address}`, String(enabled))
      }
      try {
        await saveProfile({ artist_mode: enabled })
        setProfile(prev => (prev ? { ...prev, artist_mode: enabled } : prev))
      } catch (err) {
        logger.error('Failed to save artist mode', err)
        setArtistMode(!enabled)
        throw err
      }
    },
    [address, saveProfile]
  )

  return {
    profile,
    setProfile,
    isLoading,
    username,
    setUsername,
    bio,
    setBio,
    avatarUrl,
    setAvatarUrl,
    artistMode,
    setArtistMode,
    handleAvatarChange,
    handleSave,
    isSaving,
    handleArtistModeToggle,
  }
}
