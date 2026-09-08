'use client'

import { IconLayoutSidebarRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { VolumeControl } from './VolumeControl'
import { CollectButton } from './CollectButton'

interface PlayerSideActionsProps {
  volume: number
  isMuted: boolean
  onToggleMute: () => void
  onSetVolume: (volume: number) => void
  isMinting: boolean
  hasOwned: boolean
  isSoldOut: boolean
  onMint: (e: React.MouseEvent) => void
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function PlayerSideActions({
  volume,
  isMuted,
  onToggleMute,
  onSetVolume,
  isMinting,
  hasOwned,
  isSoldOut,
  onMint,
  isSidebarOpen,
  onToggleSidebar,
}: PlayerSideActionsProps) {
  return (
    <div className="flex items-center gap-4 w-[30%] min-w-[240px] flex-shrink-0 justify-end">
      <CollectButton
        isMinting={isMinting}
        hasOwned={hasOwned}
        isSoldOut={isSoldOut}
        onCollect={onMint}
      />
      <VolumeControl
        volume={volume}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onSetVolume={onSetVolume}
      />
      <button
        id="sidebar-toggle-btn"
        onClick={onToggleSidebar}
        className={cn(
          'p-1.5 transition-all hover:scale-110',
          isSidebarOpen
            ? 'text-pink-600 dark:text-cyber-pink'
            : 'text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white'
        )}
        title="Now Playing View"
      >
        <IconLayoutSidebarRight size={18} />
      </button>
    </div>
  )
}
