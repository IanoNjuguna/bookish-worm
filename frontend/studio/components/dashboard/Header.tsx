'use client'

import { cn } from '@/lib/utils'
import { useDashboardHeader } from './header/useDashboardHeader'
import { HeaderLogo } from './header/HeaderLogo'
import { DesktopControls } from './header/DesktopControls'
import { MobileControls } from './header/MobileControls'
import type { HeaderProps } from './header/Header.types'

export default function Header({
  effectiveAddress,
  handleLogout,
  desktopSidebarOpen,
  setDesktopSidebarOpen,
  headerMenuOpen,
  setHeaderMenuOpen,
  isSidebarOpen,
  toggleSidebar,
}: HeaderProps) {
  const {
    handleLogoClick,
    handleToggleDesktopSidebar,
    handleMobileMenuClick,
  } = useDashboardHeader({
    setHeaderMenuOpen,
    setDesktopSidebarOpen,
    headerMenuOpen,
    isSidebarOpen,
    toggleSidebar,
  })

  return (
    <header
      className={cn(
        "fixed top-3 left-3 right-3 lg:top-4 lg:left-6 lg:right-6 z-50 h-16 rounded-2xl transition-colors duration-200",
        "glass-surface bg-midnight/[0.02] dark:bg-white/[0.02] backdrop-blur-2xl shadow-lg"
      )}
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <HeaderLogo onClick={handleLogoClick} />

        <DesktopControls
          effectiveAddress={effectiveAddress}
          handleLogout={handleLogout}
          desktopSidebarOpen={desktopSidebarOpen}
          onToggleSidebar={handleToggleDesktopSidebar}
        />

        <MobileControls
          effectiveAddress={effectiveAddress}
          handleLogout={handleLogout}
          headerMenuOpen={headerMenuOpen}
          onMenuClick={handleMobileMenuClick}
        />
      </div>
    </header>
  )
}
