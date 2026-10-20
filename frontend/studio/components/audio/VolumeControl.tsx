'use client'

import { IconVolume2, IconVolumeOff } from '@tabler/icons-react'
import { useSliderGesture } from './useSliderGesture'
import type { VolumeControlProps } from './VolumeControl.types'

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 dark:focus-visible:outline-cyber-pink'

export function VolumeControl({ volume, isMuted, onToggleMute, onSetVolume }: VolumeControlProps) {
  const effective = isMuted ? 0 : volume

  const slider = useSliderGesture({
    value: effective,
    onChange: (next) => {
      onSetVolume(next)
      // Moving the slider off zero unmutes, matching the bar the user can see.
      if (next > 0 && isMuted) onToggleMute()
    },
  })

  const shownPercent = slider.displayValue * 100
  const thumbVisible = slider.isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <button
        onClick={onToggleMute}
        className="p-1.5 text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white transition-colors flex-shrink-0"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted || volume === 0 ? <IconVolumeOff size={18} /> : <IconVolume2 size={18} />}
      </button>
      <div
        ref={slider.ref}
        {...slider.handlers}
        {...slider.a11y}
        aria-label="Volume"
        aria-valuetext={`${Math.round(slider.displayValue * 100)}%`}
        className={`group relative flex-1 h-3 flex items-center cursor-pointer touch-none ${FOCUS_RING}`}
      >
        <div className="absolute inset-y-0 my-auto h-[3px] w-full bg-midnight/10 dark:bg-white/20 rounded-full" />
        <div className="absolute inset-y-0 my-auto h-[3px] bg-pink-600 dark:bg-cyber-pink rounded-full" style={{ width: `${shownPercent}%` }} />
        <div
          className={`absolute w-3 h-3 bg-white shadow-md transition-opacity -translate-x-1/2 rounded-full border border-midnight/10 ${thumbVisible}`}
          style={{ left: `${shownPercent}%` }}
        />
      </div>
    </div>
  )
}
