'use client'

import { IconChevronLeft, IconMusic, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import type { Track } from './TrackDetailClient.types'

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'

interface TrackArtworkProps {
  track: Track
  isPlaying: boolean
  onBack: () => void
  onTogglePlay: () => void
}

export function TrackArtwork({ track, isPlaying, onBack, onTogglePlay }: TrackArtworkProps) {
  return (
    <div
      id="track-artwork-container"
      className="relative group w-full aspect-square md:w-80 md:flex-shrink-0 overflow-hidden glass-surface shadow-xl"
    >
      <button
        onClick={onBack}
        className="absolute top-3 left-3 z-20 w-12 h-12 flex items-center justify-center rounded-xl bg-midnight/70 dark:bg-white/70 text-white dark:text-midnight shadow-lg hover:bg-midnight dark:hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        title="Back"
        aria-label="Go back"
      >
        <IconChevronLeft size={20} />
      </button>
      {track.image_url ? (
        <img
          src={track.image_url.replace('ipfs://', IPFS_GATEWAY)}
          alt={track.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-midnight/5 dark:bg-white/5">
          <IconMusic size={80} strokeWidth={1} className="text-midnight/30 dark:text-white/30" />
        </div>
      )}
      <button
        onClick={onTogglePlay}
        className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
          {isPlaying ? (
            <IconPlayerPause size={32} className="fill-black text-black ml-0" />
          ) : (
            <IconPlayerPlay size={32} className="fill-black text-black ml-1" />
          )}
        </div>
      </button>
    </div>
  )
}
