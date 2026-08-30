'use client'

import ConnectHeader from '@/components/ConnectHeader'

interface MobileControlsProps {
  effectiveAddress?: string
  handleLogout: () => void
  headerMenuOpen: boolean
  onMenuClick: () => void
}

export function MobileControls({
  effectiveAddress,
  handleLogout,
  headerMenuOpen,
  onMenuClick,
}: MobileControlsProps) {
  return (
    <div className="lg:hidden flex items-center gap-2">
      <ConnectHeader
        address={effectiveAddress || undefined}
        logout={handleLogout}
        onMenuClick={onMenuClick}
        isMenuOpen={headerMenuOpen}
      />
    </div>
  )
}
