'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { WizardStep } from './UploadWizard.types'

interface WizardHeaderProps {
  currentStep: WizardStep
}

export function WizardHeader({ currentStep }: WizardHeaderProps) {
  const t = useTranslations('upload.wizard')
  const steps: { key: WizardStep; label: string }[] = [
    { key: 1, label: t('stepFiles') },
    { key: 2, label: t('stepDetails') },
    { key: 3, label: t('stepMonetization') },
    { key: 4, label: t('stepReview') },
  ]

  return (
    <div className="border-b border-midnight/10 dark:border-white/10 pb-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-midnight dark:text-white">
        {t('title')}
      </h2>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep
          const isCompleted = step.key < currentStep
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                className={cn(
                  'flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors',
                  isActive ? 'text-cyber-pink' : isCompleted ? 'text-cyber-pink/70' : 'text-midnight/50 dark:text-white/50'
                )}
              >
                <span
                  className={cn(
                    'w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                    isActive
                      ? 'bg-cyber-pink text-midnight'
                      : isCompleted
                        ? 'bg-cyber-pink/20 text-cyber-pink'
                        : 'bg-midnight/5 dark:bg-white/10 text-midnight/60 dark:text-white/60'
                  )}
                >
                  {step.key}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-px mx-2 sm:mx-3 transition-colors',
                    isCompleted ? 'bg-cyber-pink/50' : 'bg-midnight/10 dark:bg-white/10'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
