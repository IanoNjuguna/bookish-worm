'use client'

import { NftListRow } from './NftListRow'
import { NftCard } from './NftCard'
import type { Track } from './AssetsView.types'

interface NftGridProps {
  nfts: Track[]
  adaPrice: number
  onSelect: (tokenId: number) => void
}

export function NftGrid({ nfts, adaPrice, onSelect }: NftGridProps) {
  return (
    <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
      {nfts.map(nft => (
        <div key={nft.token_id}>
          <NftListRow nft={nft} adaPrice={adaPrice} onClick={() => onSelect(nft.token_id)} />
          <NftCard nft={nft} adaPrice={adaPrice} onClick={() => onSelect(nft.token_id)} />
        </div>
      ))}
    </div>
  )
}
