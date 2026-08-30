'use client'

import type { Track } from './AssetsView.types'

interface NftListRowProps {
  nft: Track
  adaPrice: number
  onClick: () => void
}

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'

export function NftListRow({ nft, adaPrice, onClick }: NftListRowProps) {
  const unitPrice = parseFloat(nft.price || '5')
  const qty = nft.quantity || 1
  const holdingsAda = unitPrice * qty
  const holdingsUsd = holdingsAda * adaPrice

  return (
    <div
      onClick={onClick}
      className="flex sm:hidden items-center justify-between p-3 glass-surface rounded-xl hover:border-cyber-pink/50 transition cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-midnight/5 dark:bg-white/5 flex-shrink-0">
          <img
            src={nft.image_url.replace('ipfs://', IPFS_GATEWAY)}
            alt={nft.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 bg-cyber-pink px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold text-white leading-none scale-90">
            x{qty}
          </div>
        </div>
        <div className="min-w-0">
          <h4 className="font-display font-bold text-sm text-midnight dark:text-white truncate">{nft.name}</h4>
          <p className="text-[10px] text-midnight/50 dark:text-white/50 truncate">by {nft.artist}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 pl-2">
        <div className="font-mono font-bold text-xs text-pink-600 dark:text-cyber-pink">${holdingsUsd.toFixed(2)}</div>
        <div className="text-[9px] text-midnight/40 dark:text-white/40 font-mono">({holdingsAda.toFixed(1)} ADA)</div>
      </div>
    </div>
  )
}
