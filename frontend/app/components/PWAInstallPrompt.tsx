'use client'

import { useEffect, useState } from 'react'
import { IconDownload, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

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

    // Detect iOS Safari (doesn't support beforeinstallprompt)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const safari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)
    setIsIOS(ios && safari)

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

    // iOS: auto-show after delay if not dismissed
    if (ios && safari) {
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
      if (ios && safari) {
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
    if (!deferredPrompt) return
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

  // iOS specific: explain share → "Add to Home Screen"
  if (isIOSPrompt) {
    return (
      <div className={cn(
        "fixed bottom-24 left-4 right-4 z-[9999] sm:left-auto sm:right-6 sm:w-[340px]",
        "animate-in slide-in-from-bottom-4 duration-500"
      )}>
        <div className="rounded-none border-2 border-double border-[#B794F4] bg-[#0D0D12] p-4 shadow-2xl shadow-[#B794F4]/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(rgba(183,148,244,1)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />

          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors outline-none"
            aria-label="Dismiss"
          >
            <IconX size={14} />
          </button>

          <div className="flex items-center gap-3 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-72x72.png" alt="Doba" className="w-10 h-10 rounded-xl border border-[#B794F4]/30" />
            <div>
              <p className="font-chivo font-black text-[12px] uppercase tracking-widest text-white">Install Doba</p>
              <p className="font-mono text-[9px] text-[#B794F4] uppercase tracking-wider">Free · No App Store required</p>
            </div>
          </div>

          <p className="font-mono text-[10px] text-white/70 leading-relaxed mb-3">
            Tap the{' '}
            <span className="inline-block px-1.5 py-0.5 border border-[#B794F4]/40 text-[#B794F4] font-bold">
              Share ⎋
            </span>{' '}
            button in Safari, then select{' '}
            <span className="text-white font-bold">&quot;Add to Home Screen&quot;</span>{' '}
            to install Doba as an app.
          </p>

          <div className="flex justify-end">
            <button
              onClick={handleDismiss}
              className="font-mono text-[9px] uppercase tracking-wider text-white/40 hover:text-white/60 transition-colors outline-none"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Android / Desktop Chrome banner
  return (
    <div className={cn(
      "fixed bottom-24 left-4 right-4 z-[9999] sm:left-auto sm:right-6 sm:w-[340px]",
      "animate-in slide-in-from-bottom-4 duration-500"
    )}>
      <div className="rounded-none border-2 border-double border-[#B794F4] bg-[#0D0D12] p-4 shadow-2xl shadow-[#B794F4]/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(rgba(183,148,244,1)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors outline-none"
          aria-label="Dismiss"
        >
          <IconX size={14} />
        </button>

        <div className="flex items-center gap-3 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-72x72.png" alt="Doba" className="w-10 h-10 rounded-xl border border-[#B794F4]/30" />
          <div>
            <p className="font-chivo font-black text-[12px] uppercase tracking-widest text-white">Install Doba</p>
            <p className="font-mono text-[9px] text-[#B794F4] uppercase tracking-wider">Free · No App Store required</p>
          </div>
        </div>

        <p className="font-mono text-[10px] text-white/70 leading-relaxed mb-4">
          Add Doba to your home screen for instant access to your music collection and lock screen controls.
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={handleDismiss}
            className="font-mono text-[9px] uppercase tracking-wider text-white/40 hover:text-white/60 transition-colors outline-none"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 font-chivo font-black text-[10px] uppercase tracking-widest bg-[#B57EDC] hover:bg-[#A36CCB] text-[#0D0D12] px-4 py-2 rounded-none shadow-[2px_2px_0px_#B794F4] active:shadow-[1px_1px_0px_#B794F4] active:translate-y-[1px] transition-all outline-none"
          >
            <IconDownload size={13} />
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
