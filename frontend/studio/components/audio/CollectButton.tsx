'use client'

import { IconHeart, IconLoader2 } from '@tabler/icons-react'
import { DobaVisualizer } from '@/components/icons/DobaVisualizer'
import { cn } from '@/lib/utils'

interface CollectButtonProps {
  isMinting: boolean
  hasOwned: boolean
  isSoldOut: boolean
  onCollect: (e: React.MouseEvent) => void
  size?: number
  className?: string
}

export function CollectButton({
  isMinting,
  hasOwned,
  isSoldOut,
  onCollect,
  size = 22,
  className,
}: CollectButtonProps) {
  return (
    <button
      onClick={!hasOwned && !isSoldOut ? onCollect : undefined}
      disabled={isMinting || isSoldOut}
      className={cn(
        'p-2 transition-all hover:scale-110 active:scale-95 flex items-center justify-center flex-shrink-0 group/heart',
        hasOwned
          ? 'text-pink-600 dark:text-cyber-pink'
          : isSoldOut
            ? 'text-lavender'
            : 'text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white',
        className
      )}
      title={hasOwned ? 'Collected' : isSoldOut ? 'Sold Out' : 'Collect'}
    >
      {isMinting ? (
        <IconLoader2 size={size} className="animate-spin text-pink-600 dark:text-cyber-pink" />
      ) : hasOwned ? (
        <IconHeart size={size} className="fill-pink-600 dark:fill-cyber-pink text-pink-600 dark:text-cyber-pink" />
      ) : isSoldOut ? (
        <DobaVisualizer size={size} className="text-pink-600 dark:text-cyber-pink" />
      ) : (
        <IconHeart
          size={size}
          className="text-midnight/70 dark:text-white/40 group-hover/heart:text-midnight dark:group-hover/heart:text-white"
        />
      )}
    </button>
  )
}
