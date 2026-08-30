'use client'

import type { ReactNode } from 'react'
import { AudioPlayer } from '@/components/audio'
import Header from './dashboard/Header'
import MobileMenu from './dashboard/MobileMenu'
import { useDashboardLayout } from './dashboard-layout/useDashboardLayout'
import { DashboardWorkspace } from './dashboard-layout/DashboardWorkspace'

export default function DashboardLayoutClient({ children }: { children: ReactNode }) {
  const layout = useDashboardLayout()

  if (!layout.mounted) return <div className="min-h-[100dvh]" />

  return (
    <div className="h-[100dvh] text-midnight dark:text-white flex flex-col">
      <Header
        effectiveAddress={layout.effectiveAddress || undefined}
        handleLogout={layout.handleLogout}
        desktopSidebarOpen={layout.desktopSidebarOpen}
        setDesktopSidebarOpen={layout.setDesktopSidebarOpen}
        headerMenuOpen={layout.headerMenuOpen}
        setHeaderMenuOpen={layout.setHeaderMenuOpen}
        isSidebarOpen={layout.isSidebarOpen}
        toggleSidebar={layout.toggleSidebar}
      />

      <MobileMenu
        isOpen={layout.headerMenuOpen}
        onClose={() => layout.setHeaderMenuOpen(false)}
      />

      {/* Main Layout */}
      <div className="flex flex-col flex-1 min-h-0 lg:overflow-hidden">
        {/* Workspace Area: Left Sidebar + Main Content + Right Sidebar */}
        <DashboardWorkspace
          desktopSidebarOpen={layout.desktopSidebarOpen}
          sidebarTrack={layout.sidebarTrack}
          isSidebarOpen={layout.isSidebarOpen}
          onCloseSidebar={layout.toggleSidebar}
        >
          {children}
        </DashboardWorkspace>

        {/* Audio Player Footer */}
        {layout.playerState.currentTrack && (
          <AudioPlayer playerState={layout.playerState} />
        )}
      </div>
    </div>
  )
}
