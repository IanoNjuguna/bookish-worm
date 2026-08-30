'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { BeforeInstallPromptEvent } from './PWAInstallPrompt.types'
import {
  PWA_AUTO_SHOW_DELAY_MS,
  PWA_DISMISSED_KEY,
  SERVICE_WORKER_PATH,
  TOUR_TRIGGER_EVENT,
} from './PWAInstallPrompt.constants'

export interface UsePWAInstallPromptReturn {
  showBanner: boolean
  isInstalled: boolean
  isIOSPrompt: boolean
  isIOS: boolean
  handleInstall: () => Promise<void>
  handleDismiss: () => void
}

export function usePWAInstallPrompt(): UsePWAInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOSPrompt, setIsIOSPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(SERVICE_WORKER_PATH).catch(() => {})
    }

    // Check if already installed (standalone mode)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    // Detect iOS / iPadOS (any browser — Apple blocks beforeinstallprompt on all of them)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
    const isIOSDevice = ios || isIPadOS
    setIsIOS(isIOSDevice)

    // Capture the native install prompt event immediately — do NOT auto-show
    // The banner is shown either via the onboarding tour trigger or automatically
    // after 4 seconds (only if user hasn't dismissed before)
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Auto-show after delay only if not dismissed before
      const dismissed = localStorage.getItem(PWA_DISMISSED_KEY)
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), PWA_AUTO_SHOW_DELAY_MS)
      }
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS / iPadOS: auto-show manual instructions after delay if not dismissed
    if (isIOSDevice) {
      const dismissed = localStorage.getItem(PWA_DISMISSED_KEY)
      if (!dismissed) {
        const timer = setTimeout(() => setIsIOSPrompt(true), PWA_AUTO_SHOW_DELAY_MS)
        return () => {
          window.removeEventListener('beforeinstallprompt', handler)
          clearTimeout(timer)
        }
      }
    }

    // Listen for manual trigger from onboarding tour — always show, even if dismissed before
    const onTourTrigger = () => {
      localStorage.removeItem(PWA_DISMISSED_KEY) // Reset dismiss so user can re-install
      if (isIOSDevice) {
        setIsIOSPrompt(true)
      } else {
        setShowBanner(true)
      }
    }
    window.addEventListener(TOUR_TRIGGER_EVENT, onTourTrigger)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener(TOUR_TRIGGER_EVENT, onTourTrigger)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback if the programmatic prompt isn't available
      toast('To install, click the Install icon in your URL bar, or Add to Home Screen in your browser menu.', {
        duration: 5000,
      })
      setShowBanner(false)
      return
    }
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    setShowBanner(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setIsIOSPrompt(false)
    localStorage.setItem(PWA_DISMISSED_KEY, 'true')
  }

  return {
    showBanner,
    isInstalled,
    isIOSPrompt,
    isIOS,
    handleInstall,
    handleDismiss,
  }
}
