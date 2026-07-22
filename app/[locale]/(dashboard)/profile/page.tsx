'use client'

import React, { useState, useEffect } from 'react'
import { ProfileEditor } from '@/components/ProfileEditor'
import { useTranslations } from 'next-intl'
import { useAudio } from '@/components/AudioProvider'
import { Button } from '@/components/ui/button'
import { IconUser as User } from '@tabler/icons-react'
import { useCardano } from '@/components/Providers'

export default function ProfileDashboard() {
  const tProfile = useTranslations('profile')
  const { isAuthenticated, effectiveAddress, login, logout: backendLogout } = useAudio()
  const { disconnect, address: cardanoAddress } = useCardano()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const handleLogout = async () => {
    try {
      backendLogout()
      disconnect()
    } catch (e) {
      console.error('Logout failed', e)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">{tProfile('title')}</h2>
        <p className="text-midnight/60 dark:text-white/60">{tProfile('subtitle')}</p>
      </div>
      {isAuthenticated && effectiveAddress ? (
        <ProfileEditor
          address={cardanoAddress || effectiveAddress}
          tProfile={tProfile}
          logout={handleLogout}
        />
      ) : (
        <div className="p-12 text-center rounded-none bg-midnight/5 dark:bg-white-2 border border-midnight/[0.08] dark:border-white/[0.08] max-w-md mx-auto">
          <User className="w-12 h-12 mx-auto mb-4 text-lavender/40" />
          <h3 className="text-xl font-semibold mb-2">
            {effectiveAddress ? "Verify Ownership" : tProfile('connectWallet')}
          </h3>
          <p className="text-midnight/60 dark:text-white/60 mb-6">
            {effectiveAddress 
              ? "Please sign the authentication request in your wallet to access your profile." 
              : tProfile('signInToView')}
          </p>
          {effectiveAddress ? (
            <Button
              onClick={() => login()}
              className="bg-lavender hover:bg-lavender/90 text-midnight font-bold py-2 px-6 rounded-none transition-all mx-auto block"
            >
              Sign In with Wallet
            </Button>
          ) : (
            <div className="text-sm text-midnight/70 dark:text-white/40">
              Use the "Connect Wallet" button in the header.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
