'use client'

import React from 'react'
import {
  IconHome as HomeIcon,
  IconPlaylistAdd as Library,
  IconSearch as Search,
  IconUser as User,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { MobileNavLink } from './NavLinks'
import { SidebarFooter } from './SidebarFooter'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const tNav = useTranslations('nav')

  if (!isOpen) return null

  return (
    <div className="lg:hidden fixed inset-x-3 top-20 bottom-3 z-[60] animate-slide-in-down glass-surface bg-background/95 dark:bg-midnight/80 rounded-2xl shadow-xl overflow-hidden">
      <nav className="flex flex-col p-4 pb-32 h-full overflow-y-auto">
        <div className="space-y-1">
          <MobileNavLink href="/" icon={<HomeIcon size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('home')} setMenuOpen={onClose} />
          <MobileNavLink href="/library" icon={<Library size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('library')} setMenuOpen={onClose} />
          <MobileNavLink href="/search" icon={<Search size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('search')} setMenuOpen={onClose} />
          <MobileNavLink href="/profile" icon={<User size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('profile')} setMenuOpen={onClose} />
        </div>

        <SidebarFooter variant="mobile" />
      </nav>
    </div>
  )
}
