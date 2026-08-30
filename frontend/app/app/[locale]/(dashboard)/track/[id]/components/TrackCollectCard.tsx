'use client'

import { TrackCollectHeader } from './TrackCollectHeader'
import { TrackMintProgress } from './TrackMintProgress'
import { TrackCollectActions } from './TrackCollectActions'
import type { Track } from './TrackDetailClient.types'

interface TrackCollectCardProps {
  track: Track
  hasOwned: boolean
  isSoldOut: boolean
  isMinting: boolean
  mintCount: number
  maxSupply: number
  onMint: () => void
  onShare: () => void
  onCopyLink: () => void
  onDownload: () => void
}

export function TrackCollectCard(props: TrackCollectCardProps) {
  const { track, hasOwned, isSoldOut, isMinting, mintCount, maxSupply, onMint, onShare, onCopyLink, onDownload } = props
  return (
    <div id="track-collect-container" className="w-full md:mt-2 glass-surface rounded-2xl p-5 shadow-lg">
      <TrackCollectHeader track={track} hasOwned={hasOwned} mintCount={mintCount} maxSupply={maxSupply} />
      <TrackMintProgress mintCount={mintCount} maxSupply={maxSupply} />
      <TrackCollectActions
        hasOwned={hasOwned}
        isSoldOut={isSoldOut}
        isMinting={isMinting}
        onMint={onMint}
        onShare={onShare}
        onCopyLink={onCopyLink}
        onDownload={onDownload}
      />
    </div>
  )
}
