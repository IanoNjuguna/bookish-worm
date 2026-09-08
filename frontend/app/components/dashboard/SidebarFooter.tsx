'use client'

import OnboardingChecklist from '@/components/OnboardingChecklist'
import Footer from '@/components/Footer'
import { useOnboardingChecklist } from '@/components/onboarding-checklist/useOnboardingChecklist'
import { cn } from '@/lib/utils'
import type { SidebarFooterProps } from './SidebarFooter.types'

export function SidebarFooter({ variant }: SidebarFooterProps) {
  const checklist = useOnboardingChecklist()
  const isDesktop = variant === 'desktop'
  const isComplete = checklist.doneCount === checklist.steps.length

  return (
    <div
      className={cn(
        'border-t border-midnight/[0.08] dark:border-white/[0.08]',
        checklist.visible ? 'mt-4' : 'mt-2',
        isDesktop ? 'pb-2' : 'pb-12 px-4'
      )}
    >
      {checklist.visible && (
        <div className={cn('pt-3 pb-3', isDesktop && 'px-1')}>
          <OnboardingChecklist {...checklist} />
        </div>
      )}
      {isComplete && (
        <>
          <div
            className={cn(
              'border-t',
              isDesktop
                ? 'pt-4 border-midnight/[0.04] dark:border-white/[0.04]'
                : 'pt-4 border-transparent'
            )}
          />
          <div className={cn(isDesktop && 'pl-3 pr-4')}>
            <Footer />
          </div>
        </>
      )}
    </div>
  )
}
