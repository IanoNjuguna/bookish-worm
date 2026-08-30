'use client'

import { cn } from '@/lib/utils'
import { useTrackDetailPage } from './components/useTrackDetailPage'
import { TrackLoading } from './components/TrackLoading'
import { TrackNotFound } from './components/TrackNotFound'
import { TrackArtwork } from './components/TrackArtwork'
import { TrackHeader } from './components/TrackHeader'
import { TrackCollectCard } from './components/TrackCollectCard'
import { TrackDescription } from './components/TrackDescription'
import { TrackBlockchainDetails } from './components/TrackBlockchainDetails'
import type { Track } from './components/TrackDetailClient.types'

export default function TrackDetailClient({ initialTrack }: { initialTrack: Track | null }) {
  const {
    track,
    loading,
    locale,
    playerState,
    isPlaying,
    hasOwned,
    isMinting,
    isSoldOut,
    mintCount,
    maxSupply,
    handleBack,
    togglePlay,
    handleMint,
    handleDownload,
    handleShare,
    handleCopyLink,
    onNotFoundBack,
  } = useTrackDetailPage(initialTrack)

  if (loading) return <TrackLoading />
  if (!track) return <TrackNotFound onBack={onNotFoundBack} />

  return (
    <div
      className={cn(
        'min-h-screen bg-transparent text-midnight dark:text-white',
        playerState.currentTrack ? 'pb-32 lg:pb-0' : ''
      )}
    >
      <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start mb-6 md:mb-8">
        <TrackArtwork track={track} isPlaying={!!isPlaying} onBack={handleBack} onTogglePlay={togglePlay} />
        <div className="flex-1 w-full flex flex-col md:justify-between md:min-h-[320px]">
          <TrackHeader track={track} />
          <TrackCollectCard
            track={track}
            hasOwned={hasOwned}
            isSoldOut={isSoldOut}
            isMinting={isMinting}
            mintCount={mintCount}
            maxSupply={maxSupply}
            onMint={handleMint}
            onShare={handleShare}
            onCopyLink={handleCopyLink}
            onDownload={handleDownload}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8">
        <TrackDescription track={track} />
        <TrackBlockchainDetails track={track} />
      </div>
    </div>
  )
}
