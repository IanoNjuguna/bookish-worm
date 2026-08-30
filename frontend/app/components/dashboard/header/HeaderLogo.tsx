'use client'

import { Link } from '@/i18n/navigation'

interface HeaderLogoProps {
  onClick: () => void
}

export function HeaderLogo({ onClick }: HeaderLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2 shrink-0"
    >
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <img src="/doba.png" alt="Doba" className="w-full h-full object-cover invert dark:invert-0" />
      </div>
      <span className="hidden sm:inline md:hidden text-midnight dark:text-white text-base font-extrabold tracking-tight lowercase">doba</span>
      <span className="hidden md:inline text-midnight dark:text-white text-base sm:text-lg font-extrabold tracking-tight lowercase">doba world</span>
    </Link>
  )
}
