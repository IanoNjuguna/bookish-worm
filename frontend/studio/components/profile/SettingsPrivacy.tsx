'use client'

import { Button } from '@/components/ui/button'
import { setCookieConsent } from '@/components/CookieConsent'
import { toast } from 'sonner'

interface SettingsPrivacyProps {
  onClose: () => void
}

export function SettingsPrivacy({ onClose }: SettingsPrivacyProps) {
  const handleReset = () => {
    setCookieConsent(null)
    window.dispatchEvent(new Event('doba-consent-change'))
    toast.success('Cookie preferences reset. The banner will appear again.')
    onClose()
  }

  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-2">
        Privacy
      </h3>
      <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-midnight dark:text-white">Cookie Preferences</p>
            <p className="text-xs text-midnight/60 dark:text-white/40 leading-relaxed">
              Reset your choice to allow or disable analytics cookies.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="shrink-0 text-xs font-bold uppercase tracking-wider text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white px-3 py-2 h-auto rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
          >
            Reset
          </Button>
        </div>
      </div>
    </section>
  )
}
