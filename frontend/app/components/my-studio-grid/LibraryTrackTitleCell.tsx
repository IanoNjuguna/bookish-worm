import { IconMicrophone, IconSquareCheckFilled } from '@tabler/icons-react'
import { DobaVisualizer } from '@/components/icons/DobaVisualizer'
import { IPFS_GATEWAY_URL } from './MyStudioGrid.constants'
import type { LibraryTrackTitleCellProps } from './MyStudioGrid.types'

export function LibraryTrackTitleCell({ track, onPlay }: LibraryTrackTitleCellProps) {
  return (
    <div
      className="flex items-center gap-5 min-w-0 cursor-pointer"
      onClick={onPlay}
    >
      <div className="w-12 h-12 md:w-10 md:h-10 rounded-lg overflow-hidden flex-shrink-0 border border-midnight/10 dark:border-white/10">
        <img
          src={(track.image_url || '').replace('ipfs://', IPFS_GATEWAY_URL)}
          alt={track.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm md:text-base font-bold text-midnight dark:text-white truncate group-hover:text-cyber-pink transition-colors tracking-tight flex items-center gap-1.5 min-w-0">
          <span className="truncate">{track.name}</span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {track.is_owned && (
              <IconSquareCheckFilled size={12} className="text-emerald-500 flex-shrink-0" title="Collected" />
            )}
            {track.max_supply && track.max_supply > 0 && track.minted_count !== undefined && track.minted_count >= track.max_supply && (
              <DobaVisualizer size={12} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />
            )}
          </div>
        </h4>
        <p className="text-[9px] md:text-xs text-midnight/50 dark:text-white/50 truncate flex items-center gap-1 font-medium uppercase tracking-wider mt-0.5">
          <IconMicrophone size={10} className="text-pink-600/50 dark:text-cyber-pink/50 flex-shrink-0" />
          <span className="truncate">{track.artist}</span>
        </p>
      </div>
    </div>
  )
}
