'use client'

import { SidebarArtwork } from './SidebarArtwork'
import { SidebarTrackInfo } from './SidebarTrackInfo'
import { SidebarActions } from './SidebarActions'
import { SidebarOwnerActions } from './SidebarOwnerActions'
import type { SidebarTrack, MintData } from './NowPlayingSidebar.types'

interface SidebarContentProps {
  track: SidebarTrack
  mintData: MintData
  hasOwned: boolean
  locale: string
  isSoldOut: boolean
  isMinting: boolean
  onMint: () => void
  onShare: () => void
  onCopyLink: () => void
  onDownload: () => void
  onClose: () => void
}

export function SidebarContent({
  track,
  mintData,
  hasOwned,
  locale,
  isSoldOut,
  isMinting,
  onMint,
  onShare,
  onCopyLink,
  onDownload,
  onClose,
}: SidebarContentProps) {
  return (
    <div className="space-y-6">
      <SidebarArtwork track={track} onClose={onClose} />
      <SidebarTrackInfo track={track} mintData={mintData} hasOwned={hasOwned} />
      <SidebarActions
        track={track}
        locale={locale}
        isSoldOut={isSoldOut}
        isMinting={isMinting}
        onMint={onMint}
        onShare={onShare}
        onCopyLink={onCopyLink}
        onClose={onClose}
      />
      {hasOwned && (
        <SidebarOwnerActions
          isSoldOut={isSoldOut}
          isMinting={isMinting}
          onDownload={onDownload}
          onCollectMore={onMint}
        />
      )}
    </div>
  )
}
