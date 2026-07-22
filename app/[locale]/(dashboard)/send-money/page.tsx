'use client'

import React, { useState, useEffect } from 'react'
import { SendFunds } from '@/components/SendFunds'
import { useTranslations } from 'next-intl'
import { useAudio } from '@/components/AudioProvider'
import { IconCurrencyDollar as DollarSign } from '@tabler/icons-react'

export default function SendMoneyDashboard() {
  const tNav = useTranslations('nav')
  const tProfile = useTranslations('profile')
  const { isConnected: isPlayerConnected } = useAudio()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6 animate-fade-in">
      {isPlayerConnected ? (
        <SendFunds />
      ) : (
        <div className="p-12 text-center rounded-xl bg-midnight/5 dark:bg-white-2 border border-midnight/[0.08] dark:border-white/[0.08]">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-lavender/40" />
          <h3 className="text-xl font-semibold mb-2">
            {tNav('connectWallet')}
          </h3>
          <p className="text-midnight/60 dark:text-white/60">
            {tProfile('signInToView')}
          </p>
        </div>
      )}
    </div>
  )
}
