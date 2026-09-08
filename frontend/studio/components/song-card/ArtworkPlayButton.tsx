'use client'

import { cn } from '@/lib/utils'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import type { ArtworkPlayButtonProps } from './SongCard.types'

export function ArtworkPlayButton({ onPlay, isPlaying }: ArtworkPlayButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onPlay()
      }}
      className={cn(
        "absolute right-3 bottom-3 z-30 w-10 h-10 bg-lavender hover:bg-lavender/90 hover:scale-105 active:scale-95 text-black rounded-md flex items-center justify-center transition-all duration-300 transform translate-y-2 opacity-0",
        "group-hover:translate-y-0 group-hover:opacity-100",
        isPlaying && "translate-y-0 opacity-100"
      )}
    >
      {isPlaying ? (
        <IconPlayerPause size={18} className="fill-black text-black" />
      ) : (
        <IconPlayerPlay size={18} className="fill-black text-black ml-0.5" />
      )}
    </button>
  )
}
