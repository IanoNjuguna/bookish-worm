'use client'

import * as React from 'react'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  if (!mounted) {
    return <div className="w-9 h-9 shrink-0" />
  }

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-midnight dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center shrink-0"
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <IconSun className="w-5 h-5 text-yellow-400 transition-transform duration-300 hover:rotate-90" />
      ) : (
        <IconMoon className="w-5 h-5 text-zinc-700 dark:text-white transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  )
}
