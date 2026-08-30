'use client'

import { formatTokenId } from './TrackDetailClient.constants'
import type { Track } from './TrackDetailClient.types'

interface TrackHeaderProps {
  track: Track
}

export function TrackHeader({ track }: TrackHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-bold text-pink-600 dark:text-cyber-pink bg-cyber-pink/10 border border-cyber-pink/20 px-2.5 py-0.5 uppercase tracking-widest rounded-full">
          {track.genre || 'RARE'}
        </span>
        <span className="text-[9px] font-bold text-midnight/60 dark:text-white/30 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 px-2.5 py-0.5 uppercase tracking-widest rounded-full">
          #{formatTokenId(track.token_id)}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-midnight dark:text-white mb-1 md:mb-2">
        {track.name}
      </h1>
      <p className="text-base text-midnight/60 dark:text-white/50 font-medium tracking-wide mb-4 md:mb-6">
        {track.artist}
      </p>
    </div>
  )
}
