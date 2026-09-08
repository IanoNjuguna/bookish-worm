'use client'

import { usePWAInstallPrompt } from './pwa-install-prompt/usePWAInstallPrompt'
import { InstallBanner } from './pwa-install-prompt/InstallBanner'

export function PWAInstallPrompt() {
  const { showBanner, isInstalled, isIOSPrompt, handleInstall, handleDismiss } = usePWAInstallPrompt()

  if (isInstalled || (!showBanner && !isIOSPrompt)) return null

  const isIOSView = isIOSPrompt

  return (
    <InstallBanner
      isIOSView={isIOSView}
      onInstall={handleInstall}
      onDismiss={handleDismiss}
    />
  )
}
