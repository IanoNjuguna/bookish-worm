'use client'

import { useEffect, useState } from 'react'
import { useAudio } from '@/components/AudioProvider'

export function useArtistMode() {
  const { effectiveAddress } = useAudio()
  const [artistMode, setArtistMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!effectiveAddress) {
      setArtistMode(false)
      setIsLoading(false)
      return
    }

    const storageKey = `doba_artist_mode_${effectiveAddress}`

    const check = async () => {
      try {
        const stored = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null
        if (stored !== null) {
          setArtistMode(stored === 'true')
          return
        }

        const res = await fetch(`/api-backend/users/${effectiveAddress}`)
        if (!res.ok) return
        const data = await res.json()
        setArtistMode(data.artist_mode === true)
      } catch {
        setArtistMode(false)
      } finally {
        setIsLoading(false)
      }
    }

    check()
  }, [effectiveAddress])

  return { artistMode, isLoading }
}
