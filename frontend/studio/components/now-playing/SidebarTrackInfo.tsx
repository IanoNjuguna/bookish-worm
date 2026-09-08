'use client'

import { IconMicrophone, IconSquareCheckFilled } from '@tabler/icons-react'
import type { SidebarTrack, MintData } from './NowPlayingSidebar.types'

interface SidebarTrackInfoProps {
  track: SidebarTrack
  mintData: MintData
  hasOwned: boolean
}

export function SidebarTrackInfo({ track, mintData, hasOwned }: SidebarTrackInfoProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2 text-left">
        <h2 className="text-xl font-display font-bold text-midnight dark:text-white tracking-tight leading-tight">
          {track.name || track.title}
        </h2>
        <div className="flex items-center justify-start gap-2 text-midnight/80 dark:text-lavender font-bold">
          <IconMicrophone size={14} />
          <p className="text-xs font-display font-bold uppercase tracking-widest">{track.artist || track.creator}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {hasOwned ? (
            <div className="flex items-center gap-1.5 text-emerald-500">
              <IconSquareCheckFilled size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Collected</span>
            </div>
          ) : (
            <span className="text-pink-600 dark:text-cyber-pink font-display font-bold text-lg">
              {track.price || '5'} ADA
            </span>
          )}
          <span className="text-[10px] text-midnight/70 dark:text-white/40 font-display font-bold uppercase tracking-widest">
            {mintData.max === 0 ? `${mintData.minted} Collected` : `${mintData.minted} / ${mintData.max} Edition`}
          </span>
        </div>
        <div className="h-[3px] w-full bg-midnight/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-pink-600 dark:bg-cyber-pink transition-all duration-1000 rounded-full"
            style={{ width: mintData.max === 0 ? '100%' : `${(mintData.minted / (mintData.max || 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
