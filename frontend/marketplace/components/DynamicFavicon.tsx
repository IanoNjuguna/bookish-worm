'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function DynamicFavicon() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const currentTheme = theme === 'system' ? resolvedTheme : theme
    const iconUrl = currentTheme === 'dark' ? '/doba.ico' : '/doba-light.ico'

    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = iconUrl
  }, [theme, resolvedTheme, mounted])

  return null
}
