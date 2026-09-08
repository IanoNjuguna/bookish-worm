import {
  IconHome,
  IconUser,
  IconWallet,
  IconMusic,
  IconChartBar,
  IconCurrencyDollar,
  IconFile,
} from '@tabler/icons-react'
import type { AppSection, NavItem, SectionNavConfig } from './nav.types'

const dashboard: NavItem = { href: '/', icon: IconHome, labelKey: 'home', id: 'side-nav-home' }
const upload: NavItem = { href: '/upload', icon: IconMusic, labelKey: 'upload' }
const drafts: NavItem = { href: '/drafts', icon: IconFile, labelKey: 'drafts' }
const analytics: NavItem = { href: '/analytics', icon: IconChartBar, labelKey: 'analytics' }
const earnings: NavItem = { href: '/earnings', icon: IconCurrencyDollar, labelKey: 'earnings' }
const profile: NavItem = { href: '/profile', icon: IconUser, labelKey: 'profile' }
const wallet: NavItem = { href: '/wallet', icon: IconWallet, labelKey: 'wallet' }

export const SECTION_NAV_CONFIG: Record<AppSection, SectionNavConfig> = {
  fan: {
    primary: [dashboard, upload, drafts, analytics, earnings],
    crossLinks: [profile, wallet],
  },
  studio: {
    primary: [dashboard, upload, drafts, analytics, earnings],
    crossLinks: [profile, wallet],
  },
  wallet: {
    primary: [dashboard, upload, drafts, analytics, earnings],
    crossLinks: [profile, wallet],
  },
}

// Re-export AppSection for convenience
export type { AppSection } from './nav.types'
