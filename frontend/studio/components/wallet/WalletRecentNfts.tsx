'use client'

import { Link } from '@/i18n/navigation'
import { IconDisc, IconArrowRight } from '@tabler/icons-react'
import PagePanel from '@/components/PagePanel'
import type { Track } from '@/components/assets/AssetsView.types'

interface WalletRecentNftsProps {
  nfts: Track[]
  loading: boolean
}

export function WalletRecentNfts({ nfts, loading }: WalletRecentNftsProps) {
  return (
    <PagePanel>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-midnight/50 dark:text-white/50">
          Recent Collectibles
        </h3>
        <Link
          href="/wallet/assets"
          className="inline-flex items-center gap-1 text-xs font-medium text-cyber-pink hover:text-cyber-pink/80 transition-colors"
        >
          View all <IconArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-midnight/5 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : nfts.length === 0 ? (
        <div className="py-8 text-center text-sm text-midnight/50 dark:text-white/50">
          <IconDisc size={32} className="mx-auto mb-3 opacity-40" />
          No collected tracks yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {nfts.map((nft) => (
            <a
              key={nft.token_id}
              href={`https://app.doba.world/track/${nft.token_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden bg-midnight/5 dark:bg-white/5"
            >
              {nft.image_url ? (
                <img
                  src={nft.image_url}
                  alt={nft.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-midnight/30 dark:text-white/30">
                  <IconDisc size={32} />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-midnight/80 to-transparent">
                <div className="text-xs font-medium text-white truncate">{nft.name}</div>
                <div className="text-[10px] text-white/70 truncate">{nft.artist}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </PagePanel>
  )
}
