'use client'

import { IconLoader2 } from '@tabler/icons-react'

export function TrackLoading() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <IconLoader2 size={32} className="animate-spin text-pink-600 dark:text-cyber-pink" />
    </div>
  )
}
