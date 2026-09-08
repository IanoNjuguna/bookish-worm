import { useState, useMemo, useCallback } from 'react'
import type { WizardStep } from './UploadWizard.types'
import type { UseUploadReturn } from '@/components/upload/useUpload'
import type { UseAlbumTracksReturn, AlbumTrack } from '@/components/upload/UploadView.types'

interface UseUploadWizardArgs {
  upload: UseUploadReturn
  album: UseAlbumTracksReturn
}

interface UseUploadWizardReturn {
  currentStep: WizardStep
  goToStep: (step: WizardStep) => void
  nextStep: () => void
  prevStep: () => void
  canGoNext: boolean
  canGoBack: boolean
  isLastStep: boolean
}

function isAlbumTrackValid(track: AlbumTrack): boolean {
  return Boolean(track.file && track.title.trim())
}

function isMediaStepValid(upload: UseUploadReturn, album: UseAlbumTracksReturn): boolean {
  if (!upload.coverFile) return false
  if (upload.isAlbum) {
    return album.albumTracks.length > 0 && album.albumTracks.every(isAlbumTrackValid)
  }
  return Boolean(upload.audioFile)
}

function isDetailsStepValid(upload: UseUploadReturn): boolean {
  return (
    upload.title.trim().length > 0 &&
    upload.artistName.trim().length > 0 &&
    upload.genre.trim().length > 0 &&
    upload.ticker.trim().length > 0
  )
}

function isMonetizationStepValid(upload: UseUploadReturn): boolean {
  const price = Number(upload.price)
  const supply = Number(upload.supply)
  if (Number.isNaN(price) || price <= 0) return false
  if (Number.isNaN(supply) || supply <= 0) return false
  return true
}

export function useUploadWizard({ upload, album }: UseUploadWizardArgs): UseUploadWizardReturn {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)

  const stepValidation = useMemo(() => {
    return {
      1: isMediaStepValid(upload, album),
      2: isDetailsStepValid(upload),
      3: isMonetizationStepValid(upload),
      4: upload.attested && Boolean(upload.cardanoAddress),
    }
  }, [upload, album])

  const canGoNext = stepValidation[currentStep]
  const canGoBack = currentStep > 1
  const isLastStep = currentStep === 4

  const goToStep = useCallback((step: WizardStep) => {
    setCurrentStep(step)
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as WizardStep) : prev))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : prev))
  }, [])

  return {
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    canGoNext,
    canGoBack,
    isLastStep,
  }
}
