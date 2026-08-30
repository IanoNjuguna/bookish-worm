'use client'

import { ProfileHeader } from '../profile/ProfileHeader'
import { WalletActions } from '../profile/WalletActions'
import { ProfileUploads } from '../profile/ProfileUploads'
import { SettingsDialog } from '../profile/SettingsDialog'
import { FounderNoteDialog } from '../profile/FounderNoteDialog'
import type { UserProfile } from '../profile/ProfileEditor.types'
import type { UseSettingsDialogsReturn } from '../profile/useSettingsDialogs'

interface ProfileOverviewProps {
  profile: UserProfile | null
  address: string
  activeWalletIcon: string | null
  onEdit: () => void
  logout: () => void
  hasUploads: boolean | null
  onUploadsLoaded: (hasUploads: boolean) => void
  artistMode: boolean
  onArtistModeToggle: (enabled: boolean) => Promise<void>
  sessionSeedPhrase: string | null
  dialogs: UseSettingsDialogsReturn
}

export function ProfileOverview({
  profile,
  address,
  activeWalletIcon,
  onEdit,
  logout,
  hasUploads,
  onUploadsLoaded,
  artistMode,
  onArtistModeToggle,
  sessionSeedPhrase,
  dialogs,
}: ProfileOverviewProps) {
  return (
    <div id="profile-card" className="space-y-8">
      <ProfileHeader
        profile={profile}
        address={address}
        activeWalletIcon={activeWalletIcon}
        onEdit={onEdit}
        onNote={() => dialogs.setIsNoteOpen(true)}
        onSettings={() => dialogs.setIsSettingsOpen(true)}
        logout={logout}
      />

      <WalletActions artistMode={artistMode} />
      {hasUploads !== false && <ProfileUploads address={address} onUploadsLoaded={onUploadsLoaded} />}

      <SettingsDialog
        open={dialogs.isSettingsOpen}
        onOpenChange={dialogs.setIsSettingsOpen}
        artistMode={artistMode}
        onArtistModeToggle={onArtistModeToggle}
        sessionSeedPhrase={sessionSeedPhrase}
        showSeedPhrase={dialogs.showSeedPhrase}
        setShowSeedPhrase={dialogs.setShowSeedPhrase}
      />

      <FounderNoteDialog open={dialogs.isNoteOpen} onOpenChange={dialogs.setIsNoteOpen} />
    </div>
  )
}
