'use client'

import { useEffect, useState } from 'react'
import { IconDownload, IconX, IconShare2 } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOSPrompt, setIsIOSPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
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
      const dismissed = localStorage.getItem('doba_pwa_dismissed')
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 4000)
      }
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS / iPadOS: auto-show manual instructions after delay if not dismissed
    if (isIOSDevice) {
      const dismissed = localStorage.getItem('doba_pwa_dismissed')
      if (!dismissed) {
        const timer = setTimeout(() => setIsIOSPrompt(true), 4000)
        return () => {
          window.removeEventListener('beforeinstallprompt', handler)
          clearTimeout(timer)
        }
      }
    }

    // Listen for manual trigger from onboarding tour — always show, even if dismissed before
    const onTourTrigger = () => {
      localStorage.removeItem('doba_pwa_dismissed') // Reset dismiss so user can re-install
      if (isIOSDevice) {
        setIsIOSPrompt(true)
      } else {
        setShowBanner(true)
      }
    }
    window.addEventListener('doba-trigger-install', onTourTrigger)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('doba-trigger-install', onTourTrigger)
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
    localStorage.setItem('doba_pwa_dismissed', 'true')
  }

  if (isInstalled || (!showBanner && !isIOSPrompt)) return null

  const isIOSView = isIOSPrompt

  return (
    <div className={cn(
      "fixed bottom-24 left-4 right-4 z-[60] sm:left-auto sm:right-6 sm:w-[360px]",
      "animate-in slide-in-from-bottom-4 duration-500"
    )}>
      <div className="glass-surface bg-background/80 dark:bg-midnight/80 rounded-2xl p-4 shadow-xl border border-midnight/[0.08] dark:border-white/[0.08] relative overflow-hidden">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-midnight/5 dark:bg-white/5 text-midnight/40 dark:text-white/40 hover:text-midnight dark:hover:text-white hover:bg-midnight/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <IconX size={16} />
        </button>

        <div className="flex items-center gap-3 mb-3 pr-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-72x72.png" alt="Doba" className="w-10 h-10 rounded-xl border border-midnight/10 dark:border-white/10" />
          <div>
            <p className="text-sm font-bold text-midnight dark:text-white">Install Doba</p>
            <p className="text-[10px] uppercase tracking-wider text-midnight/50 dark:text-white/40 font-medium">Free · No App Store required</p>
          </div>
        </div>

        <p className="text-xs text-midnight/70 dark:text-white/60 leading-relaxed mb-4">
          {isIOSView ? (
            <>
              Tap the{' '}
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-midnight/10 dark:border-white/10 bg-midnight/5 dark:bg-white/5 text-midnight dark:text-white font-semibold">
                <IconShare2 size={10} />
                Share
              </span>{' '}
              button in your browser’s toolbar, then select{' '}
              <span className="font-semibold text-midnight dark:text-white">Add to Home Screen</span>{' '}
              to install Doba as an app.
            </>
          ) : (
            <>
              Add Doba to your home screen for instant access to your music collection and lock screen controls.
            </>
          )}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleDismiss}
            className="text-xs font-semibold text-midnight/50 dark:text-white/40 hover:text-midnight dark:hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-midnight/5 dark:hover:bg-white/5"
          >
            Not now
          </button>
          {!isIOSView && (
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-lavender hover:bg-lavender/90 text-midnight px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              <IconDownload size={14} />
              Install
            </button>
          )}
          {isIOSView && (
            <button
              onClick={handleDismiss}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-lavender hover:bg-lavender/90 text-midnight px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
