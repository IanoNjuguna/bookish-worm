'use client'

import { IconPhoto } from '@tabler/icons-react'

interface EmptyAssetsProps {
  onDiscover: () => void
}

export function EmptyAssets({ onDiscover }: EmptyAssetsProps) {
  return (
    <div className="glass-surface p-12 text-center rounded-2xl">
      <IconPhoto className="w-12 h-12 mx-auto mb-4 text-midnight/50 dark:text-white/20" />
      <h4 className="text-lg font-display font-bold mb-1">No Doba Tokens Yet</h4>
      <p className="text-midnight/70 dark:text-white/40 text-sm max-w-xs mx-auto">
        You don't hold any doba tokens yet. Head over to the Marketplace to buy and collect tracks!
      </p>
      <button
        onClick={onDiscover}
        className="mt-6 inline-flex items-center gap-2 bg-cyber-pink hover:bg-cyber-pink/90 text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all"
      >
        Discover Music
      </button>
    </div>
  )
}
