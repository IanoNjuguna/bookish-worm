'use client'

import { useResolvedPathname } from './useResolvedPathname'
import type { AppSection } from './nav.types'

export type { AppSection }

export function useAppSection(): AppSection {
  const pathname = useResolvedPathname()

  if (pathname.startsWith('/wallet')) return 'wallet'
  return 'fan'
}
