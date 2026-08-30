'use client'

import type { SidebarTrack } from './NowPlayingSidebar.types'

interface MobileLyricsProps {
  track: SidebarTrack
}

export function MobileLyrics({ track }: MobileLyricsProps) {
  if (!track.description && !track.lyrics) return null
  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">
        Lyrics
      </p>
      <p className="text-midnight/80 dark:text-white/80 text-sm leading-relaxed whitespace-pre-line">
        {track.description || track.lyrics}
      </p>
    </div>
  )
}
