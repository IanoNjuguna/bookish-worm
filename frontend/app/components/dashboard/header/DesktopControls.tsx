'use client'

import ConnectHeader from '@/components/ConnectHeader'
import { SidebarToggleButton } from './SidebarToggleButton'
import { HowItWorks } from './HowItWorks'

interface DesktopControlsProps {
  effectiveAddress?: string
  handleLogout: () => void
  desktopSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function DesktopControls({
  effectiveAddress,
  handleLogout,
  desktopSidebarOpen,
  onToggleSidebar,
}: DesktopControlsProps) {
  return (
    <div className="hidden lg:flex items-center gap-3">
      <HowItWorks />
      <ConnectHeader
        address={effectiveAddress || undefined}
        logout={handleLogout}
        onNavigate={(_view) => {
          // Handled differently now
        }}
      />
      <SidebarToggleButton isOpen={desktopSidebarOpen} onToggle={onToggleSidebar} />
    </div>
  )
}
