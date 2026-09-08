'use client'

import { logger } from '@/lib/logger'
import React from 'react'

interface MintData {
  minted: number
  max: number
}

function getAuthHeaders(): Record<string, string> {
  const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
  const headers: Record<string, string> = {}
  if (authData) {
    try {
      const parsedAuth = JSON.parse(authData)
      if (parsedAuth && parsedAuth.accessToken) {
        headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`
      }
    } catch (e) {
      logger.error('useSongOwnership: Failed to parse auth data', e)
    }
  }
  return headers
}

export function useSongOwnership({
  tokenId,
  initialOwned,
  address,
}: {
  tokenId: number
  initialOwned: boolean
  address?: string | null
}) {
  const [hasOwned, setHasOwned] = React.useState(initialOwned)
  const [mintData, setMintData] = React.useState<MintData>({ minted: 0, max: 0 })
  const [uploaderAddress, setUploaderAddress] = React.useState<string | null>(null)
  const [albumId, setAlbumId] = React.useState<number | null>(null)
  const [ticker, setTicker] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (initialOwned) {
      setHasOwned(true)
      return
    }

    const checkBack = async () => {
      if (!address) return
      try {
        const res = await fetch(`/api-backend/songs/${tokenId}`, { headers: getAuthHeaders() })
        if (res.ok) {
          const data = await res.json()
          setHasOwned(!!data.is_owned)
          if (data.uploader_address) {
            setUploaderAddress(data.uploader_address)
          }
          if (data.album_id !== undefined) {
            setAlbumId(data.album_id)
          }
          if (data.ticker) {
            setTicker(data.ticker)
          }
        }
      } catch (e) {
        logger.error('useSongOwnership: Error checking ownership', e)
      }
    }

    checkBack()
  }, [initialOwned, address, tokenId])

  React.useEffect(() => {
    const fetchMints = async () => {
      try {
        const res = await fetch(`/api-backend/songs/${tokenId}`)
        if (res.ok) {
          const data = await res.json()
          setMintData({
            minted: Number(data.mint_count || 0),
            max: Number(data.max_supply || 0),
          })
          if (data.uploader_address) {
            setUploaderAddress(data.uploader_address)
          }
          if (data.album_id !== undefined) {
            setAlbumId(data.album_id)
          }
          if (data.ticker) {
            setTicker(data.ticker)
          }
        }
      } catch (err) {
        logger.error('useSongOwnership: Error fetching mint data', err)
      }
    }

    fetchMints()
  }, [tokenId])

  return {
    hasOwned,
    setHasOwned,
    mintData,
    uploaderAddress,
    albumId,
    ticker,
  }
}
