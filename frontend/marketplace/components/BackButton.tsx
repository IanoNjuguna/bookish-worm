'use client'

import { useRouter } from '@/i18n/navigation'
import { getSafeRedirect } from '@/lib/redirect'
import { IconArrowLeft } from '@tabler/icons-react'

export default function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
      router.back()
    } else {
      // If no history or external referrer, go to home
      router.push(getSafeRedirect('/'))
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white transition-colors mb-8 group"
    >
      <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span>Back</span>
    </button>
  )
}
