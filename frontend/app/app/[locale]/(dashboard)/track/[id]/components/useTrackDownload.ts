'use client'

import { toast } from 'sonner'
import type { Track } from './TrackDetailClient.types'

export interface UseTrackDownloadArgs {
  track: Track | null
  address?: string | null
  hasOwned: boolean
  getValidToken: () => Promise<string | null>
}

export function useTrackDownload({ track, address, hasOwned, getValidToken }: UseTrackDownloadArgs) {
  const handleDownload = async () => {
    if (!address || !hasOwned || !track) return

    const mainToast = toast.loading('Preparing download...')
    try {
      const token = await getValidToken()
      if (!token) throw new Error('Authentication failed. Please try logging in again.')

      const response = await fetch(`/api-backend/songs/${track.token_id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Download failed' }))
        throw new Error(errorData.message || 'Failed to download file')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${track.artist} - ${track.name}.mp3`
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
