import {
  IconHome,
  IconPlaylistAdd,
  IconSearch,
  IconUser,
  IconWallet,
  IconMusic,
} from '@tabler/icons-react'
import type { AppSection, NavItem, SectionNavConfig } from './nav.types'

const home: NavItem = { href: '/', icon: IconHome, labelKey: 'home', id: 'side-nav-home' }
const library: NavItem = { href: '/library', icon: IconPlaylistAdd, labelKey: 'library', id: 'side-nav-library' }
const search: NavItem = { href: '/search', icon: IconSearch, labelKey: 'search' }
const profile: NavItem = { href: '/profile', icon: IconUser, labelKey: 'profile' }
const creator: NavItem = { href: 'https://studio.doba.world', icon: IconMusic, labelKey: 'creator' }
const wallet: NavItem = { href: '/wallet', icon: IconWallet, labelKey: 'wallet' }

export const SECTION_NAV_CONFIG: Record<AppSection, SectionNavConfig> = {
  fan: {
    primary: [home, library, search, profile],
    crossLinks: [creator, wallet],
  },
  wallet: {
    primary: [home, library, search, profile],
    crossLinks: [creator, wallet],
  },
}

// Re-export AppSection for convenience
export type { AppSection } from './nav.types'
