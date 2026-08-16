'use client'

import React, { useState, useEffect } from 'react'
import { SendFunds } from '@/components/SendFunds'
import { useTranslations } from 'next-intl'
import { useAudio } from '@/components/AudioProvider'
import { IconCurrencyDollar as DollarSign, IconCornerDownLeft } from '@tabler/icons-react'
import { Link } from '@/i18n/navigation'
import PagePanel from '@/components/PagePanel'

export default function SendMoneyDashboard() {
  const tNav = useTranslations('nav')
  const tProfile = useTranslations('profile')
  const { isConnected: isPlayerConnected } = useAudio()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div id="send-funds-container" className="animate-fade-in">
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

        {isPlayerConnected ? (
          <SendFunds />
        ) : (
          <div className="p-12 text-center">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-lavender/40" />
            <h3 className="text-xl font-semibold mb-2">
              {tNav('connectWallet')}
            </h3>
            <p className="text-midnight/60 dark:text-white/60">
              {tProfile('signInToView')}
            </p>
          </div>
        )}
      </PagePanel>
    </div>
  )
}
