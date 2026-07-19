'use client'

import React, { useState, useEffect } from 'react'
import AssetsView from '@/components/AssetsView'
import { useTranslations } from 'next-intl'

export default function AssetsDashboard() {
  const tNav = useTranslations('nav')

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{tNav('assets')}</h2>
      </div>
      <AssetsView />
    </div>
  )
}
