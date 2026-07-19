'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useAudio } from '@/components/AudioProvider'
import { useCardano } from '@/components/Providers'
import { IconShieldCheck } from '@tabler/icons-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (token: string) => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { login, isLoading, isAuthenticated } = useAudio()
  const { disconnect } = useCardano()
  const [agreedToTos, setAgreedToTos] = useState(false)

  // Automatically close if authenticated
  React.useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose()
    }
  }, [isAuthenticated, isOpen, onClose])

  const handleLogin = async () => {
    const token = await login()
    if (token && onSuccess) {
      onSuccess(token)
    }
  }

  const handleCancel = () => {
    disconnect()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-md bg-[#FAF9F6] dark:bg-[#12121A] border-midnight/10 dark:border-white/10 text-midnight dark:text-white outline-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <div className="mx-auto w-12 h-12 bg-lavender/10 rounded-full flex items-center justify-center mb-4">
            <IconShieldCheck size={28} className="text-lavender" />
          </div>
          <DialogTitle className="text-xl text-center font-bold">Secure Your Account</DialogTitle>
          <DialogDescription className="text-midnight/80 dark:text-white/60 text-center pt-2">
            You're almost there! Please complete your sign-in to securely link your wallet to Doba.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          <div className="flex items-start space-x-3 bg-midnight/[0.04] dark:bg-white/[0.02] p-4 rounded-lg border border-midnight/10 dark:border-white/5">
            <Checkbox 
              id="tos" 
              checked={agreedToTos} 
              onCheckedChange={(c) => setAgreedToTos(c as boolean)} 
              className="mt-1 border-midnight/30 dark:border-white/40 data-[state=checked]:bg-lavender data-[state=checked]:border-lavender data-[state=checked]:text-midnight"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="tos"
                className="text-sm font-medium leading-normal cursor-pointer text-midnight/90 dark:text-white/90"
              >
                Sign message to securely link your wallet
              </label>
              <p className="text-xs text-midnight/70 dark:text-white/50 leading-relaxed pr-2">
                This signature is completely free and proves you own this wallet. It acts as an unbreakable cryptographic lock, ensuring that only you can upload music, access your profile, and withdraw your earnings safely.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLogin}
              disabled={isLoading || !agreedToTos}
              className="w-full bg-[#FF1F8A] hover:bg-[#FF1F8A]/90 text-white font-bold h-12 text-base transition-all rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying...' : 'Finish Setup'}
            </Button>
            
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
