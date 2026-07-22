'use client'

import * as React from 'react'
import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-full hover:bg-midnight/10 dark:hover:bg-white/10"
    >
      {theme === 'dark' ? (
        <IconSun className="h-5 w-5 text-midnight dark:text-white" />
      ) : (
        <IconMoon className="h-5 w-5 text-midnight dark:text-white" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
