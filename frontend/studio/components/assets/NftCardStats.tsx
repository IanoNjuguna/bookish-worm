'use client'

import type { Track } from './AssetsView.types'

interface NftCardStatsProps {
  nft: Track
  adaPrice: number
}

export function NftCardStats({ nft, adaPrice }: NftCardStatsProps) {
  const unitPrice = parseFloat(nft.price || '5')
  const qty = nft.quantity || 1
  const supply = Number(nft.supply || 1000)
  const holdingsAda = unitPrice * qty
  const holdingsUsd = holdingsAda * adaPrice
  const marketCapAda = unitPrice * supply
  const marketCapUsd = marketCapAda * adaPrice

  return (
    <div className="space-y-2 pt-3 border-t border-midnight/[0.06] dark:border-white/[0.06]">
      <div className="flex justify-between items-center text-xs">
        <span className="text-[10px] text-midnight/60 dark:text-white/40 uppercase tracking-widest font-display font-bold">
          YOUR HOLDINGS
        </span>
        <span className="font-mono font-bold text-pink-600 dark:text-cyber-pink">
          ${holdingsUsd.toFixed(2)} USD{' '}
          <span className="text-[10px] text-midnight/40 dark:text-white/40 font-normal font-mono">
            ({holdingsAda.toFixed(1)} ADA)
          </span>
        </span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-[10px] text-midnight/60 dark:text-white/40 uppercase tracking-widest font-display font-bold">
          SONG MARKET CAP
        </span>
        <span className="font-mono font-semibold text-midnight/70 dark:text-white/70">
          ${marketCapUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </span>
      </div>
    </div>
  )
}
