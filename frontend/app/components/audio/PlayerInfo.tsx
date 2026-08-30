'use client'

import type { Track } from './AudioPlayer.types'
import { IPFS_GATEWAY } from './AudioPlayer.constants'

interface PlayerInfoProps {
  track: Track
  isPlaying: boolean
  ticker: string | null
  onOpenSidebar: () => void
}

export function PlayerInfo({ track, isPlaying, ticker, onOpenSidebar }: PlayerInfoProps) {
  return (
    <div
      className="flex items-center gap-6 w-[30%] min-w-[240px] flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onOpenSidebar}
    >
      <div className="w-12 h-12 rounded-md flex-shrink-0 overflow-hidden bg-midnight/5 dark:bg-white/5 text-xs">
        <img
          src={(track.cover || '').replace('ipfs://', IPFS_GATEWAY)}
          alt={track.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1 pl-2">
        <div className="marquee-container">
          <div className="marquee-content">
            <span className="text-sm font-semibold text-midnight dark:text-white pr-12">{track.title}</span>
          </div>
        </div>
        <p className="text-xs text-midnight/50 dark:text-white/50 truncate mt-0.5">{track.creator}</p>
        {ticker && (
          <p className="text-[10px] font-mono text-purple-600 dark:text-lavender truncate mt-0.5 tracking-wide">
            ${ticker} on Doba
          </p>
        )}
      </div>

      {isPlaying && (
        <div className="flex items-end gap-[2px] h-3 flex-shrink-0 ml-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-[3px] bg-pink-600 dark:bg-cyber-pink equalizer-bar h-full"
              style={{ '--delay': `${i * 0.2}s` } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  )
}
