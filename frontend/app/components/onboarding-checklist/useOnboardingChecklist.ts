'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCardano } from '@/components/Providers'
import { useAudio } from '@/components/audio'
import { logOnboardingEvent, markCollected, COLLECT_KEY, COLLECT_EVENT } from '@/lib/onboarding'
import { DISMISS_KEY, SEEN_KEY, CONNECT_WALLET_BUTTON_ID } from './OnboardingChecklist.constants'
import type { OnboardingStep, UseOnboardingChecklistResult } from './OnboardingChecklist.types'

export function useOnboardingChecklist(): UseOnboardingChecklistResult {
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
        if (Array.isArray(tracks) && tracks.some((t: any) => t.is_minted)) {
          setHasCollected(true)
          markCollected()
        }
      } catch {
        // Silent — the checklist is non-critical
      }
    }
    check()
  }, [isAuthenticated, hasCollected])

  const steps: OnboardingStep[] = [
    { key: 'connect', label: t('stepConnect'), done: isConnected },
    { key: 'verify', label: t('stepVerify'), done: isConnected && isAuthenticated },
    { key: 'collect', label: t('stepCollect'), done: isConnected && isAuthenticated && hasCollected },
  ]
  const doneCount = steps.filter((s) => s.done).length

  const visible = mounted && !dismissed && doneCount !== steps.length

  const dismiss = () => {
    if (!hasCollected) return
    localStorage.setItem(DISMISS_KEY, 'true')
    logOnboardingEvent('checklist_dismissed')
    setUserDismissed(true)
  }

  const triggerConnect = () => {
    document.getElementById(CONNECT_WALLET_BUTTON_ID)?.click()
  }

  return {
    visible,
    hasCollected,
    steps,
    doneCount,
    title: t('title'),
    dismissLabel: t('dismiss'),
    dismiss,
    triggerConnect,
  }
}
