'use client'

import type { Dispatch, SetStateAction } from 'react'

export interface UseDashboardHeaderArgs {
  setHeaderMenuOpen: (open: boolean) => void
  setDesktopSidebarOpen: Dispatch<SetStateAction<boolean>>
  headerMenuOpen: boolean
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export interface UseDashboardHeaderReturn {
  handleLogoClick: () => void
  handleToggleDesktopSidebar: () => void
  handleMobileMenuClick: () => void
}

export function useDashboardHeader({
  setHeaderMenuOpen,
  setDesktopSidebarOpen,
  headerMenuOpen,
  isSidebarOpen,
  toggleSidebar,
}: UseDashboardHeaderArgs): UseDashboardHeaderReturn {
  const handleLogoClick = () => setHeaderMenuOpen(false)

  const handleToggleDesktopSidebar = () => setDesktopSidebarOpen(prev => !prev)

  const handleMobileMenuClick = () => {
    const opening = !headerMenuOpen
    setHeaderMenuOpen(opening)
    if (opening && isSidebarOpen) toggleSidebar()
  }

  return {
    handleLogoClick,
    handleToggleDesktopSidebar,
    handleMobileMenuClick,
  }
}
