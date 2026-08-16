'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { IconX, IconSquareCheckFilled, IconCircle } from '@tabler/icons-react'
import { Link } from '@/i18n/navigation'
import { useCardano } from '@/components/Providers'
import { useAudio } from '@/components/AudioProvider'
import { logOnboardingEvent, markCollected, COLLECT_KEY, COLLECT_EVENT } from '@/lib/onboarding'
import { cn } from '@/lib/utils'

const DISMISS_KEY = 'doba_onboarding_dismissed'
const SEEN_KEY = 'doba_onboarding_seen'

export default function OnboardingChecklist() {
  const t = useTranslations('onboarding')
  const { isConnected } = useCardano()
  const { isAuthenticated } = useAudio()
  const [mounted, setMounted] = useState(false)
  const [userDismissed, setUserDismissed] = useState(false)
  const [hasCollected, setHasCollected] = useState(false)

  // Persist until the user collects a track: ignore previous dismiss state until then.
  const dismissed = userDismissed && hasCollected

  // Mount: read persisted state, log first view, subscribe to instant collect signal
  useEffect(() => {
    setMounted(true)
    const isDismissed = localStorage.getItem(DISMISS_KEY) === 'true'
    setUserDismissed(isDismissed)
    if (!isDismissed && !localStorage.getItem(SEEN_KEY)) {
      localStorage.setItem(SEEN_KEY, 'true')
      logOnboardingEvent('checklist_seen')
    }
    if (localStorage.getItem(COLLECT_KEY) === 'true') setHasCollected(true)

    const onCollected = () => setHasCollected(true)
    window.addEventListener(COLLECT_EVENT, onCollected)
    return () => window.removeEventListener(COLLECT_EVENT, onCollected)
  }, [])

  // Log the activation moment: wallet transitions to connected
  const prevConnected = useRef<boolean | null>(null)
  useEffect(() => {
    if (prevConnected.current === false && isConnected) {
      logOnboardingEvent('wallet_connected')
    }
    prevConnected.current = isConnected
  }, [isConnected])

  // Detect prior collects from ownership data (once authenticated)
  useEffect(() => {
    if (!isAuthenticated || hasCollected) return
    const check = async () => {
      try {
        const authData = localStorage.getItem('doba_auth_data')
        const token = authData ? JSON.parse(authData)?.accessToken : null
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch('/api-backend/songs?limit=200', { headers })
        if (!res.ok) return
        const tracks = await res.json()
        if (Array.isArray(tracks) && tracks.some((t: any) => t.is_owned)) {
          setHasCollected(true)
          markCollected()
        }
      } catch {
        // Silent — the checklist is non-critical
      }
    }
    check()
  }, [isAuthenticated, hasCollected])

  const steps = [
    { key: 'connect', label: t('stepConnect'), done: isConnected },
    { key: 'verify', label: t('stepVerify'), done: isConnected && isAuthenticated },
    { key: 'collect', label: t('stepCollect'), done: isConnected && isAuthenticated && hasCollected },
  ]
  const doneCount = steps.filter((s) => s.done).length

  if (!mounted || dismissed || doneCount === steps.length) return null

  const dismiss = () => {
    if (!hasCollected) return
    localStorage.setItem(DISMISS_KEY, 'true')
    logOnboardingEvent('checklist_dismissed')
    setUserDismissed(true)
  }

  const triggerConnect = () => {
    document.getElementById('connect-wallet-btn')?.click()
  }

  return (
    <div className="glass-surface bg-background/90 dark:bg-midnight/60 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-600 dark:text-lavender">
          {t('title')} · {doneCount}/{steps.length}
        </p>
        {hasCollected && (
          <button
            onClick={dismiss}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-midnight/5 dark:bg-white/5 text-midnight/50 dark:text-white/40 hover:text-midnight dark:hover:text-white hover:bg-midnight/10 dark:hover:bg-white/10 transition-colors"
            title={t('dismiss')}
            aria-label={t('dismiss')}
          >
            <IconX size={12} />
          </button>
        )}
      </div>

      {/* Progress hairline */}
      <div className="h-[2px] w-full rounded-full bg-midnight/5 dark:bg-white/5 overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-pink-600 dark:bg-cyber-pink transition-all duration-500"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>

      <div className="space-y-1.5">
        {steps.map((step) => {
          const row = (
            <>
              {step.done ? (
                <IconSquareCheckFilled size={16} className="text-emerald-500 shrink-0" />
              ) : (
                <IconCircle size={16} className="text-midnight/70 dark:text-white/50 shrink-0" />
              )}
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  step.done
                    ? 'text-midnight/60 dark:text-white/50 line-through'
                    : 'text-midnight/80 dark:text-white/80 group-hover:text-midnight dark:group-hover:text-white'
                )}
              >
                {step.label}
              </span>
            </>
          )

          const rowClass = 'group flex items-center gap-2.5 w-full text-left rounded-lg px-2 py-1.5 hover:bg-midnight/[0.03] dark:hover:bg-white/[0.03] transition-colors'

          if (step.done) return <div key={step.key} className={rowClass}>{row}</div>
          if (step.key === 'collect') {
            return (
              <Link key={step.key} href="/" className={rowClass}>
                {row}
              </Link>
            )
          }
          return (
            <button key={step.key} onClick={triggerConnect} className={rowClass}>
              {row}
            </button>
          )
        })}
      </div>
    </div>
  )
}
