'use client'

import React, { useState, useEffect } from 'react'
import DepositView from '@/components/DepositView'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { IconCornerDownLeft } from '@tabler/icons-react'
import PagePanel from '@/components/PagePanel'

export default function DepositDashboard() {
  const tNav = useTranslations('nav')

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div id="deposit-funds-container" className="animate-fade-in">
      <PagePanel className="max-w-md mx-auto space-y-6">
        <div className="flex justify-start">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-midnight/55 dark:text-white/45 hover:text-pink-600 dark:hover:text-cyber-pink transition-colors group select-none"
          >
            <IconCornerDownLeft size={14} className="text-midnight/40 dark:text-white/35 group-hover:text-pink-600 dark:group-hover:text-cyber-pink transition-colors" />
            <span>{tNav('profile')}</span>
          </Link>
        </div>

        <DepositView />
      </PagePanel>
    </div>
  )
}
