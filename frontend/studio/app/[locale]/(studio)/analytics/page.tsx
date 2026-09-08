'use client'

import React, { useState, useEffect } from 'react'
import AnalyticsView from '@/components/AnalyticsView'
import { useTranslations } from 'next-intl'

export default function AnalyticsDashboard() {
  const tAnalytics = useTranslations('analytics')
  
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">{tAnalytics('title')}</h2>
        <p className="text-midnight/60 dark:text-white/60">{tAnalytics('subtitle')}</p>
      </div>
      <AnalyticsView />
    </div>
  )
}
