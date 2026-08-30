export interface ConnectHeaderProps {
  address?: string
  logout?: () => void
  onNavigate?: (view: string) => void
  onMenuClick?: () => void
  isMenuOpen?: boolean
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export interface CardanoWalletInfo {
  id: string
  name: string
  icon: string
}

export interface WalletUtxo {
  assets?: { lovelace?: bigint }
}

export type SocialProvider = 'google' | 'discord' | 'twitter'
