'use client'

import React, { useState, useEffect } from 'react'
import UploadView from '@/components/upload'
import { useTranslations } from 'next-intl'
import { useAudio } from '@/components/audio'
import { Button } from '@/components/ui/button'
import { IconMusic as Music } from '@tabler/icons-react'
import PagePanel from '@/components/PagePanel'

export default function UploadDashboard() {
  const tUpload = useTranslations('upload')
  const { isAuthenticated, effectiveAddress, login } = useAudio()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  if (isAuthenticated) {
    return (
      <div className="animate-fade-in">
        <PagePanel className="max-w-4xl mx-auto">
          <UploadView />
        </PagePanel>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PagePanel className="max-w-md mx-auto space-y-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-lavender/10 rounded-full flex items-center justify-center text-lavender">
          <Music size={32} />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-midnight dark:text-white">
          {effectiveAddress ? "Verify Ownership" : tUpload('connectWallet')}
        </h3>
        <p className="text-midnight/60 dark:text-white/60 mb-6">
          {effectiveAddress
            ? "Please sign the authentication request in your wallet to start uploading."
            : tUpload('connectToUpload')}
        </p>
        {effectiveAddress ? (
          <Button
            onClick={() => login()}
            className="bg-lavender hover:bg-lavender/90 text-midnight font-bold py-2 px-6 rounded-xl transition-all mx-auto block"
          >
            Sign In with Wallet
          </Button>
        ) : (
          <div className="text-sm text-midnight/70 dark:text-white/70">
            Use the "Connect Wallet" button in the header.
          </div>
        )}
      </PagePanel>
    </div>
  )
}
