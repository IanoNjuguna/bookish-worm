'use client'

import React, { useState, useEffect } from 'react'
import DepositView from '@/components/DepositView'
import { useTranslations } from 'next-intl'

export default function DepositDashboard() {
  const tNav = useTranslations('nav')

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-1">{tNav('depositLabel')}</h2>
        <p className="text-midnight/60 dark:text-white/60 text-xs">{tNav('depositDesc')}</p>
      </div>
      <DepositView />
    </div>
  )
}
