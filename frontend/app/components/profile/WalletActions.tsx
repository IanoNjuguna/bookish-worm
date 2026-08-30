'use client'

import type React from 'react'
import { Link } from '@/i18n/navigation'
import { IconCurrencyDollar, IconPlus, IconCoins, IconMusic, IconChartBar } from '@tabler/icons-react'

interface WalletActionProps {
  href: string
  icon: React.ReactNode
  title: string
  subtitle: string
  shortTitle: string
}

interface WalletActionsProps {
  artistMode?: boolean
}

function WalletAction({ href, icon, title, subtitle, shortTitle }: WalletActionProps) {
  return (
    <Link
      href={href}
      className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 p-3 sm:p-4 bg-midnight/5 dark:bg-white/5 hover:bg-midnight/10 dark:hover:bg-white/10 border border-midnight/10 dark:border-white/10 hover:border-lavender/50 transition-all duration-200 group rounded-xl"
    >
      <div className="p-2 sm:p-2.5 bg-cyber-pink text-midnight group-hover:scale-110 transition-transform duration-200 shrink-0 rounded-xl">
        {icon}
      </div>
      <div className="min-w-0 flex flex-col items-center sm:items-start">
        <div className="text-[10px] sm:text-sm font-bold text-midnight dark:text-white transition-colors truncate">
          <span className="sm:hidden">{shortTitle}</span>
          <span className="hidden sm:inline">{title}</span>
        </div>
        <div className="hidden sm:block text-xs text-midnight/50 dark:text-white/40 mt-0.5">{subtitle}</div>
      </div>
    </Link>
  )
}

export function WalletActions({ artistMode }: WalletActionsProps) {
  return (
    <div className="glass-surface p-5 sm:p-6 rounded-2xl shadow-xl">
      <h4 className="text-xs font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-4">
        Actions
      </h4>
      <div id="profile-actions-bar" className="grid grid-cols-3 gap-2 sm:gap-4">
        <WalletAction
          href="/send-money"
          icon={<IconCurrencyDollar size={18} className="sm:w-5 sm:h-5" />}
          title="Send Funds"
          shortTitle="Send"
          subtitle="Transfer ADA or assets"
        />
        <WalletAction
          href="/deposit"
          icon={<IconPlus size={18} className="sm:w-5 sm:h-5" />}
          title="Deposit Funds"
          shortTitle="Deposit"
          subtitle="Add funds to wallet"
        />
        <WalletAction
          href="/assets"
          icon={<IconCoins size={18} className="sm:w-5 sm:h-5" />}
          title="View Assets"
          shortTitle="Assets"
          subtitle="View tokens & NFTs"
        />
        {artistMode && (
          <>
            <WalletAction
              href="/upload"
              icon={<IconMusic size={18} className="sm:w-5 sm:h-5" />}
              title="Upload Track"
              shortTitle="Upload"
              subtitle="Publish new music"
            />
            <WalletAction
              href="/earnings"
              icon={<IconCurrencyDollar size={18} className="sm:w-5 sm:h-5" />}
              title="Earnings"
              shortTitle="Earnings"
              subtitle="Revenue & payouts"
            />
            <WalletAction
              href="/analytics"
              icon={<IconChartBar size={18} className="sm:w-5 sm:h-5" />}
              title="Analytics"
              shortTitle="Analytics"
              subtitle="Streams & insights"
            />
          </>
        )}
      </div>
    </div>
  )
}
