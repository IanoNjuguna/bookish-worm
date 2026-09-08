'use client'

import { Button } from '@/components/ui/button'

interface AuthModalActionsProps {
  isLoading: boolean
  agreedToTos: boolean
  onLogin: () => void
  onCancel: () => void
}

export function AuthModalActions({ isLoading, agreedToTos, onLogin, onCancel }: AuthModalActionsProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={onLogin}
        disabled={isLoading || !agreedToTos}
        className="w-full bg-cyber-pink hover:bg-cyber-pink/90 text-white font-bold h-12 text-base transition-all rounded-lg flex items-center justify-center gap-2"
      >
        {isLoading ? 'Verifying...' : 'Finish Setup'}
      </Button>

      <Button
        onClick={onCancel}
        variant="ghost"
        className="w-full text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5"
      >
        Cancel & Disconnect
      </Button>
    </div>
  )
}
