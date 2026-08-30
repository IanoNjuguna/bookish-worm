'use client'

import { Button } from '@/components/ui/button'
import { IconHeart, IconLoader2, IconShare, IconCopy } from '@tabler/icons-react'

interface TrackCollectActionsProps {
  hasOwned: boolean
  isSoldOut: boolean
  isMinting: boolean
  onMint: () => void
  onShare: () => void
  onCopyLink: () => void
  onDownload: () => void
}

export function TrackCollectActions({
  hasOwned,
  isSoldOut,
  isMinting,
  onMint,
  onShare,
  onCopyLink,
  onDownload,
}: TrackCollectActionsProps) {
  return (
    <div className="flex gap-3">
      {hasOwned ? (
        <Button
          onClick={onDownload}
          className="flex-1 h-12 rounded-xl bg-lavender hover:bg-lavender/80 text-black border border-lavender/20 text-xs font-bold uppercase tracking-widest"
        >
          Download Track
        </Button>
      ) : !isSoldOut ? (
        <Button
          onClick={onMint}
          disabled={isMinting}
          className="flex-1 h-12 rounded-xl bg-cyber-pink hover:bg-cyber-pink/90 text-white text-xs font-bold uppercase tracking-widest"
        >
          {isMinting && <IconLoader2 size={18} className="animate-spin" />}
          Collect
        </Button>
      ) : null}

      <Button
        variant="outline"
        onClick={onShare}
        className="flex-1 lg:flex-none lg:w-12 h-12 p-0 rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
        title="Share"
      >
        <IconShare size={18} className="text-midnight/60 dark:text-white/60" />
      </Button>
      <Button
        variant="outline"
        onClick={onCopyLink}
        className="flex-1 lg:flex-none lg:w-12 h-12 p-0 rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
        title="Copy Link"
      >
        <IconCopy size={18} className="text-midnight/60 dark:text-white/60" />
      </Button>
      {hasOwned && !isSoldOut && (
        <Button
          variant="outline"
          onClick={onMint}
          disabled={isMinting}
          className="flex-1 lg:flex-none lg:w-12 h-12 p-0 rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
          title="Collect More"
        >
          {isMinting ? (
            <IconLoader2 size={18} className="animate-spin text-midnight/60 dark:text-white/60" />
          ) : (
            <IconHeart size={18} className="text-midnight/60 dark:text-white/60" />
          )}
        </Button>
      )}
    </div>
  )
}
