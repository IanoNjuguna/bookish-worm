'use client'

import { DobaVisualizer } from '@/components/icons/DobaVisualizer'
import type { TokenAsset } from './AssetsView.types'

interface DobaTokenBannerProps {
  token: TokenAsset
}

export function DobaTokenBanner({ token }: DobaTokenBannerProps) {
  return (
    <div className="glass-surface rounded-xl p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 flex items-center justify-center">
          <DobaVisualizer className="text-pink-600 dark:text-cyber-pink w-6 h-6" />
        </div>
        <div>
          <h4 className="font-display font-bold text-midnight dark:text-white">DOBA</h4>
          <p className="text-xs text-midnight/70 dark:text-white/40 font-mono">Doba Ecosystem Token</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold font-mono text-midnight dark:text-white">{token.balance.toLocaleString()} DOBA</p>
        <p className="text-xs text-midnight/70 dark:text-white/40 font-mono">${token.usdValue.toFixed(2)} USD</p>
      </div>
    </div>
  )
}
