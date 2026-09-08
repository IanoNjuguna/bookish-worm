'use client'

import { Checkbox } from '@/components/ui/checkbox'

interface TosAgreementProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function TosAgreement({ checked, onCheckedChange }: TosAgreementProps) {
  return (
    <div className="flex items-start space-x-3 bg-midnight/[0.04] dark:bg-white/[0.02] p-4 rounded-lg border border-midnight/10 dark:border-white/5">
      <Checkbox
        id="tos"
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c as boolean)}
        className="mt-1 border-midnight/30 dark:border-white/40 data-[state=checked]:bg-lavender data-[state=checked]:border-lavender data-[state=checked]:text-midnight"
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="tos"
          className="text-sm font-medium leading-normal cursor-pointer text-midnight/90 dark:text-white/90"
        >
          Sign message to securely link your wallet
        </label>
        <p className="text-xs text-midnight/70 dark:text-white/50 leading-relaxed pr-2">
          This signature is completely free and proves you own this wallet. It acts as an unbreakable cryptographic lock, ensuring that only you can upload music, access your profile, and withdraw your earnings safely.
        </p>
      </div>
    </div>
  )
}
