'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, toast } from 'sonner'
import { addNotification } from '@/lib/notifications'

type ToasterProps = React.ComponentProps<typeof Sonner>

let notificationsPatched = false

function toMessage(input: unknown): string {
  if (typeof input === 'string') return input
  if (input instanceof Error) return input.message
  if (input == null) return ''
  return String(input)
}

function patchToastNotifications() {
  if (notificationsPatched) return
  notificationsPatched = true

  const originalSuccess = toast.success.bind(toast)
  const originalError = toast.error.bind(toast)
  const originalInfo = toast.info.bind(toast)
  const originalWarning = toast.warning.bind(toast)
  const originalDefault = toast.bind(toast)

  const getHrefFromArgs = (args: unknown[]): string | undefined => {
    const first = args[0]
    if (!first || typeof first !== 'object') return undefined
    const candidate = (first as { href?: unknown }).href
    return typeof candidate === 'string' ? candidate : undefined
  }

  toast.success = ((message: unknown, ...args: unknown[]) => {
    addNotification(toMessage(message), 'success', { href: getHrefFromArgs(args) })
    return originalSuccess(message as never, ...(args as never[]))
  }) as typeof toast.success

  toast.error = ((message: unknown, ...args: unknown[]) => {
    addNotification(toMessage(message), 'error', { href: getHrefFromArgs(args) })
    return originalError(message as never, ...(args as never[]))
  }) as typeof toast.error

  toast.info = ((message: unknown, ...args: unknown[]) => {
    addNotification(toMessage(message), 'info', { href: getHrefFromArgs(args) })
    return originalInfo(message as never, ...(args as never[]))
  }) as typeof toast.info

  toast.warning = ((message: unknown, ...args: unknown[]) => {
    addNotification(toMessage(message), 'warning', { href: getHrefFromArgs(args) })
    return originalWarning(message as never, ...(args as never[]))
  }) as typeof toast.warning

  const wrappedDefault = ((message: unknown, ...args: unknown[]) => {
    addNotification(toMessage(message), 'default', { href: getHrefFromArgs(args) })
    return originalDefault(message as never, ...(args as never[]))
  }) as typeof toast

  Object.assign(wrappedDefault, toast)
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  useEffect(() => {
    patchToastNotifications()

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
