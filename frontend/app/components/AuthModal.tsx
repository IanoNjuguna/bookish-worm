'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useAuthModal } from './auth-modal/useAuthModal'
import { AuthModalHeader } from './auth-modal/AuthModalHeader'
import { TosAgreement } from './auth-modal/TosAgreement'
import { AuthModalActions } from './auth-modal/AuthModalActions'
import type { AuthModalProps } from './auth-modal/AuthModal.types'

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const {
    isLoading,
    agreedToTos,
    setAgreedToTos,
    handleLogin,
    handleCancel,
  } = useAuthModal({ isOpen, onClose, onSuccess })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-md bg-background dark:bg-card border-midnight/10 dark:border-white/10 text-midnight dark:text-white outline-none rounded-2xl shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AuthModalHeader />

        <div className="flex flex-col gap-6 py-2">
          <TosAgreement checked={agreedToTos} onCheckedChange={setAgreedToTos} />
          <AuthModalActions
            isLoading={isLoading}
            agreedToTos={agreedToTos}
            onLogin={handleLogin}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
