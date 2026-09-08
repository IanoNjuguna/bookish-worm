'use client'

import { useEffect, useState } from 'react'
import type React from 'react'
import type { AudioPlayerState } from './AudioPlayer.types'

interface UseStreamAnalyticsArgs {
  playerState: AudioPlayerState
  accessToken: string | null
}

export interface UseStreamAnalyticsReturn {
  recordedTracks: Set<number>
  setRecordedTracks: React.Dispatch<React.SetStateAction<Set<number>>>
  lastTrackId: number | null
  setLastTrackId: React.Dispatch<React.SetStateAction<number | null>>
}

export function useStreamAnalytics({
  playerState,
  accessToken,
}: UseStreamAnalyticsArgs): UseStreamAnalyticsReturn {
  const [recordedTracks, setRecordedTracks] = useState<Set<number>>(new Set())
  const [lastTrackId, setLastTrackId] = useState<number | null>(null)

  useEffect(() => {
    const track = playerState.currentTrack as any
    if (!track || !playerState.isPlaying) return

    const trackId = Number(track.id ?? track.token_id)
    if (isNaN(trackId)) return
    if (recordedTracks.has(trackId)) return
    if (playerState.currentTime < 60) return

    const recordPlay = async () => {
      try {
        if (!accessToken) return
        const res = await fetch(`/api-backend/songs/${trackId}/play`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (res.ok) {
          setRecordedTracks(prev => new Set(prev).add(trackId))
        } else {
          const errText = await res.text()
          console.error(`[Analytics] Failed:`, res.status, errText)
        }
      } catch (err) {
        console.error('[Analytics] Network error:', err)
      }
    }

    recordPlay()
  }, [playerState.currentTime, playerState.isPlaying, playerState.currentTrack, recordedTracks, accessToken])

  useEffect(() => {
    const track = playerState.currentTrack as any
    const currentId = track?.id ?? track?.token_id
    if (currentId !== lastTrackId) {
      setLastTrackId(currentId)
    }
  }, [playerState.currentTrack, lastTrackId])

  return { recordedTracks, setRecordedTracks, lastTrackId, setLastTrackId }
}
