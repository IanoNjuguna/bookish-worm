'use client'

import { DobaVisualizer } from '@/components/icons/DobaVisualizer'
import type { TokenAsset } from './AssetsView.types'

interface TokenRowProps {
  token: TokenAsset
}

export function TokenRow({ token }: TokenRowProps) {
  return (
    <div className="p-5 flex items-center justify-between hover:bg-midnight/5 dark:hover:bg-white/5 transition">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 flex items-center justify-center font-display font-bold text-midnight dark:text-white text-sm uppercase overflow-hidden">
          {token.symbol === 'DOBA' ? (
            <DobaVisualizer className="text-pink-600 dark:text-cyber-pink w-6 h-6 animate-pulse" />
          ) : token.logoUrl ? (
            <img src={token.logoUrl} alt={token.symbol} className="w-full h-full object-cover" />
          ) : (
            token.symbol.slice(0, 2)
          )}
        </div>
        <div>
          <h4 className="font-display font-bold text-midnight dark:text-white">{token.symbol}</h4>
          <p
            className="text-xs text-midnight/70 dark:text-white/40 font-mono truncate max-w-[200px]"
            title={token.name}
          >
            {token.name}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold font-mono text-midnight dark:text-white">
          {token.balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 })} {token.symbol}
        </p>
        <p className="text-xs text-midnight/70 dark:text-white/40 font-mono">
          {token.price > 0 ? `$${token.usdValue.toFixed(2)} USD` : '-'}
        </p>
      </div>
    </div>
  )
}
