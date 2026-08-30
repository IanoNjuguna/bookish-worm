'use client'

import { Button } from '@/components/ui/button'
import { IconLoader2 } from '@tabler/icons-react'

interface SidebarOwnerActionsProps {
  isSoldOut: boolean
  isMinting: boolean
  onDownload: () => void
  onCollectMore: () => void
}

export function SidebarOwnerActions({ isSoldOut, isMinting, onDownload, onCollectMore }: SidebarOwnerActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        className="h-11 rounded-xl text-xs font-display font-bold uppercase tracking-widest border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
        onClick={onDownload}
      >
        Download
      </Button>
      {!isSoldOut && (
        <Button
          variant="outline"
          className="h-11 rounded-xl text-xs font-display font-bold uppercase tracking-widest border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
          onClick={onCollectMore}
          disabled={isMinting}
        >
          {isMinting && <IconLoader2 size={16} className="animate-spin mr-2" />}
          Collect More
        </Button>
      )}
    </div>
  )
}
