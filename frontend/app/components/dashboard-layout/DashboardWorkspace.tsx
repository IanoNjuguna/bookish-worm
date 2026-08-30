'use client'

import type { ReactNode } from 'react'
import NowPlayingSidebar from '@/components/NowPlayingSidebar'
import DesktopSidebar from '@/components/dashboard/DesktopSidebar'
import type { AudioContextType } from '@/components/audio/AudioPlayer.types'

interface DashboardWorkspaceProps {
  desktopSidebarOpen: boolean
  sidebarTrack: AudioContextType['sidebarTrack']
  isSidebarOpen: boolean
  onCloseSidebar: () => void
  children: ReactNode
}

export function DashboardWorkspace({
  desktopSidebarOpen,
  sidebarTrack,
  isSidebarOpen,
  onCloseSidebar,
  children,
}: DashboardWorkspaceProps) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
      <DesktopSidebar isOpen={desktopSidebarOpen} />

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto outline-none lg:h-full">
        <div className="pt-20 lg:pt-24 px-6 pb-24 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Right Sidebar */}
      <NowPlayingSidebar
        track={sidebarTrack}
        isVisible={isSidebarOpen}
        onClose={onCloseSidebar}
      />
    </div>
  )
}
