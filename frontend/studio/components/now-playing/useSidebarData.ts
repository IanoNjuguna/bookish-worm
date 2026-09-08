'use client'

import { useEffect, useState, useCallback } from 'react'
import type { SidebarTrack, MintData } from './NowPlayingSidebar.types'

export interface UseSidebarDataReturn {
  mintData: MintData
  hasOwned: boolean
  setHasOwned: (value: boolean) => void
  uploaderAddress: string | null
  uploaderPaymentAddress: string | null
  albumId: number | null
  ticker: string | null
  splitter: string | null
  refresh: () => void
}

export function useSidebarData(track: SidebarTrack | null, effectiveAddress?: string): UseSidebarDataReturn {
  const [mintData, setMintData] = useState<MintData>({ minted: 0, max: 0 })
  const [hasOwned, setHasOwned] = useState(track?.is_owned ?? false)
  const [uploaderAddress, setUploaderAddress] = useState<string | null>(track?.uploader_address ?? null)
  const [uploaderPaymentAddress, setUploaderPaymentAddress] = useState<string | null>(track?.uploader_payment_address ?? null)
  const [albumId, setAlbumId] = useState<number | null>(track?.album_id ?? null)
  const [ticker, setTicker] = useState<string | null>(track?.ticker ?? null)
  const [splitter, setSplitter] = useState<string | null>(track?.splitter ?? null)

  useEffect(() => {
    setUploaderAddress(track?.uploader_address ?? null)
    setUploaderPaymentAddress(track?.uploader_payment_address ?? null)
    setAlbumId(track?.album_id ?? null)
    setTicker(track?.ticker ?? null)
    setSplitter(track?.splitter ?? null)
  }, [track])

  const fetchData = useCallback(async () => {
    if (!track) return
    const tokenId = track.id !== undefined ? track.id : track.token_id
    if (tokenId === undefined || tokenId === null) return

    try {
      const res = await fetch(`/api-backend/songs/${tokenId}`)
      if (res.ok) {
        const data = await res.json()
        setMintData({ minted: Number(data.mint_count || 0), max: Number(data.max_supply || 0) })
        if (data.uploader_address) setUploaderAddress(data.uploader_address)
        if (data.uploader_payment_address) setUploaderPaymentAddress(data.uploader_payment_address)
        if (data.album_id !== undefined) setAlbumId(data.album_id)
        if (data.ticker) setTicker(data.ticker)
        if (data.splitter) setSplitter(data.splitter)
      }

      if (effectiveAddress) {
        const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
        const headers: Record<string, string> = {}
        if (authData) {
          const parsedAuth = JSON.parse(authData)
          if (parsedAuth?.accessToken) headers.Authorization = `Bearer ${parsedAuth.accessToken}`
        }
        const ownRes = await fetch(`/api-backend/songs/${tokenId}`, { headers })
        if (ownRes.ok) {
          const ownData = await ownRes.json()
          setHasOwned(!!ownData.is_owned)
          if (ownData.uploader_address) setUploaderAddress(ownData.uploader_address)
          if (ownData.uploader_payment_address) setUploaderPaymentAddress(ownData.uploader_payment_address)
          if (ownData.album_id !== undefined) setAlbumId(ownData.album_id)
          if (ownData.ticker) setTicker(ownData.ticker)
          if (ownData.splitter) setSplitter(ownData.splitter)
        }
      }
    } catch (err) {
      console.error('Sidebar: Error fetching mint data', err)
    }
  }, [track, effectiveAddress])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    mintData,
    hasOwned,
    setHasOwned,
    uploaderAddress,
    uploaderPaymentAddress,
    albumId,
    ticker,
    splitter,
    refresh: fetchData,
  }
}
