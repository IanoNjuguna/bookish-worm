'use client'

import { IconCoins, IconMusic } from '@tabler/icons-react'

interface PortfolioHeaderProps {
  totalUsdValue: number
  walletUsdValue: number
  dobaUsdValue: number
}

export function PortfolioHeader({ totalUsdValue, walletUsdValue, dobaUsdValue }: PortfolioHeaderProps) {
  return (
    <div className="glass-surface p-6 lg:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
      <div>
        <span className="text-midnight/70 dark:text-white/40 text-xs uppercase tracking-widest font-display font-bold">
          Total Portfolio Worth
        </span>
        <h3 className="text-4xl font-bold text-midnight dark:text-white mt-1 font-mono">
          ${totalUsdValue.toFixed(2)}{' '}
          <span className="text-sm font-sans font-normal text-midnight/70 dark:text-white/40">USD</span>
        </h3>
        <p className="text-[10px] text-midnight/60 dark:text-white/30 uppercase tracking-widest font-display font-bold mt-2">
          Real-Time Aggregated Balance (FT + NFT)
        </p>
      </div>

      <div className="flex gap-3">
        <div className="bg-white/[0.03] border border-midnight/10 dark:border-white/10 px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyber-pink/10 flex items-center justify-center text-pink-600 dark:text-cyber-pink">
            <IconCoins size={18} />
          </div>
          <div>
            <p className="text-[10px] text-midnight/70 dark:text-white/40 uppercase font-display font-bold leading-none mb-1">
              Wallet
            </p>
            <p className="font-mono text-sm font-bold text-midnight dark:text-white">${walletUsdValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-midnight/10 dark:border-white/10 px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-lavender/10 flex items-center justify-center text-lavender">
            <IconMusic size={18} />
          </div>
          <div>
            <p className="text-[10px] text-midnight/70 dark:text-white/40 uppercase font-display font-bold leading-none mb-1">
              Doba Tokens
            </p>
            <p className="font-mono text-sm font-bold text-midnight dark:text-white">${dobaUsdValue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
