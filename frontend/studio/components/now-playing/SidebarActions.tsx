'use client'

import { Button } from '@/components/ui/button'
import { IconShare, IconCopy, IconExternalLink, IconLoader2 } from '@tabler/icons-react'
import type { SidebarTrack } from './NowPlayingSidebar.types'

interface SidebarActionsProps {
  track: SidebarTrack
  locale: string
  isSoldOut: boolean
  isMinting: boolean
  onMint: () => void
  onShare: () => void
  onCopyLink: () => void
  onClose: () => void
}

export function SidebarActions({
  track,
  locale,
  isSoldOut,
  isMinting,
  onMint,
  onShare,
  onCopyLink,
  onClose,
}: SidebarActionsProps) {
  return (
    <div className="flex gap-2">
      {!track.is_owned && !isSoldOut && (
        <Button
          className="flex-1 h-12 rounded-xl font-display font-bold uppercase tracking-widest text-xs transition-all duration-300 bg-cyber-pink hover:bg-cyber-pink/90 text-white"
          onClick={onMint}
          disabled={isMinting}
        >
          {isMinting && <IconLoader2 size={16} className="animate-spin mr-2" />}
          Collect
        </Button>
      )}

      <Button
        variant="outline"
        className="flex-1 lg:flex-none lg:w-12 h-12 p-0 rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
        onClick={onShare}
        title="Share"
      >
        <IconShare size={18} className="text-midnight/60 dark:text-white/60" />
      </Button>

      <Button
        variant="outline"
        className="flex-1 lg:flex-none lg:w-12 h-12 p-0 rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
        onClick={onCopyLink}
        title="Copy Link"
      >
        <IconCopy size={18} className="text-midnight/60 dark:text-white/60" />
      </Button>

      <Button
        variant="outline"
        className="flex-1 lg:flex-none lg:w-12 h-12 p-0 rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
        asChild
        title="View more"
      >
        <a
          href={`https://app.doba.world/track/${track.token_id ?? track.id}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          aria-label="View full song details"
        >
          <IconExternalLink size={18} className="text-midnight/60 dark:text-white/60" />
        </a>
      </Button>
    </div>
  )
}
