import type { Dispatch, SetStateAction } from 'react'

export interface HeaderProps {
  effectiveAddress?: string
  handleLogout: () => void
  desktopSidebarOpen: boolean
  setDesktopSidebarOpen: Dispatch<SetStateAction<boolean>>
  headerMenuOpen: boolean
  setHeaderMenuOpen: (open: boolean) => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
}
