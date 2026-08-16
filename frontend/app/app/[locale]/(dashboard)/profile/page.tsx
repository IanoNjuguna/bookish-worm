'use client'

import React, { useState, useEffect } from 'react'
import { ProfileEditor } from '@/components/ProfileEditor'
import { useTranslations } from 'next-intl'
import { useAudio } from '@/components/AudioProvider'
import { Button } from '@/components/ui/button'
import { IconUser as User } from '@tabler/icons-react'
import { useCardano } from '@/components/Providers'
import PagePanel from '@/components/PagePanel'

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
    <div className="animate-fade-in">
      {isAuthenticated && effectiveAddress ? (
        <PagePanel className="max-w-3xl mx-auto">
          <ProfileEditor
            address={cardanoAddress || effectiveAddress}
            tProfile={tProfile}
            logout={handleLogout}
          />
        </PagePanel>
      ) : (
        <PagePanel className="max-w-md mx-auto p-10 sm:p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-lavender/10 text-lavender">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-midnight dark:text-white mb-2">
            {effectiveAddress ? "Verify Ownership" : tProfile('connectWallet')}
          </h3>
          <p className="text-sm text-midnight/60 dark:text-white/60 mb-6 leading-relaxed">
            {effectiveAddress
              ? "Please sign the authentication request in your wallet to access your profile."
              : tProfile('signInToView')}
          </p>
          {effectiveAddress ? (
            <Button
              onClick={() => login()}
              className="bg-lavender hover:bg-lavender/90 text-midnight font-bold px-6 py-2 h-auto rounded-xl transition-all"
            >
              Sign In with Wallet
            </Button>
          ) : (
            <div className="text-sm text-midnight/70 dark:text-white/40">
              Use the "Connect Wallet" button in the header.
            </div>
          )}
        </PagePanel>
      )}
    </div>
  )
}
