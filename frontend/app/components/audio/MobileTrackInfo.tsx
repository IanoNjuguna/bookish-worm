'use client'

import { CollectButton } from './CollectButton'
import { IPFS_GATEWAY } from './AudioPlayer.constants'
import type { AudioPlayerState } from './AudioPlayer.types'

interface MobileTrackInfoProps {
  track: NonNullable<AudioPlayerState['currentTrack']>
  isMinting: boolean
  hasOwned: boolean
  isSoldOut: boolean
  onMint: (e: React.MouseEvent) => void
  onOpenSidebar: () => void
}

export function MobileTrackInfo({
  track,
  isMinting,
  hasOwned,
  isSoldOut,
  onMint,
  onOpenSidebar,
}: MobileTrackInfoProps) {
  return (
    <>
      <div
        className="w-10 h-10 flex-shrink-0 overflow-hidden bg-midnight/5 dark:bg-white/5 cursor-pointer rounded-md"
        onClick={onOpenSidebar}
      >
        <img
          src={(track.cover || '').replace('ipfs://', IPFS_GATEWAY)}
          alt={track.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="flex-1 min-w-0 flex items-center gap-2 pl-2 cursor-pointer"
        onClick={onOpenSidebar}
      >
        <div className="min-w-0 flex-shrink truncate">
          <h4 className="text-sm font-bold text-midnight dark:text-white truncate">
            {track.title}
          </h4>
        </div>
        <CollectButton
          isMinting={isMinting}
          hasOwned={hasOwned}
          isSoldOut={isSoldOut}
          onCollect={onMint}
          size={16}
          className="p-0"
        />
      </div>
    </>
  )
}
