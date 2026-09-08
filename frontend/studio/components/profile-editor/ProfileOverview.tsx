'use client'

import { ProfileHeader } from '../profile/ProfileHeader'
import { ProfileActions } from '../profile/ProfileActions'
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
  sessionSeedPhrase,
  dialogs,
}: ProfileOverviewProps) {
  return (
    <div id="profile-card" className="space-y-8">
      <ProfileHeader
        profile={profile}
        address={address}
        activeWalletIcon={activeWalletIcon}
        onNote={() => dialogs.setIsNoteOpen(true)}
        logout={logout}
      />

      <ProfileActions
        onEdit={onEdit}
        onSettings={() => dialogs.setIsSettingsOpen(true)}
        logout={logout}
      />
      {hasUploads !== false && <ProfileUploads address={address} onUploadsLoaded={onUploadsLoaded} />}

      <SettingsDialog
        open={dialogs.isSettingsOpen}
        onOpenChange={dialogs.setIsSettingsOpen}
        sessionSeedPhrase={sessionSeedPhrase}
        showSeedPhrase={dialogs.showSeedPhrase}
        setShowSeedPhrase={dialogs.setShowSeedPhrase}
      />

      <FounderNoteDialog open={dialogs.isNoteOpen} onOpenChange={dialogs.setIsNoteOpen} />
    </div>
  )
}
