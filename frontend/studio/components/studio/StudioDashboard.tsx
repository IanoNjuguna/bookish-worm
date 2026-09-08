'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { IconMusic, IconChartBar, IconCurrencyDollar, IconPlus, IconFiles } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import MyUploadsGrid from '@/components/MyUploadsGrid'
import PagePanel from '@/components/PagePanel'
import type { StudioDashboardProps } from './StudioDashboard.types'

interface StudioActionProps {
  href: string
  icon: React.ReactNode
  title: string
  subtitle: string
}

function StudioAction({ href, icon, title, subtitle }: StudioActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col gap-3 p-4 sm:p-5 rounded-2xl',
        'bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10',
        'hover:bg-midnight/10 dark:hover:bg-white/10 hover:border-lavender/50',
        'transition-all duration-200 group'
      )}
    >
      <div className="p-2 sm:p-2.5 bg-cyber-pink text-midnight w-fit rounded-xl group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-midnight dark:text-white">{title}</div>
        <div className="text-xs text-midnight/50 dark:text-white/40 mt-0.5">{subtitle}</div>
      </div>
    </Link>
  )
}

export function StudioDashboard({ address }: StudioDashboardProps) {
  const tStudio = useTranslations('studio')

  return (
    <div className="animate-fade-in space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-midnight dark:text-white mb-1">
          {tStudio('title')}
        </h1>
        <p className="text-sm text-midnight/60 dark:text-white/60">
          {tStudio('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StudioAction
          href="/upload"
          icon={<IconPlus size={20} />}
          title={tStudio('uploadTitle')}
          subtitle={tStudio('uploadSubtitle')}
        />
        <StudioAction
          href="/drafts"
          icon={<IconFiles size={20} />}
          title={tStudio('draftsTitle')}
          subtitle={tStudio('draftsSubtitle')}
        />
        <StudioAction
          href="/earnings"
          icon={<IconCurrencyDollar size={20} />}
          title={tStudio('earningsTitle')}
          subtitle={tStudio('earningsSubtitle')}
        />
        <StudioAction
          href="/analytics"
          icon={<IconChartBar size={20} />}
          title={tStudio('analyticsTitle')}
          subtitle={tStudio('analyticsSubtitle')}
        />
      </div>

      <PagePanel>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-midnight dark:text-white">
            {tStudio('recentUploads')}
          </h2>
          <Link
            href="/upload"
            className="flex items-center gap-1.5 text-xs font-semibold text-cyber-pink hover:text-cyber-pink/80 transition-colors"
          >
            <IconPlus size={14} />
            {tStudio('newUpload')}
          </Link>
        </div>
        <MyUploadsGrid address={address} />
      </PagePanel>
    </div>
  )
}
