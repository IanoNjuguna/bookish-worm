'use client'

import { PlayerControls } from './PlayerControls'
import { PlayerProgress } from './PlayerProgress'
import { MobileTrackInfo } from './MobileTrackInfo'
import type { QueueActions } from './useAudioQueue'
import type { AudioPlayerState } from './AudioPlayer.types'

interface MobilePlayerProps {
  playerState: AudioPlayerState
  queue: QueueActions
  track: NonNullable<AudioPlayerState['currentTrack']>
  isMinting: boolean
  hasOwned: boolean
  isSoldOut: boolean
  onMint: (e: React.MouseEvent) => void
  onOpenSidebar: () => void
}

export function MobilePlayer({
  playerState,
  queue,
  track,
  isMinting,
  hasOwned,
  isSoldOut,
  onMint,
  onOpenSidebar,
}: MobilePlayerProps) {
  return (
    <div className="flex md:hidden flex-col items-center">
      <PlayerProgress
        variant="mobile"
        currentTime={playerState.currentTime}
        duration={playerState.duration}
        onSeek={playerState.seek}
      />
      <div className="flex items-center w-full gap-5 px-3 py-3">
        <MobileTrackInfo
          track={track}
          isMinting={isMinting}
          hasOwned={hasOwned}
          isSoldOut={isSoldOut}
          onMint={onMint}
          onOpenSidebar={onOpenSidebar}
        />
        <PlayerControls
          variant="mobile"
          isPlaying={playerState.isPlaying}
          isShuffle={queue.isShuffle}
          repeatMode={queue.repeatMode}
          onTogglePlayPause={playerState.togglePlayPause}
          onNext={queue.next}
          onPrevious={queue.previous}
          onToggleShuffle={queue.toggleShuffle}
          onCycleRepeat={queue.cycleRepeat}
        />
      </div>
    </div>
  )
}
