'use client'

import React, { useState, useEffect } from 'react'
import AssetsView from '@/components/AssetsView'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { IconCornerDownLeft } from '@tabler/icons-react'

export default function AssetsDashboard() {
  const tNav = useTranslations('nav')

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-start">
        <Link 
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-midnight/55 dark:text-white/45 hover:text-[#FF1F8A] dark:hover:text-[#FF1F8A] transition-colors group select-none"
        >
          <IconCornerDownLeft size={14} className="text-midnight/40 dark:text-white/35 group-hover:text-[#FF1F8A] dark:group-hover:text-[#FF1F8A] transition-colors" />
          <span>{tNav('profile')}</span>
        </Link>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{tNav('assets')}</h2>
      </div>
      <AssetsView />
    </div>
  )
}
