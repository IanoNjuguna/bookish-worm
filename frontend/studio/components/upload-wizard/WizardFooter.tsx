'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import type { WizardStep } from './UploadWizard.types'

interface WizardFooterProps {
  currentStep: WizardStep
  canGoNext: boolean
  canGoBack: boolean
  isLastStep: boolean
  isUploading: boolean
  draftSaving?: boolean
  onNext: () => void
  onBack: () => void
  onPublish: () => void
}

export function WizardFooter({
  currentStep,
  canGoNext,
  canGoBack,
  isLastStep,
  isUploading,
  draftSaving = false,
  onNext,
  onBack,
  onPublish,
}: WizardFooterProps) {
  const t = useTranslations('upload.wizard')

  return (
    <div className="flex items-center justify-between pt-6 border-t border-midnight/10 dark:border-white/10">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={!canGoBack || isUploading}
          className="text-midnight dark:text-white hover:bg-midnight/5 dark:hover:bg-white/5 disabled:opacity-30"
        >
          <IconArrowLeft size={16} className="mr-1.5" />
          {t('back')}
        </Button>
        <span className="text-xs text-midnight/50 dark:text-white/50">
          {draftSaving ? t('saving') : t('saved')}
        </span>
      </div>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onPublish}
          disabled={!canGoNext || isUploading}
          className="bg-cyber-pink hover:bg-cyber-pink/90 text-midnight font-bold px-6 py-2 h-auto rounded-xl transition-all disabled:opacity-50"
        >
          {isUploading ? t('publishing') : t('publish')}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="bg-lavender hover:bg-lavender/90 text-midnight font-bold px-6 py-2 h-auto rounded-xl transition-all disabled:opacity-50"
        >
          {t('next')}
          <IconArrowRight size={16} className="ml-1.5" />
        </Button>
      )}
    </div>
  )
}
