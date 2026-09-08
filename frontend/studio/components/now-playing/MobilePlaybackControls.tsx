'use client'

import {
  IconPlayerPlay as Play,
  IconPlayerPause as Pause,
  IconPlayerSkipBack as SkipBack,
  IconPlayerSkipForward as SkipForward,
} from '@tabler/icons-react'
import { MobileProgressBar } from './MobileProgressBar'

interface MobilePlaybackControlsProps {
  currentTime: number
  duration: number
  isPlaying: boolean
  onSeek: (time: number) => void
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
}

export function MobilePlaybackControls({
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onTogglePlay,
  onPrevious,
  onNext,
}: MobilePlaybackControlsProps) {
  return (
    <div className="space-y-4">
      <MobileProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek} />
      <div className="flex items-center justify-center gap-10">
        <button
          onClick={onPrevious}
          className="p-2 text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          aria-label="Previous"
        >
          <SkipBack size={28} className="fill-midnight dark:fill-white" />
        </button>
        <button
          onClick={onTogglePlay}
          className="w-14 h-14 rounded-xl bg-lavender text-midnight flex items-center justify-center shadow-lg active:scale-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={28} className="fill-midnight" /> : <Play size={28} className="fill-midnight ml-1" />}
        </button>
        <button
          onClick={onNext}
          className="p-2 text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          aria-label="Next"
        >
          <SkipForward size={28} className="fill-midnight dark:fill-white" />
        </button>
      </div>
    </div>
  )
}
