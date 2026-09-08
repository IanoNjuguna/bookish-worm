'use client'

import { useTranslations } from 'next-intl'
import GenreSelect from '@/components/upload/GenreSelect'
import DescriptionField from '@/components/upload/DescriptionField'
import type { WizardStepProps } from '../UploadWizard.types'

export default function DetailsStep({ upload }: WizardStepProps) {
  const t = useTranslations('upload')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-midnight/80 dark:text-white">
            {upload.isAlbum ? 'Album Title' : t('trackTitleLabel')}
          </label>
          <input
            type="text"
            value={upload.title}
            onChange={(e) => upload.setTitle(e.target.value)}
            placeholder={upload.isAlbum ? 'e.g. Bitcoin' : t('trackTitlePlaceholder')}
            className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-midnight/80 dark:text-white">Artist Name</label>
          <input
            type="text"
            value={upload.artistName}
            onChange={(e) => upload.setArtistName(e.target.value)}
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
            value={upload.ticker}
            onChange={(e) => {
              upload.setUserEditedTicker(true)
              upload.setTicker(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12))
            }}
            placeholder="e.g. BTC"
            className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40 font-mono text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-midnight/80 dark:text-white">Genre</label>
          <GenreSelect
            genre={upload.genre}
            setGenre={upload.setGenre}
            open={upload.genreOpen}
            setOpen={upload.setGenreOpen}
          />
        </div>
      </div>

      <DescriptionField description={upload.description} setDescription={upload.setDescription} />
    </div>
  )
}
