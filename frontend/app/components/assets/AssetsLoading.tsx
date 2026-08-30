'use client'

import { IconLoader2 } from '@tabler/icons-react'

export function AssetsLoading() {
  return (
    <div className="p-12 text-center">
      <IconLoader2 size={32} className="animate-spin text-pink-600 dark:text-cyber-pink mx-auto mb-4" />
      <p className="text-midnight/70 dark:text-white/40 text-sm italic">Loading your portfolio assets...</p>
    </div>
  )
}
