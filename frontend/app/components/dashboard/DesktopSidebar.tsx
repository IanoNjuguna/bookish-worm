'use client'

import React from 'react'
import {
  IconHome as HomeIcon,
  IconPlaylistAdd as Library,
  IconSearch as Search,
  IconUser as User,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { SidebarNavLink } from './NavLinks'
import { SidebarFooter } from './SidebarFooter'

interface DesktopSidebarProps {
  isOpen: boolean
}

export default function DesktopSidebar({ isOpen }: DesktopSidebarProps) {
  const tNav = useTranslations('nav')

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col overflow-hidden relative transition-all duration-300 ease-in-out shrink-0 self-start glass-surface bg-background/80 dark:bg-midnight/60 rounded-2xl shadow-xl min-h-0",
        isOpen
          ? "w-60 opacity-100 translate-x-0 mt-20 lg:mt-24 mr-0 mb-28 ml-4"
          : "w-0 opacity-0 -translate-x-4 pointer-events-none m-0"
      )}
    >
      {/* Feathered vertical edge rule */}
      <div className="absolute right-0 top-4 bottom-4 w-[1px] rounded-full bg-gradient-to-b from-transparent via-midnight/[0.08] dark:via-white/[0.08] to-transparent" />
      <nav className="flex flex-col p-3 overflow-y-auto no-scrollbar relative w-60 min-h-0">
        <div className="flex flex-col space-y-0.5">
          <SidebarNavLink href="/" icon={<HomeIcon size={16} />} label={tNav('home')} />
          <div id="side-nav-library">
            <SidebarNavLink href="/library" icon={<Library size={16} />} label={tNav('library')} />
          </div>
          <SidebarNavLink href="/search" icon={<Search size={16} />} label={tNav('search')} />
          <SidebarNavLink href="/profile" icon={<User size={16} />} label={tNav('profile')} />
        </div>

        <SidebarFooter variant="desktop" />
      </nav>
    </aside>
  )
}
