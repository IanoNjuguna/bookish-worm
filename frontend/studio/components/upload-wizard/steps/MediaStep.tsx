'use client'

import { useTranslations } from 'next-intl'
import ReleaseTypeToggle from '@/components/upload/ReleaseTypeToggle'
import AudioFileField from '@/components/upload/AudioFileField'
import CoverFileField from '@/components/upload/CoverFileField'
import AlbumTrackList from '@/components/upload/AlbumTrackList'
import type { WizardStepProps } from '../UploadWizard.types'

export default function MediaStep({ upload, album }: WizardStepProps) {
  const t = useTranslations('upload.wizard')

  return (
    <div className="space-y-8">
      <div className="glass-surface rounded-2xl p-5 sm:p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-midnight/90 dark:text-white mb-1">{t('releaseType')}</h3>
          <p className="text-xs text-midnight/60 dark:text-white/60">{t('releaseTypeHint')}</p>
        </div>
        <ReleaseTypeToggle isAlbum={upload.isAlbum} setIsAlbum={upload.setIsAlbum} />
      </div>

      <div className="glass-surface rounded-2xl p-5 sm:p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-midnight/90 dark:text-white mb-1">{t('mediaFiles')}</h3>
          <p className="text-xs text-midnight/60 dark:text-white/60">{t('mediaFilesHint')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upload.isAlbum ? (
            <AlbumTrackList
              tracks={album.albumTracks}
              addTrack={album.addAlbumTrack}
              removeTrack={album.removeAlbumTrack}
              updateTrack={album.updateAlbumTrack}
              onFileChange={album.handleAlbumTrackFileChange}
            />
          ) : (
            <AudioFileField audioFile={upload.audioFile} onChange={upload.handleAudioChange} />
          )}
          <CoverFileField coverFile={upload.coverFile} onChange={upload.handleCoverChange} />
        </div>
      </div>
    </div>
  )
}
