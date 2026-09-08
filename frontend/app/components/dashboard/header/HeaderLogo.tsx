'use client'

import { Link } from '@/i18n/navigation'
import { useAppSection } from '@/components/dashboard/useAppSection'

interface HeaderLogoProps {
  onClick: () => void
}

export function HeaderLogo({ onClick }: HeaderLogoProps) {
  const section = useAppSection()

  const logoHref = section === 'wallet' ? '/wallet' : '/'
  const suffix = section === 'wallet' ? 'wallet' : null

  return (
    <Link
      href={logoHref}
      onClick={onClick}
      className="flex items-center gap-2 shrink-0"
    >
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <img src="/doba.png" alt="Doba" className="w-full h-full object-cover invert dark:invert-0" />
      </div>
      <span className="hidden sm:inline text-midnight dark:text-white text-base sm:text-lg font-extrabold tracking-tight lowercase">
        doba
        {suffix && (
          <span className="text-[0.6em] align-super ml-0.5 text-cyber-pink">{suffix}</span>
        )}
      </span>
    </Link>
  )
}
