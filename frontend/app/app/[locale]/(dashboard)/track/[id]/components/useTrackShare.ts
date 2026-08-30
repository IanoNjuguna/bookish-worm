'use client'

import { toast } from 'sonner'
import type { Track } from './TrackDetailClient.types'

export function useTrackShare(track: Track | null, locale: string) {
  const handleShare = () => {
    const text = `Check out "${track?.name}" by ${track?.artist} on Doba! 🎵`
    const embedUrl = `https://doba.world/track/${track?.token_id}`
    const warpcastIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrl)}`
    window.open(warpcastIntentUrl, '_blank')
  }

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/${locale}/track/${track?.token_id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied to clipboard!')
  }

  return { handleShare, handleCopyLink }
}
