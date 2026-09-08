'use client'

import { usePathname } from '@/i18n/navigation'
import { useEffect, useState } from 'react'

export function useResolvedPathname(): string {
  const pathname = usePathname()
  const [clientPath, setClientPath] = useState<string | null>(null)

  useEffect(() => {
    setClientPath(window.location.pathname)
  }, [pathname])

  return clientPath ?? pathname ?? ''
}
