'use client'

import React, { useState, useEffect } from 'react'
import UploadView from '@/components/UploadView'
import { useTranslations } from 'next-intl'
import { useAudio } from '@/components/AudioProvider'
import { Button } from '@/components/ui/button'
import { IconMusic as Music } from '@tabler/icons-react'

export default function UploadDashboard() {
  const tUpload = useTranslations('upload')
  const { isAuthenticated, effectiveAddress, login } = useAudio()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  if (isAuthenticated) {
    return <UploadView />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-midnight dark:text-white">{tUpload('title')}</h2>
        <p className="text-midnight/60 dark:text-white">{tUpload('subtitle')}</p>
      </div>
      <div className="border border-midnight/[0.08] dark:border-white/[0.08] p-12 text-center bg-[rgba(13,13,18,0.3)] rounded-xl">
        <div className="w-16 h-16 mx-auto mb-4 bg-[rgba(183,148,244,0.1)] rounded-full">
          <div className="w-full h-full flex items-center justify-center text-[#B794F4]">
            <Music size={32} />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-midnight dark:text-white">
          {effectiveAddress ? "Verify Ownership" : tUpload('connectWallet')}
        </h3>
        <p className="text-midnight/60 dark:text-white mb-6">
          {effectiveAddress 
            ? "Please sign the authentication request in your wallet to start uploading." 
            : tUpload('connectToUpload')}
        </p>
        {effectiveAddress ? (
          <Button
            onClick={() => login()}
            className="bg-lavender hover:bg-lavender/90 text-midnight font-bold py-2 px-6 rounded-lg transition-all mx-auto block"
          >
            Sign In with Wallet
          </Button>
        ) : (
          <div className="text-sm text-midnight/70 dark:text-white/70">
            Use the "Connect Wallet" button in the header.
          </div>
        )}
      </div>
    </div>
  )
}
