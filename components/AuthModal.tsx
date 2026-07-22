'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAudio } from '@/components/AudioProvider'
import { useCardano } from '@/components/Providers'
import { IconShieldCheck, IconWallet, IconKey, IconLoader2, IconCheck } from '@tabler/icons-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (token: string) => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { login, isLoading, isAuthenticated } = useAudio()
  const { disconnect } = useCardano()
  const [hasAutoStarted, setHasAutoStarted] = useState(false)
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false)

  // Automatically close if authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose()
    }
  }, [isAuthenticated, isOpen, onClose])

  // Trigger wallet signature automatically when modal opens.
  useEffect(() => {
    if (!isOpen) {
      setHasAutoStarted(false)
      setHasFailedAttempt(false)
      return
    }
    if (isAuthenticated || isLoading || hasAutoStarted) return

    setHasAutoStarted(true)
    void handleLogin()
  }, [isOpen, isAuthenticated, isLoading, hasAutoStarted])

  const handleLogin = async () => {
    setHasFailedAttempt(false)
    const token = await login()
    if (token && onSuccess) {
      onSuccess(token)
      return
    }
    if (!token && !isAuthenticated) {
      setHasFailedAttempt(true)
    }
  }

  const handleCancel = () => {
    disconnect()
    onClose()
  }

  const stepOneDone = hasAutoStarted || isLoading || isAuthenticated
  const stepTwoDone = isLoading || isAuthenticated
  const stepThreeDone = isAuthenticated
  const progressWidth = isAuthenticated ? 'w-full' : isLoading ? 'w-2/3' : hasAutoStarted ? 'w-1/3' : 'w-1/4'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-md bg-[#FAF9F6] dark:bg-[#12121A] border-midnight/10 dark:border-white/10 text-midnight dark:text-white outline-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <div className="mx-auto w-12 h-12 bg-lavender/10 rounded-full flex items-center justify-center mb-4">
            {isLoading ? (
              <IconLoader2 size={28} className="text-lavender animate-spin" />
            ) : (
              <IconShieldCheck size={28} className="text-lavender" />
            )}
          </div>
          <DialogTitle className="text-xl text-center font-bold">Loading...</DialogTitle>
          <DialogDescription className="text-midnight/80 dark:text-white/60 text-center pt-2">
            {isLoading
              ? 'Preparing your secure wallet session. Please approve the signature in your wallet if prompted.'
              : 'Connecting your wallet and preparing secure access.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          <div className="bg-midnight/[0.04] dark:bg-white/[0.02] p-4 rounded-lg border border-midnight/10 dark:border-white/5">
            <div className="h-2 w-full bg-midnight/10 dark:bg-white/10 rounded-full overflow-hidden mb-4">
              <div className={`h-full ${progressWidth} bg-lavender transition-all duration-500`} />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-midnight/90 dark:text-white/90">
                {stepOneDone ? <IconCheck size={16} className="text-green-500" /> : <IconWallet size={16} className="text-lavender" />}
                <span>Wallet connected</span>
              </div>
              <div className="flex items-center gap-2 text-midnight/90 dark:text-white/90">
                {stepTwoDone ? (
                  isAuthenticated ? <IconCheck size={16} className="text-green-500" /> : <IconLoader2 size={16} className="text-lavender animate-spin" />
                ) : (
                  <IconKey size={16} className="text-lavender" />
                )}
                <span>Signature verification in progress</span>
              </div>
              <div className="flex items-center gap-2 text-midnight/90 dark:text-white/90">
                {stepThreeDone ? <IconCheck size={16} className="text-green-500" /> : <IconShieldCheck size={16} className="text-lavender" />}
                <span>Secure session setup</span>
              </div>
            </div>

            <p className="text-xs text-midnight/70 dark:text-white/50 leading-relaxed mt-4">
              No transaction fees are charged. This signature only proves wallet ownership.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {hasFailedAttempt && !isAuthenticated && (
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-[#FF1F8A] hover:bg-[#FF1F8A]/90 text-white font-bold h-12 text-base transition-all rounded-lg flex items-center justify-center gap-2"
              >
                {isLoading ? 'Loading...' : 'Retry Signature'}
              </Button>
            )}
            
            <Button
              onClick={handleCancel}
              variant="ghost"
              className="w-full text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5"
            >
              Cancel & Disconnect
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
