'use client'

import { useTranslations } from 'next-intl'
import { IconMusic } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface AudioFileFieldProps {
  audioFile: File | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function AudioFileField({ audioFile, onChange }: AudioFileFieldProps) {
  const t = useTranslations('upload')

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-midnight/80 dark:text-white">{t('audioLabel')}</label>
      <div
        id="upload-audio-zone"
        className={cn(
          'border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center gap-4 transition-all bg-midnight/[0.02] dark:bg-white/[0.02] group',
          audioFile
            ? 'border-cyber-pink/50 bg-cyber-pink/[0.05]'
            : 'border-midnight/10 dark:border-white/10 hover:border-midnight/30 dark:hover:border-white/30 hover:bg-midnight/5 dark:hover:bg-white/5'
        )}
      >
        <div
          className={cn(
            'p-4 rounded-xl transition-colors',
            audioFile
              ? 'bg-cyber-pink/20 text-cyber-pink'
              : 'bg-midnight/5 dark:bg-white/5 text-midnight/70 dark:text-white/40 group-hover:text-midnight dark:group-hover:text-white'
          )}
        >
          <IconMusic size={32} />
        </div>
        <div className="text-center px-4">
          <p className="text-sm text-midnight/80 dark:text-white mb-1 font-medium truncate max-w-[200px]">
            {audioFile ? audioFile.name : t('dragDrop')}
          </p>
          <p className="text-xs text-midnight/70 dark:text-white/70 mb-4">
            {audioFile ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB` : t('audioHint')}
          </p>
          <label className="cursor-pointer inline-block">
            <span className="bg-midnight/10 dark:bg-white/10 hover:bg-white/20 text-midnight dark:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
              {audioFile ? t('changeFile') : t('chooseFile')}
            </span>
            <input type="file" accept="audio/*" onChange={onChange} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  )
}
