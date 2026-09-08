'use client'

import { AudioContext } from './AudioContext'
import { useAudioProvider } from './useAudioProvider'

interface AudioProviderProps {
  children: React.ReactNode
}

export function AudioProvider({ children }: AudioProviderProps) {
  const { value } = useAudioProvider()
  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}
