'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface GradientContextValue {
  gradientEnabled: boolean
  setGradientEnabled: (enabled: boolean) => void
}

const GradientContext = createContext<GradientContextValue | null>(null)

const STORAGE_KEY = 'doba_gradient_enabled'

export function GradientProvider({ children }: { children: ReactNode }) {
  const [gradientEnabled, setGradientEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setGradientEnabled(stored === 'true')
    }
  }, [])

  const update = (enabled: boolean) => {
    setGradientEnabled(enabled)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, String(enabled))
    }
  }

  return (
    <GradientContext.Provider value={{ gradientEnabled: mounted ? gradientEnabled : false, setGradientEnabled: update }}>
      {children}
    </GradientContext.Provider>
  )
}

export function useGradient(): GradientContextValue {
  const ctx = useContext(GradientContext)
  if (!ctx) {
    throw new Error('useGradient must be used within a GradientProvider')
  }
  return ctx
}
