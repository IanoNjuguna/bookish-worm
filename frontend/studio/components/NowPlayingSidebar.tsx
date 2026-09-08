'use client'

import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { useNowPlayingSidebar } from './now-playing/useNowPlayingSidebar'
import { SidebarContent } from './now-playing/SidebarContent'
import { MobileSection } from './now-playing/MobileSection'
import type { NowPlayingSidebarProps } from './now-playing/NowPlayingSidebar.types'

export default function NowPlayingSidebar({ track, isVisible, onClose }: NowPlayingSidebarProps) {
  const locale = useLocale()
  const {
    playerState,
    sidebarData,
    hasOwned,
    isMinting,
    handleMint,
    handleDownload,
    handleShare,
    handleCopyLink,
    isSoldOut,
  } = useNowPlayingSidebar(track, onClose)
  const { isPlaying, duration, currentTime, togglePlayPause, next, previous, seek } = playerState

  if (!track) return null

  return (
    <aside
      className={cn(
        'fixed inset-x-3 top-20 bottom-3 z-[60] lg:static lg:inset-auto flex flex-col overflow-hidden transition-all duration-300 ease-in-out shrink-0 glass-surface rounded-2xl shadow-xl min-h-0',
        isVisible
          ? 'opacity-100 translate-y-0 lg:translate-x-0 lg:w-80 lg:mt-24 lg:mr-4 lg:mb-32 lg:ml-0'
          : 'opacity-0 pointer-events-none translate-y-6 lg:translate-y-0 lg:translate-x-4 lg:w-0 lg:m-0'
      )}
    >
      <div className="hidden lg:block absolute left-0 top-4 bottom-4 w-[1px] rounded-full bg-gradient-to-b from-transparent via-midnight/[0.08] dark:via-white/[0.08] to-transparent" />
      <div className="lg:hidden absolute top-0 left-4 right-4 h-[1px] rounded-full bg-gradient-to-r from-transparent via-midnight/[0.08] dark:via-white/[0.08] to-transparent" />

      <div
        className={cn(
          'w-full lg:w-80 flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar p-5 relative pb-4 transition-opacity duration-150 ease-out',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <SidebarContent
          track={track}
          mintData={sidebarData.mintData}
          hasOwned={hasOwned}
          locale={locale}
          isSoldOut={isSoldOut}
          isMinting={isMinting}
          onMint={handleMint}
          onShare={handleShare}
          onCopyLink={handleCopyLink}
          onDownload={handleDownload}
          onClose={onClose}
        />

        <MobileSection
          track={track}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onSeek={seek}
          onTogglePlay={togglePlayPause}
          onPrevious={previous}
          onNext={next}
          uploaderAddress={sidebarData.uploaderAddress}
          locale={locale}
          onClose={onClose}
        />
      </div>
    </aside>
  )
}
