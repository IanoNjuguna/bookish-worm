'use client'

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { IconPlus, IconKey } from '@tabler/icons-react'

interface TestModeItemsProps {
  showSeparator: boolean
  onCreateWallet: () => Promise<void>
  onImportSeed: () => void
}

export function TestModeItems({ showSeparator, onCreateWallet, onImportSeed }: TestModeItemsProps) {
  return (
    <>
      {showSeparator && <DropdownMenuSeparator className="bg-midnight/10 dark:bg-white/10" />}
      <DropdownMenuItem
        onClick={onCreateWallet}
        className="flex items-center gap-3 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-3 rounded-md"
      >
        <div className="w-6 h-6 rounded-md bg-midnight/10 dark:bg-white/10 flex items-center justify-center text-pink-600 dark:text-cyber-pink">
          <IconPlus size={14} />
        </div>
        <span className="font-medium text-sm text-pink-600 dark:text-cyber-pink">Create Wallet (Test Mode)</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={onImportSeed}
        className="flex items-center gap-3 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-3 rounded-md"
      >
        <div className="w-6 h-6 rounded-md bg-midnight/10 dark:bg-white/10 flex items-center justify-center text-lavender">
          <IconKey size={14} />
        </div>
        <span className="font-medium text-sm text-lavender">Import Seed (Test Mode)</span>
      </DropdownMenuItem>
    </>
  )
}
