'use client'

import { useTranslations } from 'next-intl'

interface TitleArtistTickerFieldsProps {
  title: string
  setTitle: (value: string) => void
  artistName: string
  setArtistName: (value: string) => void
  ticker: string
  setTicker: (value: string) => void
  setUserEditedTicker: (value: boolean) => void
  isAlbum: boolean
}

export default function TitleArtistTickerFields({
  title,
  setTitle,
  artistName,
  setArtistName,
  ticker,
  setTicker,
  setUserEditedTicker,
  isAlbum,
}: TitleArtistTickerFieldsProps) {
  const t = useTranslations('upload')

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white">
          {isAlbum ? 'Album Title' : t('trackTitleLabel')}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isAlbum ? 'e.g. Bitcoin' : t('trackTitlePlaceholder')}
          className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white">Artist Name</label>
        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="e.g. Satoshi Nakamoto"
          className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white flex items-center gap-1.5">
          Token Ticker
          <span className="text-[10px] text-midnight/70 dark:text-white/70 font-mono font-normal">
            (on-chain identifier)
          </span>
        </label>
        <input
          type="text"
          value={ticker}
          onChange={(e) => {
            setUserEditedTicker(true)
            setTicker(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12))
          }}
          placeholder="e.g. BTC"
          className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40 font-mono text-sm"
          required
        />
      </div>
    </>
  )
}
