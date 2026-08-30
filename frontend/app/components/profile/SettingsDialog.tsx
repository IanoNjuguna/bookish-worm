'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { IconSettings } from '@tabler/icons-react'
import { SettingsPreferences } from './SettingsPreferences'
import { SettingsAppearance } from './SettingsAppearance'
import { SettingsAppInstall } from './SettingsAppInstall'
import { SettingsPrivacy } from './SettingsPrivacy'
import { SettingsSecurity } from './SettingsSecurity'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  artistMode: boolean
  onArtistModeToggle: (enabled: boolean) => void
  sessionSeedPhrase: string | null
  showSeedPhrase: boolean
  setShowSeedPhrase: (value: boolean) => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  artistMode,
  onArtistModeToggle,
  sessionSeedPhrase,
  showSeedPhrase,
  setShowSeedPhrase,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto glass-surface text-midnight dark:text-white shadow-2xl p-5 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <IconSettings className="text-lavender" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <SettingsPreferences artistMode={artistMode} onToggle={onArtistModeToggle} />
          <SettingsAppearance />
          <SettingsAppInstall onInstall={() => onOpenChange(false)} />
          <SettingsPrivacy onClose={() => onOpenChange(false)} />
          <SettingsSecurity
            sessionSeedPhrase={sessionSeedPhrase}
            showSeedPhrase={showSeedPhrase}
            setShowSeedPhrase={setShowSeedPhrase}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
