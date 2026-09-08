'use client'

import { IconWallet } from '@tabler/icons-react'

export function AssetsConnectPrompt() {
  return (
    <div className="glass-surface p-12 text-center rounded-2xl shadow-xl">
      <div className="w-16 h-16 mx-auto mb-6 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lavender rounded-2xl">
        <IconWallet size={32} />
      </div>
      <h3 className="text-xl font-display font-bold mb-2">Connect Wallet</h3>
      <p className="text-midnight/50 dark:text-white/50 text-sm max-w-sm mx-auto mb-6">
        Connect your Cardano wallet to view your asset balances, custom tokens, and collected NFTs.
      </p>
      <button
        onClick={() => document.getElementById('connect-wallet-btn')?.click()}
        className="bg-lavender hover:bg-lavender/90 text-midnight font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
      >
        Connect Wallet
      </button>
    </div>
  )
}
