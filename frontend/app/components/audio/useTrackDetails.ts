'use client'

import { useEffect, useState, useCallback } from 'react'
import { logger } from '@/lib/logger'
import type { Track } from './AudioPlayer.types'

export interface UseTrackDetailsReturn {
  hasOwned: boolean
  mintData: { minted: number; max: number }
  uploaderAddress: string | null
  albumId: number | null
  albumName: string | null
  ticker: string | null
  setHasOwned: (value: boolean) => void
}

export function useTrackDetails(
  currentTrack: Track | null,
  effectiveAddress?: string
): UseTrackDetailsReturn {
  const [hasOwned, setHasOwned] = useState(false)
  const [mintData, setMintData] = useState({ minted: 0, max: 0 })
  const [uploaderAddress, setUploaderAddress] = useState<string | null>(null)
  const [albumId, setAlbumId] = useState<number | null>(null)
  const [albumName, setAlbumName] = useState<string | null>(null)
  const [ticker, setTicker] = useState<string | null>(null)

  const fetchTrackDetails = useCallback(async () => {
    if (!currentTrack) return
    const tokenId = currentTrack.id
    if (tokenId === undefined || tokenId === null) {
      setMintData({ minted: 0, max: 0 })
      return
    }

    try {
      const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
      const headers: Record<string, string> = {}
      if (authData) {
        const parsed = JSON.parse(authData)
        if (parsed?.accessToken) {
          headers.Authorization = `Bearer ${parsed.accessToken}`
        }
      }

      const res = await fetch(`/api-backend/songs/${tokenId}`, { headers })
      if (!res.ok) return

      const data = await res.json()
      setHasOwned(!!data.is_owned)
      setMintData({
        minted: Number(data.mint_count || 0),
        max: Number(data.max_supply || 0),
      })
      if (data.uploader_address) setUploaderAddress(data.uploader_address)
      if (data.album_id !== undefined) setAlbumId(data.album_id)
      if (data.album_name) setAlbumName(data.album_name)
      if (data.ticker) setTicker(data.ticker)
    } catch (e) {
      logger.error('useTrackDetails: Error fetching track details', e)
    }
  }, [currentTrack])

  useEffect(() => {
    setAlbumName(null)
    setTicker(null)
    setUploaderAddress(null)
    setAlbumId(null)
    setHasOwned(false)
    fetchTrackDetails()
  }, [currentTrack?.id, effectiveAddress, fetchTrackDetails])

  return {
    hasOwned,
    mintData,
    uploaderAddress,
    albumId,
    albumName,
    ticker,
    setHasOwned,
  }
}
