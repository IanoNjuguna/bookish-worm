'use client'

import { useEffect, useState } from 'react'
import { IconCookie } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export type CookieConsent = 'essential' | 'analytics' | null

const STORAGE_KEY = 'doba_cookie_consent'

export function getCookieConsent(): CookieConsent {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(STORAGE_KEY)
  if (value === 'essential' || value === 'analytics') return value
  return null
}

export function setCookieConsent(consent: CookieConsent) {
  if (typeof window === 'undefined') return
  if (consent === null) {
    window.localStorage.removeItem(STORAGE_KEY)
  } else {
    window.localStorage.setItem(STORAGE_KEY, consent)
  }
}

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<CookieConsent>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setConsent(getCookieConsent())
  }, [])

  const handleAccept = (value: CookieConsent) => {
    setCookieConsent(value)
    setConsent(value)
  }

  if (!mounted || consent !== null) return null

  return (
    <div className={cn(
      "fixed bottom-4 left-4 right-4 z-[60] sm:left-auto sm:right-6 sm:w-[420px]",
      "animate-in slide-in-from-bottom-4 duration-500"
    )}>
      <div className="glass-surface bg-background/90 dark:bg-midnight/90 rounded-2xl p-4 shadow-xl border border-midnight/[0.08] dark:border-white/[0.08] relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-lavender/10 text-lavender rounded-xl shrink-0">
            <IconCookie size={20} />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <p className="text-sm font-bold text-midnight dark:text-white">We value your privacy</p>
              <p className="text-xs text-midnight/60 dark:text-white/40 leading-relaxed mt-1">
                We use cookies to keep you signed in. With your consent, we also use anonymous analytics to improve Doba.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => handleAccept('essential')}
                className="text-xs font-semibold text-midnight/50 dark:text-white/40 hover:text-midnight dark:hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-midnight/5 dark:hover:bg-white/5"
              >
                Essential only
              </button>
              <button
                onClick={() => handleAccept('analytics')}
                className="text-xs font-bold uppercase tracking-wider bg-lavender hover:bg-lavender/90 text-midnight px-4 py-2 rounded-xl transition-all active:scale-95"
              >
                Allow analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
