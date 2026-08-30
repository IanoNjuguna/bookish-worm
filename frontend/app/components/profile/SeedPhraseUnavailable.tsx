'use client'

import { IconWallet } from '@tabler/icons-react'

export function SeedPhraseUnavailable() {
  return (
    <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4 flex items-start gap-3">
      <div className="p-2 bg-midnight/5 dark:bg-white/5 rounded-lg shrink-0">
        <IconWallet className="text-midnight/60 dark:text-white/40" size={20} />
      </div>
      <p className="text-sm text-midnight/60 dark:text-white/60 leading-relaxed">
        No recovery phrase available. You are likely connected via a browser extension wallet which securely manages your keys.
      </p>
    </div>
  )
}
