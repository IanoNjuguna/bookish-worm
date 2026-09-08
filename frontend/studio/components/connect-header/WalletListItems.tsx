'use client'

import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { IconWallet } from '@tabler/icons-react'
import type { CardanoWalletInfo } from './ConnectHeader.types'

interface WalletListItemsProps {
  wallets: CardanoWalletInfo[]
  onConnect: (walletId: string) => Promise<void>
}

export function WalletListItems({ wallets, onConnect }: WalletListItemsProps) {
  return (
    <>
      {wallets.length > 0 && (
        <>
          <DropdownMenuSeparator className="bg-midnight/10 dark:bg-white/10" />
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-midnight/50 dark:text-white/40 px-3 py-1.5">Browser Wallets</DropdownMenuLabel>
        </>
      )}
      {wallets.length > 0 && wallets.map((wallet) => (
        <DropdownMenuItem
          key={wallet.id}
          onClick={() => onConnect(wallet.id)}
          className="flex items-center gap-3 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-3 rounded-md"
        >
          {wallet.icon ? (
            <img src={wallet.icon} alt={wallet.name} className="w-6 h-6 rounded-md" />
          ) : (
            <div className="w-6 h-6 rounded-md bg-midnight/10 dark:bg-white/10 flex items-center justify-center">
              <IconWallet size={14} />
            </div>
          )}
          <span className="font-medium text-sm">{wallet.name}</span>
        </DropdownMenuItem>
      ))}
    </>
  )
}
