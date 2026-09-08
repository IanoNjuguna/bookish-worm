'use client'

import { IconCopy, IconCheck, IconWallet } from '@tabler/icons-react'
import { useState } from 'react'
import PagePanel from '@/components/PagePanel'
import { formatAddress } from '@/components/connect-header/formatAddress'

interface WalletBalanceCardProps {
  address?: string | null
  balance: number
  price: number
  loading: boolean
}

export function WalletBalanceCard({ address, balance, price, loading }: WalletBalanceCardProps) {
  const [copied, setCopied] = useState(false)
  const usdValue = balance * price

  const copyAddress = async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PagePanel className="relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-midnight/50 dark:text-white/50 text-xs font-medium uppercase tracking-widest">
            <IconWallet size={14} />
            <span>Wallet Balance</span>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-bold text-midnight dark:text-white">
            {loading ? '—' : `${balance.toLocaleString()} ADA`}
          </div>
          {!loading && (
            <div className="text-sm text-midnight/60 dark:text-white/60">
              ≈ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          )}
        </div>

        {address && (
          <button
            onClick={copyAddress}
            className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-xl bg-midnight/5 dark:bg-white/5 hover:bg-midnight/10 dark:hover:bg-white/10 border border-midnight/10 dark:border-white/10 transition-colors text-xs font-mono text-midnight/70 dark:text-white/70"
          >
            <span>{formatAddress(address, 10, 6)}</span>
            {copied ? <IconCheck size={14} className="text-green-500" /> : <IconCopy size={14} />}
          </button>
        )}
      </div>
    </PagePanel>
  )
}
