'use client'

import { useEffect, useState } from 'react'
import { useCardano } from '@/components/Providers'

export function useArtistMode(): boolean {
  const { address } = useCardano()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!address || typeof window === 'undefined') return

    const read = () => {
      const stored = window.localStorage.getItem(`doba_artist_mode_${address}`)
      setEnabled(stored === 'true')
    }

    read()

    const onStorage = (e: StorageEvent) => {
      if (e.key === `doba_artist_mode_${address}`) {
        read()
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [address])

  return enabled
}
