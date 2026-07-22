'use client'

export type NotificationLevel = 'success' | 'error' | 'info' | 'warning' | 'default'

export type AppNotification = {
  id: string
  message: string
  level: NotificationLevel
  createdAt: string
  read: boolean
  href?: string
  sourcePath?: string
}

export type AddNotificationOptions = {
  href?: string
}

const STORAGE_KEY = 'doba_notifications_v1'
const UPDATE_EVENT = 'doba:notifications-updated'
const MAX_NOTIFICATIONS = 100

function isBrowser() {
  return typeof window !== 'undefined'
}

function emitUpdate() {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT))
}

function parseNotifications(raw: string | null): AppNotification[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as AppNotification[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((n) => !!n?.id && !!n?.message && !!n?.createdAt)
  } catch {
    return []
  }
}

export function getNotifications(): AppNotification[] {
  if (!isBrowser()) return []
  return parseNotifications(window.localStorage.getItem(STORAGE_KEY))
}

function setNotifications(next: AppNotification[]) {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, MAX_NOTIFICATIONS)))
  emitUpdate()
}

export function addNotification(
  message: string,
  level: NotificationLevel = 'default',
  options: AddNotificationOptions = {}
) {
  if (!isBrowser()) return
  const cleanMessage = message.trim()
  if (!cleanMessage) return

  const now = new Date().toISOString()
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
  const next: AppNotification = {
    id,
    message: cleanMessage,
    level,
    createdAt: now,
    read: false,
    href: options.href || currentPath,
    sourcePath: currentPath,
  }

  const existing = getNotifications()
  setNotifications([next, ...existing])
}

export function markNotificationRead(id: string) {
  const existing = getNotifications()
  const next = existing.map((n) => (n.id === id ? { ...n, read: true } : n))
  setNotifications(next)
}

export function markAllNotificationsRead() {
  const existing = getNotifications()
  const next = existing.map((n) => ({ ...n, read: true }))
  setNotifications(next)
}

export function clearNotifications() {
  setNotifications([])
}

export function getUnreadNotificationsCount() {
  return getNotifications().filter((n) => !n.read).length
}

export function subscribeToNotifications(onChange: () => void) {
  if (!isBrowser()) {
    return () => {}
  }

  const handleLocal = () => onChange()
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange()
  }

  window.addEventListener(UPDATE_EVENT, handleLocal)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(UPDATE_EVENT, handleLocal)
    window.removeEventListener('storage', handleStorage)
  }
}
