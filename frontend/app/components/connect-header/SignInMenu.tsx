'use client'

import { Button } from '@/components/ui/button'
import { IconKey, IconChevronDown } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { SocialLoginItems } from './SocialLoginItems'
import { WalletListItems } from './WalletListItems'
import { TestModeItems } from './TestModeItems'
import type { CardanoWalletInfo, SocialProvider } from './ConnectHeader.types'

interface SignInMenuProps {
  isConnecting: boolean
  signInLabel: string
  availableWallets: CardanoWalletInfo[]
  onConnectSocial: (provider: SocialProvider) => Promise<void>
  onConnect: (walletId: string) => Promise<void>
  onCreateWallet: () => Promise<void>
  onImportSeed: () => void
}

export function SignInMenu({ isConnecting, signInLabel, availableWallets, onConnectSocial, onConnect, onCreateWallet, onImportSeed }: SignInMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="connect-wallet-btn"
          disabled={isConnecting}
          className="bg-lavender hover:bg-lavender/90 text-midnight font-bold h-10 px-6 transition-all rounded-lg flex items-center gap-2"
        >
          <IconKey size={16} />
          {isConnecting ? 'Connecting...' : signInLabel}
          {!isConnecting && <IconChevronDown size={14} className="ml-1 opacity-50" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px] bg-background dark:bg-midnight border-midnight/10 dark:border-white/10 text-midnight dark:text-white">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-midnight/50 dark:text-white/40 px-3 py-1.5">Social Login</DropdownMenuLabel>
        <SocialLoginItems onConnectSocial={onConnectSocial} />
        <WalletListItems wallets={availableWallets} onConnect={onConnect} />
        <TestModeItems showSeparator={availableWallets.length > 0} onCreateWallet={onCreateWallet} onImportSeed={onImportSeed} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
