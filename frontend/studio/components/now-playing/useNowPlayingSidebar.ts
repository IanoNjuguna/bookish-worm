'use client'

import { useAudio } from '@/components/audio'
import { useCardano } from '@/components/Providers'
import { useSidebarData } from './useSidebarData'
import { useSidebarMint } from './useSidebarMint'
import { useTrackDownload } from './useTrackDownload'
import { useTrackShare } from './useTrackShare'
import { useEscapeKey } from './useEscapeKey'
import type { AudioPlayerState } from '@/components/audio/AudioPlayer.types'
import type { SidebarTrack } from './NowPlayingSidebar.types'
import type { UseSidebarDataReturn } from './useSidebarData'

export interface UseNowPlayingSidebarReturn {
  playerState: AudioPlayerState
  sidebarData: UseSidebarDataReturn
  hasOwned: boolean
  isMinting: boolean
  handleMint: () => Promise<void>
  handleDownload: () => Promise<void>
  handleShare: () => void
  handleCopyLink: () => void
  isSoldOut: boolean
}

export function useNowPlayingSidebar(track: SidebarTrack | null, onClose: () => void): UseNowPlayingSidebarReturn {
  const { playerState, effectiveAddress, isAuthenticated, getValidToken, login } = useAudio()
  const { address: cardanoAddress, lucid } = useCardano()

  const sidebarData = useSidebarData(track, effectiveAddress)
  const { mintData, hasOwned, setHasOwned } = sidebarData

  const { isMinting, handleMint } = useSidebarMint({
    track,
    uploaderAddress: sidebarData.uploaderAddress,
    uploaderPaymentAddress: sidebarData.uploaderPaymentAddress,
    albumId: sidebarData.albumId,
    ticker: sidebarData.ticker,
    hasOwned,
    setHasOwned,
    cardanoAddress,
    effectiveAddress,
    lucid,
    isAuthenticated,
    login,
    getValidToken,
    onSuccess: sidebarData.refresh,
  })

  const { handleDownload } = useTrackDownload({
    track,
    effectiveAddress,
    hasOwned,
    getValidToken,
  })
  const { handleShare, handleCopyLink } = useTrackShare(track)
  useEscapeKey(onClose)

  return {
    playerState,
    sidebarData,
    hasOwned,
    isMinting,
    handleMint,
    handleDownload,
    handleShare,
    handleCopyLink,
    isSoldOut: mintData.max > 0 && mintData.minted >= mintData.max,
  }
}
