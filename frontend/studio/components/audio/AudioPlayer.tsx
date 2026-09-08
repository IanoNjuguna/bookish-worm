'use client'

import { DesktopPlayer } from './DesktopPlayer'
import { MobilePlayer } from './MobilePlayer'
import { usePlayerController } from './usePlayerController'
import { cn } from '@/lib/utils'
import type { AudioPlayerState } from './AudioPlayer.types'

interface AudioPlayerProps {
  playerState: AudioPlayerState
  desktopSidebarOpen?: boolean
}

export function AudioPlayer({ playerState, desktopSidebarOpen }: AudioPlayerProps) {
  const player = usePlayerController(playerState)

  if (!player.track) return null

  return (
    <div
      className={cn(
        'fixed bottom-3 left-3 right-3 lg:bottom-4 lg:right-6 z-50 h-auto md:h-[90px] glass-surface bg-midnight/[0.02] dark:bg-white/[0.02] backdrop-blur-2xl shadow-lg pb-[env(safe-area-inset-bottom)] transition-all duration-300',
        'opacity-100 translate-y-0 pointer-events-auto',
        desktopSidebarOpen ? 'lg:left-[272px]' : 'lg:left-6'
      )}
    >
      <audio
        ref={player.audioRef}
        preload="auto"
        onTimeUpdate={player.handleTimeUpdate}
        onLoadedMetadata={player.handleLoadedMetadata}
        onDurationChange={player.handleDurationChange}
        onEnded={player.handleEnded}
        onPlay={player.handleDurationChange}
      />
      <DesktopPlayer
        playerState={playerState}
        queue={player.queue}
        track={player.track}
        ticker={player.ticker}
        isMinting={player.isMinting}
        hasOwned={player.hasOwned}
        isSoldOut={player.isSoldOut}
        isSidebarOpen={player.isSidebarOpen}
        onMint={player.onMint}
        onOpenSidebar={player.onOpenSidebar}
        onToggleSidebar={player.onToggleSidebar}
      />
      <MobilePlayer
        playerState={playerState}
        queue={player.queue}
        track={player.track}
        isMinting={player.isMinting}
        hasOwned={player.hasOwned}
        isSoldOut={player.isSoldOut}
        onMint={player.onMint}
        onOpenSidebar={player.onOpenSidebar}
      />
    </div>
  )
}
