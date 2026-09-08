'use client'

import type { Track } from './AssetsView.types'

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'

interface NftCardArtworkProps {
  nft: Track
}

export function NftCardArtwork({ nft }: NftCardArtworkProps) {
  const qty = nft.quantity || 1
  return (
    <div className="aspect-square w-full relative overflow-hidden bg-midnight/5 dark:bg-white/5 border-b border-midnight/5 dark:border-white/5">
      <img
        src={nft.image_url.replace('ipfs://', IPFS_GATEWAY)}
        alt={nft.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-3 left-3 bg-cyber-pink/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white shadow">
        {qty} {qty === 1 ? 'Fraction' : 'Fractions'}
      </div>
      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-white/80">
        ID #{nft.token_id}
      </div>
    </div>
  )
}
