'use client'

import { IconX } from '@tabler/icons-react'

interface SidebarCloseButtonProps {
  onClose: () => void
}

export function SidebarCloseButton({ onClose }: SidebarCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className="absolute top-3 right-3 z-10 w-12 h-12 flex items-center justify-center rounded-xl bg-midnight/70 dark:bg-white/70 text-white dark:text-midnight shadow-lg hover:bg-midnight dark:hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
      title="Close"
      aria-label="Close now playing panel"
    >
      <IconX size={18} />
    </button>
  )
}
