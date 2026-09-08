'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useResolvedPathname } from './useResolvedPathname'

interface SidebarNavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  collapsed?: boolean
}

function useIsActive(href: string): boolean {
  const pathname = useResolvedPathname()
  if (href.startsWith('http')) return false
  return pathname === href || (href !== '/' && pathname.startsWith(href))
}

export function SidebarNavLink({ href, icon, label, collapsed }: SidebarNavLinkProps) {
  const isActive = useIsActive(href)
  const isExternal = href.startsWith('http')

  const className = cn(
    "group relative flex items-center gap-2.5 rounded-lg py-2 px-3 select-none transition-colors duration-150",
    isActive
      ? "bg-white/5 dark:bg-white/[0.03] text-cyber-pink font-semibold"
      : "text-midnight/80 dark:text-white/70 hover:text-midnight dark:hover:text-white hover:translate-x-0.5"
  )

  const content = (
    <>
      <span className={cn(
        "shrink-0 transition-colors duration-150",
        isActive ? "text-cyber-pink" : "text-midnight/60 dark:text-white/50 group-hover:text-midnight dark:group-hover:text-white"
      )}>
        {icon}
      </span>
      {!collapsed && <span className="text-xs transition-colors duration-150">{label}</span>}
    </>
  )

  if (isExternal) {
    return (
      <a href={href} title={collapsed ? label : undefined} className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      prefetch
      title={collapsed ? label : undefined}
      className={className}
    >
      {content}
    </Link>
  )
}

interface MobileNavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  setMenuOpen: (open: boolean) => void
}

export function MobileNavLink({ href, icon, label, setMenuOpen }: MobileNavLinkProps) {
  const isActive = useIsActive(href)
  const isExternal = href.startsWith('http')

  const className = cn(
    "flex items-center gap-3 px-4 py-2 transition-all duration-200 text-midnight/90 dark:text-white/80 hover:text-midnight dark:hover:text-white md:hover:-translate-y-0.5 md:hover:font-semibold",
    isActive && "text-midnight dark:text-white font-bold -translate-y-0.5"
  )

  const content = (
    <>
      {icon}
      <span className="text-sm">{label}</span>
    </>
  )

  if (isExternal) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      prefetch
      onClick={() => setMenuOpen(false)}
      className={className}
    >
      {content}
    </Link>
  )
}
