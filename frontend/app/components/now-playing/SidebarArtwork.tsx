'use client'

import { IconMusic } from '@tabler/icons-react'
import { SidebarCloseButton } from './SidebarCloseButton'
import { IPFS_GATEWAY } from './NowPlayingSidebar.constants'
import type { SidebarTrack } from './NowPlayingSidebar.types'

interface SidebarArtworkProps {
  track: SidebarTrack
  onClose: () => void
}

export function SidebarArtwork({ track, onClose }: SidebarArtworkProps) {
  const imageUrl = (track.image_url || track.cover || '').replace('ipfs://', IPFS_GATEWAY)

  return (
    <div className="relative w-full aspect-square lg:w-36 lg:h-36 rounded-2xl overflow-hidden border border-midnight/10 dark:border-white/10 shadow-lg group bg-midnight/5 dark:bg-white/5 flex items-center justify-center">
      <SidebarCloseButton onClose={onClose} />
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={track.name || track.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <IconMusic size={64} strokeWidth={1} className="text-midnight/30 dark:text-white/30" />
      )}
    </div>
  )
}
