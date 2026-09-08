'use client'

import { IconMenu, IconX } from '@tabler/icons-react'

interface MobileMenuButtonProps {
  address: string | undefined
  isMenuOpen?: boolean
  onMenuClick?: () => void
}

export function MobileMenuButton({ address, isMenuOpen, onMenuClick }: MobileMenuButtonProps) {
  return (
    <div className="lg:hidden">
      <button
        onClick={onMenuClick}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-midnight/10 dark:border-white/10 shrink-0 rounded-md bg-midnight/5 dark:bg-white/5 hover:border-cyber-pink/50 transition-colors group"
      >
        <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} alt="User Menu" className="w-7 h-7 object-cover opacity-80 rounded-md group-hover:opacity-100 transition-opacity" />
        <div className="relative w-5 h-5 flex items-center justify-center">
          <IconMenu
            size={20}
            className={`absolute text-midnight/70 dark:text-white/70 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
          />
          <IconX
            size={20}
            className={`absolute text-midnight/70 dark:text-white/70 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
          />
        </div>
      </button>
    </div>
  )
}
