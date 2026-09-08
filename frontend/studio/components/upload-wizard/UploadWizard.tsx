'use client'

import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useUpload } from '@/components/upload/useUpload'
import { useAlbumTracks } from '@/components/upload/useAlbumTracks'
import { useUploadWizard } from './useUploadWizard'
import { WizardHeader } from './WizardHeader'
import { WizardFooter } from './WizardFooter'
import UploadProgress from '@/components/upload/UploadProgress'

const MediaStep = dynamic(() => import('./steps/MediaStep'), { ssr: false })
const DetailsStep = dynamic(() => import('./steps/DetailsStep'), { ssr: false })
const MonetizationStep = dynamic(() => import('./steps/MonetizationStep'), { ssr: false })
const ReviewStep = dynamic(() => import('./steps/ReviewStep'), { ssr: false })

export default function UploadWizard() {
  const searchParams = useSearchParams()
  const draftIdParam = searchParams.get('draft')
  const draftId = draftIdParam ? Number(draftIdParam) : undefined

  const album = useAlbumTracks()
  const upload = useUpload(album.albumTracks, album.setAlbumTracks, draftId)
  const wizard = useUploadWizard({ upload, album })

  const handlePublish = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    upload.handleSubmit(fakeEvent, album.albumTracks)
  }

  const renderStep = () => {
    switch (wizard.currentStep) {
      case 1:
        return <MediaStep upload={upload} album={album} />
      case 2:
        return <DetailsStep upload={upload} album={album} />
      case 3:
        return <MonetizationStep upload={upload} album={album} />
      case 4:
        return <ReviewStep upload={upload} album={album} />
      default:
        return null
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <WizardHeader currentStep={wizard.currentStep} />
      {renderStep()}
      <WizardFooter
        currentStep={wizard.currentStep}
        canGoNext={wizard.canGoNext}
        canGoBack={wizard.canGoBack}
        isLastStep={wizard.isLastStep}
        isUploading={upload.isUploading}
        draftSaving={upload.draftSaving}
        onNext={wizard.nextStep}
        onBack={wizard.prevStep}
        onPublish={handlePublish}
      />
      <UploadProgress
        isUploading={upload.isUploading}
        uploadStep={upload.uploadStep}
        uploadStatusText={upload.uploadStatusText}
        elapsedSeconds={upload.elapsedSeconds}
        displaySeg1={upload.displaySeg1}
        displaySeg2={upload.displaySeg2}
        displaySeg3={upload.displaySeg3}
        displaySeg4={upload.displaySeg4}
      />
    </div>
  )
}
