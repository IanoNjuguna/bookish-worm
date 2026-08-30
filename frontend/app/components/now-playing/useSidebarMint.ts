'use client'

import { useState } from 'react'
import React from 'react'
import { toast } from 'sonner'
import { markCollected } from '@/lib/onboarding'
import { buyFractionOnChain, formatTxError } from '@/lib/contractHelper'
import { MintLinkToast } from '@/components/audio/MintLinkToast'
import type { SidebarTrack } from './NowPlayingSidebar.types'

export interface UseSidebarMintArgs {
  track: SidebarTrack | null
  uploaderAddress: string | null
  uploaderPaymentAddress: string | null
  albumId: number | null
  ticker: string | null
  hasOwned: boolean
  setHasOwned: (value: boolean) => void
  cardanoAddress?: string | null
  effectiveAddress?: string
  lucid: any
  isAuthenticated: boolean
  login: () => Promise<string | null>
  getValidToken: () => Promise<string | null>
  onSuccess?: () => void
}

export interface UseSidebarMintReturn {
  isMinting: boolean
  handleMint: () => Promise<void>
}

export function useSidebarMint({
  track,
  uploaderAddress,
  uploaderPaymentAddress,
  albumId,
  ticker,
  hasOwned,
  setHasOwned,
  cardanoAddress,
  effectiveAddress,
  lucid,
  isAuthenticated,
  login,
  getValidToken,
  onSuccess,
}: UseSidebarMintArgs): UseSidebarMintReturn {
  const [isMinting, setIsMinting] = useState(false)

  const handleMint = async () => {
    if (!isAuthenticated || !track) {
      login()
      return
    }

    const suppressToasts = hasOwned
    const targetUploader = uploaderAddress || track.uploader_address
    if (!targetUploader) {
      if (!suppressToasts) toast.error('Creator address not found. Please try again.')
      return
    }

    const isUploader =
      (cardanoAddress && targetUploader.toLowerCase() === cardanoAddress.toLowerCase()) ||
      (effectiveAddress && targetUploader.toLowerCase() === effectiveAddress.toLowerCase())

    const creatorAddressForContract = isUploader
      ? cardanoAddress
      : uploaderPaymentAddress || track.uploader_payment_address || targetUploader

    if (!creatorAddressForContract || creatorAddressForContract.startsWith('stake')) {
      if (!suppressToasts) toast.error('Creator payment address is still loading. Please wait a moment and try again.')
      return
    }

    setIsMinting(true)
    let mainToast: string | number | undefined
    if (!suppressToasts) {
      mainToast = toast.loading(`Preparing to collect "${String(track.name || track.title || '')}"...`)
    }

    try {
      const tokenId = track.id !== undefined ? track.id : track.token_id
      if (mainToast) toast.loading('Creating, signing and submitting transaction...', { id: mainToast })
      const txHash = await buyFractionOnChain(lucid, {
        token_id: Number(tokenId),
        uploader_address: creatorAddressForContract as string,
        album_id: albumId,
        ticker: ticker || undefined,
      })

      if (mainToast) toast.loading('Confirming transaction on-chain...', { id: mainToast })
      await lucid.awaitTx(txHash)

      if (mainToast) {
        toast.loading(React.createElement(MintLinkToast, { txHash, message: 'Transaction submitted!' }), {
          id: mainToast,
        })
      }

      const token = await getValidToken()
      if (token) {
        await fetch(`/api-backend/mints`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ track_id: tokenId, tx_hash: txHash }),
        })
      }

      setHasOwned(true)
      markCollected()
      onSuccess?.()
      if (mainToast) toast.success(`"${track.name || track.title}" collected!`, { id: mainToast })
    } catch (error: any) {
      console.error('Sidebar: Collection Error', error)
      if (mainToast) toast.error(formatTxError(error), { id: mainToast })
    } finally {
      setIsMinting(false)
    }
  }

  return { isMinting, handleMint }
}
