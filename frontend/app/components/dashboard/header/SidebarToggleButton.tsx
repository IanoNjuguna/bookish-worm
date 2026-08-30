'use client'

import { IconMenu, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface SidebarToggleButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export function SidebarToggleButton({ isOpen, onToggle }: SidebarToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="hidden lg:flex items-center justify-center p-1.5 transition-colors text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white group relative shrink-0"
      title={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <IconMenu
          size={20}
          className={cn(
            "absolute transition-all duration-300 transform",
            isOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
          )}
        />
        <IconX
          size={20}
          className={cn(
            "absolute transition-all duration-300 transform",
            isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
          )}
        />
      </div>
    </button>
  )
}
