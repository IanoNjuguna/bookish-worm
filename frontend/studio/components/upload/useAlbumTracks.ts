'use client'

import { useState, useCallback } from 'react'
import { DEFAULT_DURATION } from './UploadView.constants'
import type { AlbumTrack, UseAlbumTracksReturn } from './UploadView.types'

export type { UseAlbumTracksReturn } from './UploadView.types'

export function useAlbumTracks(): UseAlbumTracksReturn {
  const [albumTracks, setAlbumTracks] = useState<AlbumTrack[]>([
    {
      id: Date.now(),
      title: '',
      file: null,
      audioHash: '',
      audioName: '',
      duration: DEFAULT_DURATION,
      streamingUrl: '',
    },
  ])

  const addAlbumTrack = useCallback(() => {
    setAlbumTracks((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        title: '',
        file: null,
        audioHash: '',
        audioName: '',
        duration: DEFAULT_DURATION,
        streamingUrl: '',
      },
    ])
  }, [])

  const removeAlbumTrack = useCallback((index: number) => {
    setAlbumTracks((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateAlbumTrack = useCallback(
    (index: number, field: keyof Omit<AlbumTrack, 'id'>, value: unknown) => {
      setAlbumTracks((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], [field]: value }
        return next
      })
    },
    []
  )

  const handleAlbumTrackFileChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return
      const file = e.target.files[0]

      setAlbumTracks((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], file }
        return next
      })

      const objectUrl = URL.createObjectURL(file)
      const audio = new Audio(objectUrl)
      audio.addEventListener('loadedmetadata', () => {
        const durationSec = Math.floor(audio.duration)
        const minutes = Math.floor(durationSec / 60)
        const seconds = durationSec % 60
        const isoDuration = `PT${minutes}M${seconds}S`
        setAlbumTracks((prev) =>
          prev.map((track, i) =>
            i === index ? { ...track, duration: isoDuration } : track
          )
        )
        URL.revokeObjectURL(objectUrl)
      })
    },
    []
  )

  return {
    albumTracks,
    setAlbumTracks,
    addAlbumTrack,
    removeAlbumTrack,
    updateAlbumTrack,
    handleAlbumTrackFileChange,
  }
}
