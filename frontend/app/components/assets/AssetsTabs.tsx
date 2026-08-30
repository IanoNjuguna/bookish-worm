'use client'

import type { AssetsTab } from './AssetsView.types'

interface AssetsTabsProps {
  activeTab: AssetsTab
  nftCount: number
  onChange: (tab: AssetsTab) => void
}

export function AssetsTabs({ activeTab, nftCount, onChange }: AssetsTabsProps) {
  const base = 'pb-4 text-sm font-display font-bold uppercase tracking-wider transition-all relative'
  const inactive = 'text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white'
  const active = 'text-midnight dark:text-white'
  const underline = 'absolute bottom-0 left-0 w-full h-[2px] bg-pink-600 dark:bg-cyber-pink rounded-full'

  return (
    <div className="flex border-b border-midnight/[0.08] dark:border-white/[0.08] gap-6">
      <button onClick={() => onChange('tokens')} className={`${base} ${activeTab === 'tokens' ? active : inactive}`}>
        Wallet
        {activeTab === 'tokens' && <div className={underline} />}
      </button>
      <button onClick={() => onChange('nfts')} className={`${base} ${activeTab === 'nfts' ? active : inactive}`}>
        Doba Tokens ({nftCount})
        {activeTab === 'nfts' && <div className={underline} />}
      </button>
    </div>
  )
}
