import { IconEye, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import type { LibraryTrackRowProps } from './MyStudioGrid.types'
import { LibraryTrackTitleCell } from './LibraryTrackTitleCell'

export function LibraryTrackRow({
  track,
  index,
  showPlayButton,
  isCurrent,
  onMouseEnter,
  onMouseLeave,
  onPlay,
  onOpenSidebar,
}: LibraryTrackRowProps) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[48px_1fr_120px_100px_160px_60px] gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-2 hover:bg-midnight/5 dark:hover:bg-white/5 border-b border-white/[0.02] md:border-none transition-colors group items-center rounded-xl"
    >
      {/* Index / Play Button */}
      <div className="flex justify-center items-center">
        {showPlayButton ? (
          <button
            type="button"
            onClick={onPlay}
            className="w-7 h-7 md:w-6 md:h-6 flex items-center justify-center bg-white text-black rounded-md shadow-sm transition-all active:scale-90"
          >
            {isCurrent ? (
              <IconPlayerPause size={14} className="fill-black" />
            ) : (
              <IconPlayerPlay size={14} className="fill-black ml-0.5" />
            )}
          </button>
        ) : (
          <span className="text-xs md:text-sm font-medium text-midnight/50 dark:text-white/20 tabular-nums">
            {(index + 1).toString().padStart(2, '0')}
          </span>
        )}
      </div>

      <LibraryTrackTitleCell track={track} onPlay={onPlay} />

      <div className="hidden md:flex items-center text-xs text-midnight/50 dark:text-white/50">
        <span className="bg-midnight/5 dark:bg-white/5 px-2 py-0.5 rounded-full border border-white/5 font-bold uppercase tracking-widest text-[9px]">{track.genre || 'RARE'}</span>
      </div>

      {/* Streams */}
      <div className="hidden md:flex items-center text-[10px] text-midnight/60 dark:text-white/60 font-mono">
        <IconPlayerPlay size={10} className="mr-1 text-pink-600/40 dark:text-cyber-pink/40" />
        {track.play_count || 0}
      </div>

      {/* Date Added */}
      <div className="hidden lg:flex items-center text-xs text-midnight/70 dark:text-white/40 font-mono">
        {track.created_at ? new Date(track.created_at).toLocaleDateString() : 'N/A'}
      </div>

      {/* View Details Button */}
      <div className="flex justify-center pr-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-9 w-9 md:h-8 md:w-8 p-0 hover:bg-midnight/5 dark:hover:bg-white/5 text-midnight/60 dark:text-white/30 hover:text-midnight dark:hover:text-white rounded-md border border-transparent hover:border-white/5"
          onClick={onOpenSidebar}
        >
          <IconEye size={18} />
        </Button>
      </div>
    </div>
  )
}
