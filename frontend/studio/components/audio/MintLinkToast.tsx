'use client'

import { EXPLORER_URL } from '@/lib/config'

interface MintLinkToastProps {
  txHash: string
  message: string
}

export function MintLinkToast({ txHash, message }: MintLinkToastProps) {
  return (
    <div className="flex flex-col gap-1">
      <span>{message}</span>
      <a
        href={`${EXPLORER_URL}/tx/${txHash}`}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
      >
        View on Explorer
      </a>
    </div>
  )
}
