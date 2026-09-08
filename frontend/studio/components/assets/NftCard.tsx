'use client'

import { NftCardArtwork } from './NftCardArtwork'
import { NftCardStats } from './NftCardStats'
import type { Track } from './AssetsView.types'

interface NftCardProps {
  nft: Track
  adaPrice: number
  onClick: () => void
}

export function NftCard({ nft, adaPrice, onClick }: NftCardProps) {
  return (
    <div
      onClick={onClick}
      className="hidden sm:flex flex-col justify-between h-full glass-surface rounded-2xl overflow-hidden hover:border-cyber-pink/50 transition cursor-pointer group shadow-md hover:shadow-xl"
    >
      <div>
        <NftCardArtwork nft={nft} />
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-display font-bold text-midnight dark:text-white truncate group-hover:text-pink-600 dark:group-hover:text-cyber-pink transition-colors">
              {nft.name}
            </h4>
            <p className="text-xs text-midnight/50 dark:text-white/50 truncate">by {nft.artist}</p>
          </div>
          <NftCardStats nft={nft} adaPrice={adaPrice} />
        </div>
      </div>
    </div>
  )
}
