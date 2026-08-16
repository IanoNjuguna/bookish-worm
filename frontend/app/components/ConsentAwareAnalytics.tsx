'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { getCookieConsent } from '@/components/CookieConsent'

export function ConsentAwareAnalytics() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)

  useEffect(() => {
    const check = () => setAnalyticsAllowed(getCookieConsent() === 'analytics')
    check()
    window.addEventListener('doba-consent-change', check)
    return () => window.removeEventListener('doba-consent-change', check)
  }, [])

  if (!analyticsAllowed) return null

  return <Analytics />
}
