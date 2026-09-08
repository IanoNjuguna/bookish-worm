'use client'

import { useEffect, useState } from 'react'

export interface UseSettingsDialogsReturn {
  isSettingsOpen: boolean
  setIsSettingsOpen: (value: boolean) => void
  isNoteOpen: boolean
  setIsNoteOpen: (value: boolean) => void
  showSeedPhrase: boolean
  setShowSeedPhrase: (value: boolean) => void
}

export function useSettingsDialogs(): UseSettingsDialogsReturn {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)

  useEffect(() => {
    if (!isSettingsOpen) {
      setShowSeedPhrase(false)
    }
  }, [isSettingsOpen])

  return {
    isSettingsOpen,
    setIsSettingsOpen,
    isNoteOpen,
    setIsNoteOpen,
    showSeedPhrase,
    setShowSeedPhrase,
  }
}
