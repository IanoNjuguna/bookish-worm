'use client'

import { IconLoader2, IconUpload } from '@tabler/icons-react'

interface AttestationSubmitProps {
  attested: boolean
  setAttested: (value: boolean) => void
  isUploading: boolean
  isAlbum: boolean
  disabled: boolean
  showButton?: boolean
}

export default function AttestationSubmit({
  attested,
  setAttested,
  isUploading,
  isAlbum,
  disabled,
  showButton = true,
}: AttestationSubmitProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 glass-surface rounded-xl">
        <input
          type="checkbox"
          id="attestation"
          checked={attested}
          onChange={(e) => setAttested(e.target.checked)}
          className="mt-1 h-4 w-4 rounded-xl border-midnight/20 dark:border-white/20 text-pink-600 dark:text-cyber-pink focus:ring-cyber-pink bg-transparent cursor-pointer"
        />
        <label htmlFor="attestation" className="text-sm font-medium text-midnight/80 dark:text-white cursor-pointer select-none">
          I own or have licensed all content I am minting, and agree to the Terms of Service.
        </label>
      </div>

      {showButton && (
        <button
          type="submit"
          disabled={disabled}
          className="w-full bg-cyber-pink hover:bg-cyber-pink/90 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group text-sm"
        >
          {isUploading ? (
            <>
              <IconLoader2 size={20} className="animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <IconUpload size={20} className="group-hover:-translate-y-0.5 transition-transform" />
              {isAlbum ? 'Publish Album' : 'Publish Track'}
            </>
          )}
        </button>
      )}
    </div>
  )
}
