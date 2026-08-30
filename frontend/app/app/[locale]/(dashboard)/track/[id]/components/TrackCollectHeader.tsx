'use client'

import { IconSquareCheckFilled } from '@tabler/icons-react'
import type { Track } from './TrackDetailClient.types'

interface TrackCollectHeaderProps {
  track: Track
  hasOwned: boolean
  mintCount: number
  maxSupply: number
}

export function TrackCollectHeader({ track, hasOwned, mintCount, maxSupply }: TrackCollectHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      {hasOwned ? (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-midnight/40 dark:text-white/35 font-bold mb-0.5">
            Status
          </p>
          <div className="flex items-center gap-1.5 text-emerald-500 text-sm font-bold font-mono">
            <IconSquareCheckFilled size={18} />
            Collected
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-midnight/40 dark:text-white/35 font-bold mb-0.5">
            Price
          </p>
          <span className="text-2xl font-extrabold text-cyber-pink font-mono">{track.price || '5'} ADA</span>
        </div>
      )}
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-wider text-midnight/40 dark:text-white/35 font-bold mb-1">
          Mints
        </p>
        <div className="text-sm font-mono font-bold flex items-center gap-1.5 justify-end">
          <span className="text-midnight dark:text-white">{mintCount.toLocaleString()}</span>
          <span className="text-midnight/30 dark:text-white/20">/</span>
          <span className="text-midnight/60 dark:text-white/50">{maxSupply.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
