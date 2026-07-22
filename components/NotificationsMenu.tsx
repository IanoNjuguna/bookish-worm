'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconBell, IconBellFilled, IconCheck, IconTrash, IconInfoCircle, IconCircleCheck, IconAlertTriangle, IconX, IconCopy } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  AppNotification,
  clearNotifications,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeToNotifications,
} from '@/lib/notifications'

function formatRelativeTime(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const seconds = Math.max(1, Math.floor(diffMs / 1000))

  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatAbsoluteDateTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown time'

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

function NotificationIcon({ level }: { level: AppNotification['level'] }) {
  if (level === 'success') return <IconCircleCheck size={14} className="text-green-500" />
  if (level === 'error') return <IconX size={14} className="text-red-500" />
  if (level === 'warning') return <IconAlertTriangle size={14} className="text-amber-500" />
  return <IconInfoCircle size={14} className="text-lavender" />
}

export default function NotificationsMenu() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [items, setItems] = useState<AppNotification[]>([])
  const [open, setOpen] = useState(false)

  const refresh = () => setItems(getNotifications())

  useEffect(() => {
    refresh()
    const unsub = subscribeToNotifications(refresh)
    return () => unsub()
  }, [])

  useEffect(() => {
    if (open) {
      markAllNotificationsRead()
    }
  }, [open])

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyNotification = (e: React.MouseEvent, item: AppNotification) => {
    e.stopPropagation()
    navigator.clipboard.writeText(item.message)
    setCopiedId(item.id)
    toast.success('Notification copied to clipboard')
    setTimeout(() => {
      setCopiedId((curr) => (curr === item.id ? null : curr))
    }, 2000)
  }

  const handleNotificationClick = (item: AppNotification) => {
    markNotificationRead(item.id)
    if (item.href && item.href.startsWith('/')) {
      setOpen(false)
      router.push(item.href)
    }
  }

  const trigger = (
    <Button
      variant="ghost"
      size="icon"
      className="w-10 h-10 sm:w-10 sm:h-10 rounded-full hover:bg-midnight/10 dark:hover:bg-white/10 relative touch-manipulation"
      aria-label="Open notifications"
    >
      {unreadCount > 0 ? (
        <IconBellFilled className="h-5 w-5 text-midnight dark:text-white" />
      ) : (
        <IconBell className="h-5 w-5 text-midnight dark:text-white" />
      )}
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF1F8A] text-white text-[10px] font-bold flex items-center justify-center leading-none">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
      <span className="sr-only">Notifications</span>
    </Button>
  )

  const notificationList = (
    <div className="max-h-[70vh] sm:max-h-96 overflow-y-auto overscroll-contain">
      {items.length === 0 ? (
        <div className="px-3 py-6 text-center text-sm text-midnight/60 dark:text-white/60">
          No notifications yet.
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNotificationClick(item)}
            className={`group relative w-full text-left px-3 py-3 sm:py-2.5 border-b border-midnight/5 dark:border-white/5 hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors cursor-pointer touch-manipulation ${item.read ? 'opacity-75' : ''}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <div className="mt-0.5 flex-shrink-0">
                  <NotificationIcon level={item.level} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug break-words pr-1">{item.message}</p>
                  <p className="mt-1 text-[11px] font-medium text-midnight/75 dark:text-white/75">
                    {formatAbsoluteDateTime(item.createdAt)}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-midnight/60 dark:text-white/60">
                    <span>{formatRelativeTime(item.createdAt)}</span>
                    {item.href && item.href.startsWith('/') && (
                      <span className="max-w-full truncate text-midnight/50 dark:text-white/50">{item.href}</span>
                    )}
                    {!item.read && (
                      <span className="inline-flex items-center gap-1 text-[#FF1F8A]">
                        <IconCheck size={12} />
                        unread
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleCopyNotification(e, item)}
                title="Copy notification"
                aria-label="Copy notification text"
                className="p-1.5 rounded hover:bg-midnight/10 dark:hover:bg-white/15 text-midnight/50 dark:text-white/50 hover:text-midnight dark:hover:text-white transition-all flex-shrink-0"
              >
                {copiedId === item.id ? (
                  <IconCheck size={14} className="text-green-500" />
                ) : (
                  <IconCopy size={14} />
                )}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const headerActions = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => markAllNotificationsRead()}
        className="h-8 px-2 text-[11px] text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white touch-manipulation"
      >
        Mark all read
      </button>
      <button
        type="button"
        onClick={() => clearNotifications()}
        className="h-8 px-2 text-[11px] text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white inline-flex items-center gap-1 touch-manipulation"
      >
        <IconTrash size={12} />
        Clear
      </button>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[78vh] border-midnight/10 dark:border-white/10 bg-[#FAF9F6] dark:bg-[#0D0D12] text-midnight dark:text-white rounded-t-2xl p-0"
        >
          <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-midnight/20 dark:bg-white/20" />
          <SheetHeader className="px-3 py-2 border-b border-midnight/10 dark:border-white/10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xs uppercase tracking-wider text-midnight/70 dark:text-white/70 font-medium">
                Notifications
              </SheetTitle>
              {headerActions}
            </div>
          </SheetHeader>
          {notificationList}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[360px] max-w-[360px] max-sm:w-[calc(100vw-1rem)] max-sm:max-w-[calc(100vw-1rem)] max-sm:!left-1/2 max-sm:!-translate-x-1/2 max-sm:!right-auto bg-[#FAF9F6] dark:bg-[#0D0D12] border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-none p-0"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 bg-[#FAF9F6] dark:bg-[#0D0D12] border-b border-midnight/10 dark:border-white/10">
          <DropdownMenuLabel className="p-0 text-xs uppercase tracking-wider text-midnight/70 dark:text-white/70">
            Notifications
          </DropdownMenuLabel>
          {headerActions}
        </div>
        {notificationList}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
