'use client'

import { useSliderGesture } from './useSliderGesture'
import { formatTime } from './PlayerProgress.constants'
import type { PlayerProgressProps } from './PlayerProgress.types'

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 dark:focus-visible:outline-cyber-pink'

export function PlayerProgress({ currentTime, duration, onSeek, variant = 'desktop' }: PlayerProgressProps) {
  const seekable = duration > 0 && duration !== Infinity
  const position = seekable ? Math.min(1, currentTime / duration) : 0

  const slider = useSliderGesture({
    value: position,
    disabled: !seekable,
    onChange: (next) => onSeek(next * (duration || 0)),
  })

  const shownPercent = slider.displayValue * 100
  const thumbVisible = slider.isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'

  if (variant === 'mobile') {
    return (
      <div
        ref={slider.ref}
        {...slider.handlers}
        {...slider.a11y}
        aria-label="Track Progress"
        aria-valuetext={`${formatTime(slider.displayValue * duration)} of ${formatTime(duration)}`}
        className={`h-2 self-stretch mx-3 mt-1 bg-midnight/10 dark:bg-white/10 relative cursor-pointer group overflow-hidden rounded-full touch-none ${FOCUS_RING}`}
      >
        <div className="h-full bg-pink-600 dark:bg-cyber-pink rounded-full" style={{ width: `${shownPercent}%` }} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-[500px]">
      <span className="text-[10px] text-midnight/70 dark:text-white/40 tabular-nums w-8 text-right flex-shrink-0">
        {formatTime(slider.displayValue * duration)}
      </span>
      <div
        ref={slider.ref}
        {...slider.handlers}
        {...slider.a11y}
        aria-label="Track Progress"
        aria-valuetext={`${formatTime(slider.displayValue * duration)} of ${formatTime(duration)}`}
        className={`group relative flex-1 h-3 flex items-center cursor-pointer touch-none ${FOCUS_RING}`}
      >
        <div className="absolute inset-y-0 my-auto h-[3px] w-full bg-midnight/10 dark:bg-white/10 rounded-full" />
        <div className="absolute inset-y-0 my-auto h-[3px] bg-pink-600 dark:bg-cyber-pink rounded-full" style={{ width: `${shownPercent}%` }} />
        <div
          className={`absolute w-3 h-3 bg-white shadow-md transition-opacity -translate-x-1/2 rounded-full border border-midnight/10 ${thumbVisible}`}
          style={{ left: `${shownPercent}%` }}
        />
      </div>
      <span className="text-[10px] text-midnight/70 dark:text-white/40 tabular-nums w-8 flex-shrink-0">{formatTime(duration)}</span>
    </div>
  )
}
