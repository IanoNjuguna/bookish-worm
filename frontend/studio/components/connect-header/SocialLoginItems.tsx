'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { IconBrandGoogle, IconBrandDiscord, IconBrandX } from '@tabler/icons-react'
import type { SocialProvider } from './ConnectHeader.types'

interface SocialLoginItemsProps {
  onConnectSocial: (provider: SocialProvider) => Promise<void>
}

export function SocialLoginItems({ onConnectSocial }: SocialLoginItemsProps) {
  return (
    <>
      <DropdownMenuItem
        onClick={() => onConnectSocial('google')}
        className="flex items-center gap-3 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-3 rounded-md"
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center">
          <IconBrandGoogle size={20} className="text-[#4285F4]" />
        </div>
        <span className="font-medium text-sm">Continue with Google</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onConnectSocial('discord')}
        className="flex items-center gap-3 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-3 rounded-md"
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center">
          <IconBrandDiscord size={20} className="text-[#5865F2]" />
        </div>
        <span className="font-medium text-sm">Continue with Discord</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onConnectSocial('twitter')}
        className="flex items-center gap-3 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-3 rounded-md"
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center">
          <IconBrandX size={20} />
        </div>
        <span className="font-medium text-sm">Continue with X</span>
      </DropdownMenuItem>
    </>
  )
}
