'use client'

import { useTranslations } from 'next-intl'

interface DescriptionFieldProps {
  description: string
  setDescription: (value: string) => void
}

export default function DescriptionField({ description, setDescription }: DescriptionFieldProps) {
  const t = useTranslations('upload')

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-midnight/80 dark:text-white">
        {t('descriptionLabel')}
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t('descriptionPlaceholder')}
        rows={4}
        className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all resize-none placeholder:text-midnight/60 dark:placeholder:text-white/40"
      />
    </div>
  )
}
