'use client'

import { logger } from '@/lib/logger'
import {
  buyFractionOnChain,
  buyAlbumFractionsOnChain,
  formatTxError,
} from '@/lib/contractHelper'
import { EXPLORER_URL } from '@/lib/config'
import { markCollected } from '@/lib/onboarding'
import { Track } from '@/lib/types'
import React from 'react'
import { toast } from 'sonner'

interface MintDependencies {
  tokenId: number
  name: string
  isAlbum: boolean
  albumTracks: Track[]
  hasOwned: boolean
  setHasOwned: (value: boolean) => void
  uploaderAddress: string | null
  albumId: number | null
  ticker: string | null
  mintData: { minted: number; max: number }
  isAuthenticated: boolean
  login: () => void
  accessToken: string | null
  lucid: any
}

export function useMint({
  tokenId,
  name,
  isAlbum,
  albumTracks,
  hasOwned,
  setHasOwned,
  uploaderAddress,
  albumId,
  ticker,
  mintData,
  isAuthenticated,
  login,
  accessToken,
  lucid,
}: MintDependencies) {
  const [isMinting, setIsMinting] = React.useState(false)

  const handleMint = React.useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()

      if (!isAuthenticated) {
        login()
        return
      }

      if (hasOwned) {
        toast.info("You already own this track! Check your library.")
        return
      }

      if (mintData.max > 0 && mintData.minted >= mintData.max) {
        toast.error("This edition is sold out!")
        return
      }

      const targetUploader = uploaderAddress
      if (!targetUploader) {
        toast.error("Creator address not found. Please try again.")
        return
      }

      setIsMinting(true)
      const mainToast = toast.loading(`Collecting "${name}"...`)

      const unownedTracks = isAlbum
        ? albumTracks.filter((t) => !t.is_owned)
        : []

      if (isAlbum && unownedTracks.length === 0) {
        toast.info("You already own all tracks in this album!", { id: mainToast })
        setIsMinting(false)
        return
      }

      try {
        if (!lucid) throw new Error("Cardano wallet not connected or initialized")

        toast.loading(`Creating, signing and submitting transaction...`, { id: mainToast })

        let txHash: string
        if (isAlbum) {
          txHash = await buyAlbumFractionsOnChain(
            lucid,
            unownedTracks.map((t) => ({
              token_id: t.token_id,
              uploader_address: t.uploader_address || targetUploader,
              ticker: t.ticker,
              price: t.price,
            }))
          )
        } else {
          txHash = await buyFractionOnChain(lucid, {
            token_id: tokenId,
            uploader_address: targetUploader,
            album_id: albumId,
            ticker: ticker || undefined,
          })
        }

        setHasOwned(true)
        markCollected()
        toast.success(
          <div className="flex flex-col gap-1">
            <p className="font-bold">"{name}" collected!</p>
            <a
              href={`${EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-pink-600 dark:text-cyber-pink hover:underline flex items-center gap-1"
            >
              View on Explorer
            </a>
          </div>,
          { id: mainToast }
        )

        if (isAlbum) {
          for (const track of unownedTracks) {
            try {
              if (isAuthenticated && accessToken) {
                await fetch(`/api-backend/mints`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({
                    track_id: track.token_id,
                    tx_hash: txHash,
                  }),
                })
              }
            } catch (err: unknown) {
              logger.error('useMint: Failed to record album track mint in backend', track.token_id, err)
            }
          }
        } else {
          try {
            if (isAuthenticated && accessToken) {
              await fetch(`/api-backend/mints`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  track_id: tokenId,
                  tx_hash: txHash,
                }),
              })
            }
          } catch (err: unknown) {
            logger.error('useMint: Failed to record mint in backend', err)
          }
        }
      } catch (error: unknown) {
        logger.error('useMint: Mint error', error)
        toast.error(formatTxError(error), { id: mainToast })
      } finally {
        setIsMinting(false)
      }
    },
    [
      tokenId,
      name,
      isAlbum,
      albumTracks,
      hasOwned,
      setHasOwned,
      uploaderAddress,
      albumId,
      ticker,
      mintData,
      isAuthenticated,
      login,
      accessToken,
      lucid,
    ]
  )

  return { isMinting, handleMint }
}
