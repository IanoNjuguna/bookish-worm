'use client'

import { useEffect, useState } from 'react'
import { IconCopy, IconCheck } from '@tabler/icons-react'

interface RoyaltiesFieldsProps {
  royaltyAddress: string
  setRoyaltyAddress: (value: string) => void
  cardanoAddress?: string | null
}

export default function RoyaltiesFields({ royaltyAddress, setRoyaltyAddress, cardanoAddress }: RoyaltiesFieldsProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!royaltyAddress && cardanoAddress) {
      setRoyaltyAddress(cardanoAddress)
    }
  }, [royaltyAddress, cardanoAddress, setRoyaltyAddress])

  const handleCopy = async () => {
    if (!royaltyAddress) return
    try {
      await navigator.clipboard.writeText(royaltyAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white">Royalty Percentage (%)</label>
        <div className="relative">
          <input
            type="number"
            value="5"
            disabled
            readOnly
            className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 pr-14 text-midnight dark:text-white/90 cursor-not-allowed opacity-75 font-mono select-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight/70 dark:text-white/70 text-xs font-bold font-mono">
            %
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white">Royalty Address (Optional)</label>
        <div className="relative">
          <input
            type="text"
            value={royaltyAddress}
            onChange={(e) => setRoyaltyAddress(e.target.value)}
            placeholder="Defaults to your wallet address"
            className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 pr-12 text-midnight dark:text-white focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all placeholder:text-midnight/70 dark:placeholder:text-white/50 font-mono text-sm truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!royaltyAddress}
            title="Copy address"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-midnight/60 dark:text-white/40 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            {copied ? <IconCheck size={16} className="text-emerald-500" /> : <IconCopy size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
