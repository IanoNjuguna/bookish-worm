'use client'

import { toast } from 'sonner'
import type { SidebarTrack } from './NowPlayingSidebar.types'

export interface UseTrackDownloadArgs {
  track: SidebarTrack | null
  effectiveAddress?: string
  hasOwned: boolean
  getValidToken: () => Promise<string | null>
}

export function useTrackDownload({ track, effectiveAddress, hasOwned, getValidToken }: UseTrackDownloadArgs) {
  const handleDownload = async () => {
    const tokenId = track?.id !== undefined ? track.id : track?.token_id
    if (!effectiveAddress || !hasOwned || !track || tokenId === undefined) return

    const mainToast = toast.loading('Preparing download...')
    try {
      const activeToken = await getValidToken()
      if (!activeToken) throw new Error('Authentication failed. Please try logging in again.')

      const response = await fetch(`/api-backend/songs/${tokenId}/download`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Download failed' }))
        throw new Error(errorData.message || 'Failed to download file')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${track.artist || track.creator || 'Artist'} - ${track.name || track.title || 'Track'}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('Download started!', { id: mainToast })
    } catch (error: any) {
      toast.error(error.message || 'Download failed', { id: mainToast })
    }
  }

  return { handleDownload }
}
