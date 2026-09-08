'use client'

import { MobilePlaybackControls } from './MobilePlaybackControls'
import { MobileLyrics } from './MobileLyrics'
import { MobileDetails } from './MobileDetails'
import type { SidebarTrack } from './NowPlayingSidebar.types'

interface MobileSectionProps {
  track: SidebarTrack
  currentTime: number
  duration: number
  isPlaying: boolean
  onSeek: (time: number) => void
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
  uploaderAddress: string | null
  locale: string
  onClose: () => void
}

export function MobileSection({
  track,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onTogglePlay,
  onPrevious,
  onNext,
  uploaderAddress,
  locale,
  onClose,
}: MobileSectionProps) {
  return (
    <div className="lg:hidden space-y-6 pt-6 mt-6 border-t border-midnight/[0.06] dark:border-white/[0.06]">
      <MobilePlaybackControls
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        onSeek={onSeek}
        onTogglePlay={onTogglePlay}
        onPrevious={onPrevious}
        onNext={onNext}
      />
      <MobileLyrics track={track} />
      <MobileDetails
        track={track}
        uploaderAddress={uploaderAddress}
        locale={locale}
        onClose={onClose}
      />
    </div>
  )
}
