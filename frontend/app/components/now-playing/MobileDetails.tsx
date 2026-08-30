'use client'

import Link from 'next/link'
import { EXPLORER_URL } from '@/lib/config'
import type { SidebarTrack } from './NowPlayingSidebar.types'

interface MobileDetailsProps {
  track: SidebarTrack
  uploaderAddress: string | null
  locale: string
  onClose: () => void
}

export function MobileDetails({ track, uploaderAddress, locale, onClose }: MobileDetailsProps) {
  const policyId = track.splitter || process.env.NEXT_PUBLIC_MINTING_POLICY_ID
  const creator = uploaderAddress || track.uploader_address

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">
          Genre
        </p>
        <p className="text-midnight dark:text-white text-sm">{track.genre || 'RARE'}</p>
      </div>

      {(track.token_id !== undefined || track.id !== undefined) && (
        <div className="col-span-2">
          <p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">
            Token ID
          </p>
          <Link
            href={`/${locale}/track/${track.token_id ?? track.id}`}
            onClick={onClose}
            className="text-pink-600 dark:text-cyber-pink hover:underline text-sm font-mono block"
          >
            #{track.token_id ?? track.id}
          </Link>
        </div>
      )}

      {policyId && (
        <div className="col-span-2">
          <p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">
            Policy ID
          </p>
          <a
            href={`${EXPLORER_URL}/tokenPolicy/${policyId}`}
            target="_blank"
            rel="noreferrer"
            className="text-pink-600 dark:text-cyber-pink hover:underline text-xs font-mono block truncate"
          >
            {policyId.slice(0, 8)}...{policyId.slice(-8)}
          </a>
        </div>
      )}

      {creator && (
        <div className="col-span-2">
          <p className="text-[10px] uppercase tracking-widest text-midnight/70 dark:text-white/40 font-display font-bold">
            Creator Address
          </p>
          <a
            href={`${EXPLORER_URL}/address/${creator}`}
            target="_blank"
            rel="noreferrer"
            className="text-pink-600 dark:text-cyber-pink hover:underline text-xs font-mono block truncate"
          >
            {creator.slice(0, 10)}...{creator.slice(-8)}
          </a>
        </div>
      )}
    </div>
  )
}
