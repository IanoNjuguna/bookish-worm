'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, toast } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // If click target is NOT inside a sonner toast, dismiss all active toasts
      if (!(e.target as Element).closest('[data-sonner-toast]')) {
        toast.dismiss()
      }
    }
    // Use capture phase to ensure it catches clicks before other things stop propagation
    document.addEventListener('click', handleGlobalClick, true)
    return () => document.removeEventListener('click', handleGlobalClick, true)
  }, [])

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-none',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-none',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-none',
          closeButton:
            'group-[.toast]:rounded-none !rounded-none group-[.toast]:bg-background group-[.toast]:border-border',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
