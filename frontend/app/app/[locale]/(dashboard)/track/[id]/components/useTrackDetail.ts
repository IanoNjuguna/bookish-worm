'use client'

import { useEffect, useState } from 'react'
import { API_URL } from './TrackDetailClient.constants'
import type { Track } from './TrackDetailClient.types'

export interface UseTrackDetailReturn {
  track: Track | null
  loading: boolean
  refresh: () => void
}

export function useTrackDetail(id: string | undefined, initialTrack: Track | null, address?: string | null): UseTrackDetailReturn {
  const [track, setTrack] = useState<Track | null>(initialTrack)
  const [loading, setLoading] = useState(!initialTrack)

  const fetchTrack = async () => {
    if (!id) return
    try {
      const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
      const headers: Record<string, string> = {}
      if (authData) {
        const parsedAuth = JSON.parse(authData)
        if (parsedAuth?.accessToken) headers.Authorization = `Bearer ${parsedAuth.accessToken}`
      }
      const res = await fetch(`${API_URL.replace(/\/$/, '')}/songs/${id}`, { headers })
      if (res.ok) {
        const data = await res.json()
        setTrack(data)
      }
    } catch (e) {
      console.error('Failed to fetch track', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialTrack || address) {
      fetchTrack()
    }
  }, [id, address])

  return { track, loading, refresh: fetchTrack }
}
