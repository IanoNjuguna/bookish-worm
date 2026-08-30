import { IconDisc, IconPlayerPlay } from '@tabler/icons-react'
import type { PlayCountBadgeProps } from './SongCard.types'

export function PlayCountBadge({ playCount, isAlbum }: PlayCountBadgeProps) {
  return (
    <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/10 px-1.5 py-0.5 rounded flex-shrink-0">
      {isAlbum ? (
        <IconDisc size={10} className="text-white/80 animate-[spin_4s_linear_infinite]" />
      ) : (
        <IconPlayerPlay size={8} className="fill-white/80 text-white/80" />
      )}
      <span className="text-[8px] font-mono font-bold text-white/80">
        {playCount >= 1000 ? `${(playCount / 1000).toFixed(1)}k` : playCount}
      </span>
    </div>
  )
}
