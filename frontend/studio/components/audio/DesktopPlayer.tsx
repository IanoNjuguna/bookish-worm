'use client'

import { PlayerInfo } from './PlayerInfo'
import { PlayerControls } from './PlayerControls'
import { PlayerProgress } from './PlayerProgress'
import { PlayerSideActions } from './PlayerSideActions'
import type { QueueActions } from './useAudioQueue'
import type { AudioPlayerState } from './AudioPlayer.types'

interface DesktopPlayerProps {
  playerState: AudioPlayerState
  queue: QueueActions
  track: NonNullable<AudioPlayerState['currentTrack']>
  ticker: string | null
  isMinting: boolean
  hasOwned: boolean
  isSoldOut: boolean
  isSidebarOpen: boolean
  onMint: (e: React.MouseEvent) => void
  onOpenSidebar: () => void
  onToggleSidebar: () => void
}

export function DesktopPlayer({
  playerState,
  queue,
  track,
  ticker,
  isMinting,
  hasOwned,
  isSoldOut,
  isSidebarOpen,
  onMint,
  onOpenSidebar,
  onToggleSidebar,
}: DesktopPlayerProps) {
  return (
    <div className="hidden md:flex items-center gap-4 px-6 h-[90px] max-w-screen-2xl mx-auto">
      <PlayerInfo
        track={track}
        isPlaying={playerState.isPlaying}
        ticker={ticker}
        onOpenSidebar={onOpenSidebar}
      />
      <div className="flex flex-col items-center gap-2 flex-1 min-w-0 py-3">
        <PlayerControls
          isPlaying={playerState.isPlaying}
          isShuffle={queue.isShuffle}
          repeatMode={queue.repeatMode}
          onTogglePlayPause={playerState.togglePlayPause}
          onNext={queue.next}
          onPrevious={queue.previous}
          onToggleShuffle={queue.toggleShuffle}
          onCycleRepeat={queue.cycleRepeat}
        />
        <PlayerProgress
          currentTime={playerState.currentTime}
          duration={playerState.duration}
          onSeek={playerState.seek}
        />
      </div>
      <PlayerSideActions
        volume={playerState.volume}
        isMuted={playerState.isMuted}
        onToggleMute={playerState.toggleMute}
        onSetVolume={playerState.setVolume}
        isMinting={isMinting}
        hasOwned={hasOwned}
        isSoldOut={isSoldOut}
        onMint={onMint}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={onToggleSidebar}
      />
    </div>
  )
}
