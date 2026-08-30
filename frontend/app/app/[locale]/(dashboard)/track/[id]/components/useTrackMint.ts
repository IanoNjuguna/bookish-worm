'use client'

import { useState } from 'react'
import React from 'react'
import { toast } from 'sonner'
import { markCollected } from '@/lib/onboarding'
import { buyFractionOnChain, formatTxError } from '@/lib/contractHelper'
import { MintLinkToast } from '@/components/audio/MintLinkToast'
import type { Track } from './TrackDetailClient.types'

export interface UseTrackMintArgs {
  track: Track | null
  hasOwned: boolean
  address?: string | null
  lucid: any
  isAuthenticated: boolean
  login: () => Promise<string | null>
  getValidToken: () => Promise<string | null>
  onSuccess?: () => void
}

export interface UseTrackMintReturn {
  isMinting: boolean
  handleMint: () => Promise<void>
}

export function useTrackMint({
  track,
  hasOwned,
  address,
  lucid,
  isAuthenticated,
  login,
  getValidToken,
  onSuccess,
}: UseTrackMintArgs): UseTrackMintReturn {
  const [isMinting, setIsMinting] = useState(false)

  const handleMint = async () => {
    if (!isAuthenticated) {
      login()
      return
    }

    const suppressToasts = hasOwned

    if (!address) {
      if (!suppressToasts) toast.error('Please connect your Cardano wallet first')
      return
    }
    if (!track || !track.uploader_address) {
      if (!suppressToasts) toast.error('Track creator address not found')
      return
    }

    setIsMinting(true)
    let mainToast: string | number | undefined
    if (!suppressToasts) mainToast = toast.loading(`Collecting "${track.name}"...`)

    try {
      if (!lucid) throw new Error('Cardano wallet not connected or initialized')
      if (mainToast) toast.loading('Creating, signing and submitting transaction...', { id: mainToast })
      const txHash = await buyFractionOnChain(lucid, { token_id: track.token_id, uploader_address: track.uploader_address })
      if (mainToast) toast.loading('Confirming transaction on-chain...', { id: mainToast })
      await lucid.awaitTx(txHash)

      const token = await getValidToken()
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '/api-backend'}/mints`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ track_id: track.token_id, tx_hash: txHash }),
        })
      }

      onSuccess?.()
      if (mainToast) {
        toast.success(React.createElement(MintLinkToast, { txHash, message: `"${track.name}" collected!` }), {
          id: mainToast,
        })
      }
      markCollected()
    } catch (error: any) {
      if (mainToast) toast.error(formatTxError(error), { id: mainToast })
    } finally {
      setIsMinting(false)
    }
  }

  return { isMinting, handleMint }
}
