'use client'

import {
  IconPlayerPlay as Play,
  IconPlayerPause as Pause,
  IconPlayerSkipBack as SkipBack,
  IconPlayerSkipForward as SkipForward,
  IconArrowsShuffle,
  IconRepeat,
  IconRepeatOnce,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { PLAYER_ACCENT, PLAYER_MUTED, PLAYER_CONTROL_BASE } from './AudioPlayer.constants'
import type { RepeatMode } from './AudioPlayer.types'

interface PlayerControlsProps {
  isPlaying: boolean
  isShuffle: boolean
  repeatMode: RepeatMode
  onTogglePlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onToggleShuffle: () => void
  onCycleRepeat: () => void
  variant?: 'desktop' | 'mobile'
}

export function PlayerControls({
  isPlaying,
  isShuffle,
  repeatMode,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onToggleShuffle,
  onCycleRepeat,
  variant = 'desktop',
}: PlayerControlsProps) {
  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-3">
        <button onClick={onPrevious} className="p-1 text-midnight/70 dark:text-white/70 active:text-midnight dark:text-white" aria-label="Previous">
          <SkipBack size={20} className="fill-midnight dark:fill-white" />
        </button>
        <button onClick={onTogglePlayPause} className="w-9 h-9 flex items-center justify-center bg-midnight dark:bg-white text-white dark:text-black active:scale-90 rounded-md" aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={18} className="fill-white dark:fill-black" /> : <Play size={18} className="fill-white dark:fill-black ml-0.5" />}
        </button>
        <button onClick={onNext} className="p-1 text-midnight/70 dark:text-white/70 active:text-midnight dark:text-white" aria-label="Next">
          <SkipForward size={20} className="fill-midnight dark:fill-white" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <button onClick={onToggleShuffle} className={cn(PLAYER_CONTROL_BASE, isShuffle ? PLAYER_ACCENT : PLAYER_MUTED)} aria-label="Shuffle">
        <IconArrowsShuffle size={16} />
        {isShuffle && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-600 dark:bg-cyber-pink" />}
      </button>
      <button onClick={onPrevious} className={cn(PLAYER_CONTROL_BASE, 'text-midnight dark:text-white')} aria-label="Previous">
        <SkipBack size={20} className="fill-midnight dark:fill-white" />
      </button>
      <button onClick={onTogglePlayPause} className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all bg-midnight dark:bg-white hover:bg-midnight/90 dark:hover:bg-white/90 text-white dark:text-black active:scale-95 active:brightness-75 rounded-md" aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? <Pause size={18} className="fill-white dark:fill-black" /> : <Play size={18} className="fill-white dark:fill-black ml-0.5" />}
      </button>
      <button onClick={onNext} className={cn(PLAYER_CONTROL_BASE, 'text-midnight dark:text-white')} aria-label="Next">
        <SkipForward size={20} className="fill-midnight dark:fill-white" />
      </button>
      <button onClick={onCycleRepeat} className={cn(PLAYER_CONTROL_BASE, repeatMode !== 'off' ? PLAYER_ACCENT : PLAYER_MUTED)} aria-label="Repeat">
        {repeatMode === 'one' ? <IconRepeatOnce size={16} /> : <IconRepeat size={16} />}
        {repeatMode !== 'off' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-600 dark:bg-cyber-pink" />}
      </button>
    </div>
  )
}
