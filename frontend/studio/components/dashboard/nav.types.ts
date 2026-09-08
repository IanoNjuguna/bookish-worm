import type { ComponentType } from 'react'
import type { IconProps } from '@tabler/icons-react'

export type AppSection = 'fan' | 'studio' | 'wallet'

export interface NavItem {
  href: string
  icon: ComponentType<IconProps>
  labelKey: string
  id?: string
}

export interface SectionNavConfig {
  primary: NavItem[]
  crossLinks: NavItem[]
}
