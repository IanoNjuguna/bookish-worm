'use client'

import { useState } from 'react'
import { useCardano } from '@/components/Providers'
import { useProfile } from '../profile/useProfile'
import type { UseProfileReturn } from '../profile/useProfile'
import { useSettingsDialogs } from '../profile/useSettingsDialogs'
import type { UseSettingsDialogsReturn } from '../profile/useSettingsDialogs'

export interface UseProfileEditorReturn extends UseProfileReturn {
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  hasUploads: boolean | null
  setHasUploads: (value: boolean | null) => void
  activeWalletIcon: string | null
  sessionSeedPhrase: string | null
  handleSaveAndClose: (e: React.FormEvent) => Promise<void>
  dialogs: UseSettingsDialogsReturn
}

export function useProfileEditor(address: string): UseProfileEditorReturn {
  const [isEditing, setIsEditing] = useState(false)
  const [hasUploads, setHasUploads] = useState<boolean | null>(null)
  const { walletName, sessionSeedPhrase } = useCardano()
  const profile = useProfile(address)
  const dialogs = useSettingsDialogs()

  const activeWalletIcon =
    walletName === 'utxos'
      ? 'utxos'
      : walletName && typeof window !== 'undefined'
        ? (window as any).cardano?.[walletName]?.icon
        : null

  const handleSaveAndClose = async (e: React.FormEvent) => {
    try {
      await profile.handleSave(e)
      setIsEditing(false)
    } catch {
      // Error toasts are handled inside handleSave
    }
  }

  return {
    ...profile,
    isEditing,
    setIsEditing,
    hasUploads,
    setHasUploads,
    activeWalletIcon,
    sessionSeedPhrase,
    handleSaveAndClose,
    dialogs,
  }
}
