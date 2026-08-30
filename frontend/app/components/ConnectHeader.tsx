'use client'

import React from 'react'
import { AuthModal } from '@/components/AuthModal'
import { useConnectHeader } from './connect-header/useConnectHeader'
import { SignInMenu } from './connect-header/SignInMenu'
import { MobileMenuButton } from './connect-header/MobileMenuButton'
import { ConnectHeaderDialogs } from './connect-header/ConnectHeaderDialogs'
import type { ConnectHeaderProps } from './connect-header/ConnectHeader.types'

export default function ConnectHeader({ address: propAddress, logout, onNavigate, onMenuClick, isMenuOpen, onToggleSidebar, isSidebarOpen }: ConnectHeaderProps) {
  const header = useConnectHeader(propAddress)

  return (
    <div className="flex items-center gap-3 relative">
      {!header.isConnected ? (
        <SignInMenu
          isConnecting={header.isConnecting}
          signInLabel={header.signInLabel}
          availableWallets={header.availableWallets}
          onConnectSocial={header.connectSocial}
          onConnect={header.connect}
          onCreateWallet={header.handleCreateWallet}
          onImportSeed={() => header.setIsSeedModalOpen(true)}
        />
      ) : (
        <>
          <AuthModal
            isOpen={header.isAuthModalOpen}
            onClose={() => header.setIsAuthModalOpen(false)}
          />
          {/* Desktop version - Wallet badge removed */}

          {/* Mobile version - Full Menu Trigger */}
          <MobileMenuButton address={header.address} isMenuOpen={isMenuOpen} onMenuClick={onMenuClick} />
        </>
      )}

      <ConnectHeaderDialogs header={header} />
    </div>
  )
}
