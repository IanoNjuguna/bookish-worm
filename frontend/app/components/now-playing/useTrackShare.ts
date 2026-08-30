'use client'

import { toast } from 'sonner'
import { SHARE_ORIGIN } from './NowPlayingSidebar.constants'
import type { SidebarTrack } from './NowPlayingSidebar.types'

export function useTrackShare(track: SidebarTrack | null) {
  const handleShare = () => {
    if (!track) return
    if (navigator.share) {
      navigator.share({
        title: track.name || track.title,
        text: `Check out ${track.name || track.title} by ${track.artist || track.creator} on Doba`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleCopyLink = () => {
    const tokenId = track?.id !== undefined ? track.id : track?.token_id
    const shareUrl = `${SHARE_ORIGIN}/track/${tokenId}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Track link copied!')
  }

  return { handleShare, handleCopyLink }
}
