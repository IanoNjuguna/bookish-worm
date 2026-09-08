'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { MobileNavLink } from './NavLinks'
import { SidebarFooter } from './SidebarFooter'
import { useAppSection } from './useAppSection'
import { useArtistMode } from './useArtistMode'
import { SECTION_NAV_CONFIG } from './nav.constants'
import type { NavItem } from './nav.types'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const mobileIconClass = "text-pink-600 dark:text-cyber-pink flex-shrink-0"

function filterCrossLinks(items: NavItem[], artistMode: boolean): NavItem[] {
  return items.filter((item) => !item.href.startsWith('https://studio.doba.world') || artistMode)
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const tNav = useTranslations('nav')
  const section = useAppSection()
  const artistMode = useArtistMode()
  const { primary, crossLinks } = SECTION_NAV_CONFIG[section]
  const visibleCrossLinks = filterCrossLinks(crossLinks, artistMode)

  if (!isOpen) return null

  return (
    <div className="lg:hidden fixed inset-x-3 top-20 bottom-3 z-[60] animate-slide-in-down glass-surface bg-background/95 dark:bg-midnight/80 rounded-2xl shadow-xl overflow-hidden">
      <nav className="flex flex-col p-4 pb-32 h-full overflow-y-auto">
        <div className="space-y-1">
          {primary.map((item) => (
            <MobileNavLink
              key={item.href}
              href={item.href}
              icon={<item.icon size={18} className={mobileIconClass} />}
              label={tNav(item.labelKey)}
              setMenuOpen={onClose}
            />
          ))}

          {visibleCrossLinks.map((item) => (
            <MobileNavLink
              key={item.href}
              href={item.href}
              icon={<item.icon size={18} className={mobileIconClass} />}
              label={tNav(item.labelKey)}
              setMenuOpen={onClose}
            />
          ))}
        </div>

        <SidebarFooter variant="mobile" />
      </nav>
    </div>
  )
}
