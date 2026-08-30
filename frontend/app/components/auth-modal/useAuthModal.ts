'use client'

import React, { useState } from 'react'
import { useAudio } from '@/components/audio'
import { useCardano } from '@/components/Providers'
import type { AuthModalProps } from './AuthModal.types'

export interface UseAuthModalReturn {
  isLoading: boolean
  agreedToTos: boolean
  setAgreedToTos: (agreed: boolean) => void
  handleLogin: () => Promise<void>
  handleCancel: () => void
}

export function useAuthModal({ isOpen, onClose, onSuccess }: AuthModalProps): UseAuthModalReturn {
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
    onClose()
  }

  return {
    isLoading,
    agreedToTos,
    setAgreedToTos,
    handleLogin,
    handleCancel,
  }
}
