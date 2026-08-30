'use client'

import { IconCopy, IconExternalLink, IconLogout, IconWallet } from '@tabler/icons-react'
import { toast } from 'sonner'
import { EXPLORER_URL } from '@/lib/config'
import { formatAddress } from './ProfileEditor.constants'

interface ProfileAddressProps {
  address: string
  walletName?: string | null
  activeWalletIcon: string | null
  logout: () => void
}

export function ProfileAddress({ address, activeWalletIcon, logout }: ProfileAddressProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-2 text-midnight/60 dark:text-white/60">
      <div className="flex items-center gap-2">
        {activeWalletIcon ? (
          activeWalletIcon === 'utxos' ? (
            <IconWallet size={16} className="hidden sm:block text-cyber-pink sm:w-[18px] sm:h-[18px]" />
          ) : (
            <img src={activeWalletIcon} alt="Wallet" className="w-[18px] h-[18px] sm:w-5 sm:h-5 object-contain rounded-full" />
          )
        ) : (
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        )}
        <span className="hidden sm:inline text-sm font-semibold font-mono">{formatAddress(address)}</span>
        <span className="sm:hidden text-[10px] font-semibold font-mono">{formatAddress(address, true)}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            navigator.clipboard.writeText(address)
            toast.success('Address copied!')
          }}
          className="p-1.5 hover:bg-midnight/5 dark:hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Copy Address"
          title="Copy Address"
        >
          <IconCopy size={15} className="sm:w-4 sm:h-4" />
        </button>
        <a
          href={`${EXPLORER_URL}/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 hover:bg-midnight/5 dark:hover:bg-white/10 rounded-lg transition-colors"
          title="View on Explorer"
        >
          <IconExternalLink size={15} className="sm:w-4 sm:h-4" />
        </a>
        <button
          onClick={logout}
          className="p-1.5 hover:bg-midnight/5 dark:hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Disconnect"
          title="Disconnect"
        >
          <IconLogout size={15} className="hover:text-red-400 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  )
}
