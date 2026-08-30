'use client'

import { useTranslations } from 'next-intl'
import { useUpload } from './useUpload'
import { useAlbumTracks } from './useAlbumTracks'
import ReleaseTypeToggle from './ReleaseTypeToggle'
import TitleArtistTickerFields from './TitleArtistTickerFields'
import DescriptionField from './DescriptionField'
import GenreSelect from './GenreSelect'
import PricingFields from './PricingFields'
import RoyaltiesFields from './RoyaltiesFields'
import AudioFileField from './AudioFileField'
import CoverFileField from './CoverFileField'
import AlbumTrackList from './AlbumTrackList'
import CollaboratorField from './CollaboratorField'
import AttestationSubmit from './AttestationSubmit'
import PublishedStatus from './PublishedStatus'
import BalanceWarning from './BalanceWarning'
import UploadProgress from './UploadProgress'

export default function UploadView() {
  const t = useTranslations('upload')
  const album = useAlbumTracks()
  const upload = useUpload(album.albumTracks, album.setAlbumTracks)
  const submitDisabled = upload.isUploading || (!upload.isAlbum && !upload.audioFile) || (upload.isAlbum && album.albumTracks.some((track) => !track.file || !track.title)) || !upload.coverFile || !upload.cardanoAddress || !upload.attested

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-midnight/10 dark:border-white/10 pb-6">
        <h2 className="text-3xl font-bold mb-2 text-midnight dark:text-white">{t('title')}</h2>
        <ReleaseTypeToggle isAlbum={upload.isAlbum} setIsAlbum={upload.setIsAlbum} />
      </div>
      <form onSubmit={(e) => upload.handleSubmit(e, album.albumTracks)} className="space-y-10">
        <div id="upload-details-form" className="space-y-6 glass-surface rounded-2xl p-5 sm:p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white"><span className="w-1 h-6 bg-pink-600 dark:bg-cyber-pink rounded-xl" />{upload.isAlbum ? 'Album Details' : t('details')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TitleArtistTickerFields title={upload.title} setTitle={upload.setTitle} artistName={upload.artistName} setArtistName={upload.setArtistName} ticker={upload.ticker} setTicker={upload.setTicker} setUserEditedTicker={upload.setUserEditedTicker} isAlbum={upload.isAlbum} />
            <GenreSelect genre={upload.genre} setGenre={upload.setGenre} open={upload.genreOpen} setOpen={upload.setGenreOpen} />
          </div>
          <DescriptionField description={upload.description} setDescription={upload.setDescription} />
        </div>
        <div className="space-y-6 glass-surface rounded-2xl p-5 sm:p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white"><span className="w-1 h-6 bg-purple-400 rounded-xl" />Pricing & Supply</h3>
          <PricingFields price={upload.price} setPrice={upload.setPrice} supply={upload.supply} setSupply={upload.setSupply} />
        </div>
        <div id="upload-royalties-section" className="space-y-6 glass-surface rounded-2xl p-5 sm:p-6">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white mb-1"><span className="w-1 h-6 bg-pink-400 rounded-xl" />Secondary Royalties</h3>
            <p className="text-xs text-midnight/70 dark:text-white/60 pl-3">Earn recurring royalties whenever fans trade your song tokens on secondary marketplaces.</p>
          </div>
          <RoyaltiesFields royaltyAddress={upload.royaltyAddress} setRoyaltyAddress={upload.setRoyaltyAddress} />
        </div>
        <div className="space-y-6 glass-surface rounded-2xl p-5 sm:p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white"><span className="w-1 h-6 bg-blue-400 rounded-xl" />{t('media')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upload.isAlbum ? <AlbumTrackList tracks={album.albumTracks} addTrack={album.addAlbumTrack} removeTrack={album.removeAlbumTrack} updateTrack={album.updateAlbumTrack} onFileChange={album.handleAlbumTrackFileChange} /> : <AudioFileField audioFile={upload.audioFile} onChange={upload.handleAudioChange} />}
            <CoverFileField coverFile={upload.coverFile} onChange={upload.handleCoverChange} />
          </div>
        </div>
        <CollaboratorField collaborators={upload.collaborators} cardanoAddress={upload.cardanoAddress} addCollaborator={upload.addCollaborator} updateCollaborator={upload.updateCollaborator} removeCollaborator={upload.removeCollaborator} />
        <PublishedStatus publishedSongId={upload.publishedSongId} />
        <BalanceWarning cardanoAddress={upload.cardanoAddress} adaBalance={upload.adaBalance} />
        {upload.publishedSongId === null && <AttestationSubmit attested={upload.attested} setAttested={upload.setAttested} isUploading={upload.isUploading} isAlbum={upload.isAlbum} disabled={submitDisabled} />}
      </form>
      <UploadProgress isUploading={upload.isUploading} uploadStep={upload.uploadStep} uploadStatusText={upload.uploadStatusText} elapsedSeconds={upload.elapsedSeconds} displaySeg1={upload.displaySeg1} displaySeg2={upload.displaySeg2} displaySeg3={upload.displaySeg3} displaySeg4={upload.displaySeg4} />
    </div>
  )
}
