'use client'

import { useState } from 'react'
import React from 'react'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import { markCollected } from '@/lib/onboarding'
import { buyFractionOnChain, formatTxError } from '@/lib/contractHelper'
import { MintLinkToast } from './MintLinkToast'
import type { Track } from './AudioPlayer.types'

export interface UsePlayerMintArgs {
  currentTrack: Track | null
  uploaderAddress: string | null
  albumId: number | null
  ticker: string | null
  hasOwned: boolean
  setHasOwned: (value: boolean) => void
  lucid: any
  isAuthenticated: boolean
  login: () => Promise<string | null>
  getValidToken: () => Promise<string | null>
}

export interface UsePlayerMintReturn {
  isMinting: boolean
  handleMint: (e: React.MouseEvent) => Promise<void>
}

export function usePlayerMint({
  currentTrack,
  uploaderAddress,
  albumId,
  ticker,
  hasOwned,
  setHasOwned,
  lucid,
  isAuthenticated,
  login,
  getValidToken,
}: UsePlayerMintArgs): UsePlayerMintReturn {
  const [isMinting, setIsMinting] = useState(false)

  const handleMint = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated || !currentTrack) {
      login()
      return
    }
    if (hasOwned) return

    const targetUploader = uploaderAddress || currentTrack.uploader_address
    if (!targetUploader) {
      toast.error('Creator address not found. Please try again.')
      return
    }

    setIsMinting(true)
    const mainToast = toast.loading(`Preparing to collect "${currentTrack.title}"...`)

    try {
      logger.info('usePlayerMint: Starting purchase for track', {
        id: currentTrack.id,
        price: currentTrack.price,
      })
      if (!lucid) throw new Error('Cardano wallet not connected or initialized')

      toast.loading('Creating, signing and submitting transaction...', { id: mainToast })
      const txHash = await buyFractionOnChain(lucid, {
        token_id: currentTrack.id,
        uploader_address: targetUploader,
        album_id: albumId,
        ticker: ticker || undefined,
      })

      toast.loading(React.createElement(MintLinkToast, { txHash, message: 'Transaction submitted!' }), {
        id: mainToast,
      })

      const token = await getValidToken()
      if (token) {
        const recordRes = await fetch(`/api-backend/mints`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ track_id: currentTrack.id, tx_hash: txHash }),
        })
        if (!recordRes.ok) {
          logger.error('usePlayerMint: Failed to record transaction in database')
        }
      }

      setHasOwned(true)
      markCollected()
      toast.success(`"${currentTrack.title}" collected!`, { id: mainToast })
    } catch (error: any) {
      logger.error('usePlayerMint: Collection Error', error)
      toast.error(formatTxError(error), { id: mainToast })
    } finally {
      setIsMinting(false)
    }
  }

  return { isMinting, handleMint }
}
