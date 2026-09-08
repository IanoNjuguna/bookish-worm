'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { IconPhoto } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface CoverFileFieldProps {
  coverFile: File | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function CoverFileField({ coverFile, onChange }: CoverFileFieldProps) {
  const t = useTranslations('upload')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!coverFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(coverFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [coverFile])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-midnight/80 dark:text-white">{t('coverArtLabel')}</label>
      <div
        className={cn(
          'border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center gap-4 transition-all bg-midnight/[0.02] dark:bg-white/[0.02] group relative overflow-hidden',
          coverFile
            ? 'border-purple-400/50'
            : 'border-midnight/10 dark:border-white/10 hover:border-midnight/30 dark:hover:border-white/30 hover:bg-midnight/5 dark:hover:bg-white/5'
        )}
      >
        {coverFile && previewUrl ? (
          <>
            <div className="absolute inset-0 w-full h-full">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-50 blur-sm" />
              <div className="absolute inset-0 bg-midnight/40" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-xl shadow-2xl mb-4 border border-midnight/20 dark:border-white/20"
              />
              <p className="text-xs text-midnight/60 dark:text-white/90 mb-2 truncate max-w-[200px]">{coverFile.name}</p>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-xl bg-midnight/5 dark:bg-white/5 text-midnight/70 dark:text-white/40 group-hover:text-midnight dark:group-hover:text-white transition-colors">
              <IconPhoto size={32} />
            </div>
            <div className="text-center">
              <p className="text-sm text-midnight/60 dark:text-white/90 mb-1">Drag and drop your cover art or click to browse</p>
              <p className="text-xs text-midnight/60 dark:text-white/60 mb-4">{t('coverArtHint')}</p>
            </div>
          </>
        )}

        <div className="relative z-10 text-center">
          <label className="cursor-pointer inline-block">
            <span className="bg-midnight/10 dark:bg-white/10 hover:bg-white/20 text-midnight dark:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm">
              {coverFile ? t('changeCover') : t('chooseFile')}
            </span>
            <input type="file" accept="image/*" onChange={onChange} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  )
}
