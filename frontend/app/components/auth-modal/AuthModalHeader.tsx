'use client'

import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { IconShieldCheck } from '@tabler/icons-react'

export function AuthModalHeader() {
  return (
    <DialogHeader className="mb-4">
      <div className="mx-auto w-12 h-12 bg-lavender/10 rounded-full flex items-center justify-center mb-4">
        <IconShieldCheck size={28} className="text-lavender" />
      </div>
      <DialogTitle className="text-xl text-center font-bold">Secure Your Account</DialogTitle>
      <DialogDescription className="text-midnight/80 dark:text-white/60 text-center pt-2">
        You're almost there! Please complete your sign-in to securely link your wallet to Doba.
      </DialogDescription>
    </DialogHeader>
  )
}
