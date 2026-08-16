'use client'

import { useEffect, useState } from 'react'
import { useAudio } from '@/components/AudioProvider'

export function useHasUploads() {
  const { effectiveAddress } = useAudio()
  const [hasUploads, setHasUploads] = useState(false)

  useEffect(() => {
    if (!effectiveAddress) {
      setHasUploads(false)
      return
    }

    const check = async () => {
      try {
        const res = await fetch(`/api-backend/songs?artist=${effectiveAddress}&limit=1`)
        if (!res.ok) return
        const data = await res.json()
        setHasUploads(Array.isArray(data) && data.length > 0)
      } catch {
        setHasUploads(false)
      }
    }

    check()
  }, [effectiveAddress])

  return hasUploads
}
