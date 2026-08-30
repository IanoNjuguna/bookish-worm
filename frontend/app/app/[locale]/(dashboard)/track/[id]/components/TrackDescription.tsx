'use client'

import type { Track } from './TrackDetailClient.types'

interface TrackDescriptionProps {
  track: Track
}

export function TrackDescription({ track }: TrackDescriptionProps) {
  return (
    <div className="lg:col-span-2 space-y-4 glass-surface rounded-2xl p-5 sm:p-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-midnight/40 dark:text-white/30">
        Lyrics / Description
      </h2>
      {track.description ? (
        <p className="text-sm text-midnight/80 dark:text-white/80 leading-relaxed whitespace-pre-line">
          {track.description}
        </p>
      ) : (
        <p className="text-sm text-midnight/40 dark:text-white/40 italic">
          No description or lyrics provided for this track.
        </p>
      )}
    </div>
  )
}
