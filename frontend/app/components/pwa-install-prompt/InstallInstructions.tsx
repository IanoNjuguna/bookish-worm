import { IconShare2 } from '@tabler/icons-react'

export interface InstallInstructionsProps {
  isIOSView: boolean
}

export function InstallInstructions({ isIOSView }: InstallInstructionsProps) {
  return (
    <p className="text-xs text-midnight/70 dark:text-white/60 leading-relaxed mb-4">
      {isIOSView ? (
        <>
          Tap the{' '}
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-midnight/10 dark:border-white/10 bg-midnight/5 dark:bg-white/5 text-midnight dark:text-white font-semibold">
            <IconShare2 size={10} />
            Share
          </span>{' '}
          button in your browser’s toolbar, then select{' '}
          <span className="font-semibold text-midnight dark:text-white">Add to Home Screen</span>{' '}
          to install Doba as an app.
        </>
      ) : (
        <>
          Add Doba to your home screen for instant access to your music collection and lock screen controls.
        </>
      )}
    </p>
  )
}
