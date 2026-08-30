'use client'

import MyUploadsGrid from '@/components/MyUploadsGrid'

interface ProfileUploadsProps {
  address: string
  onUploadsLoaded: (hasUploads: boolean) => void
}

export function ProfileUploads({ address, onUploadsLoaded }: ProfileUploadsProps) {
  return (
    <div id="my-uploads-section" className="glass-surface p-5 sm:p-6 rounded-2xl shadow-xl">
      <h4 className="text-xs font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-6">
        My Uploads
      </h4>
      <MyUploadsGrid address={address} onUploadsLoaded={onUploadsLoaded} />
    </div>
  )
}
