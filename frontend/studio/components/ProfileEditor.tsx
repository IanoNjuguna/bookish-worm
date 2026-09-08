'use client'

import { ProfileLoading } from './profile/ProfileLoading'
import { ProfileEditForm } from './profile/ProfileEditForm'
import { ProfileOverview } from './profile-editor/ProfileOverview'
import { useProfileEditor } from './profile-editor/useProfileEditor'
import type { ProfileEditorProps } from './profile/ProfileEditor.types'

export function ProfileEditor({ address, logout }: ProfileEditorProps) {
  const {
    isEditing,
    setIsEditing,
    hasUploads,
    setHasUploads,
    activeWalletIcon,
    sessionSeedPhrase,
    profile,
    isLoading,
    username,
    setUsername,
    bio,
    setBio,
    avatarUrl,
    handleAvatarChange,
    handleSaveAndClose,
    isSaving,
    dialogs,
  } = useProfileEditor(address)

  if (isLoading) return <ProfileLoading />

  if (isEditing) {
    return (
      <ProfileEditForm
        username={username}
        setUsername={setUsername}
        bio={bio}
        setBio={setBio}
        avatarUrl={avatarUrl}
        address={address}
        onAvatarChange={handleAvatarChange}
        onCancel={() => setIsEditing(false)}
        onSave={handleSaveAndClose}
        isSaving={isSaving}
      />
    )
  }

  return (
    <ProfileOverview
      profile={profile}
      address={address}
      activeWalletIcon={activeWalletIcon}
      onEdit={() => setIsEditing(true)}
      logout={logout}
      hasUploads={hasUploads}
      onUploadsLoaded={setHasUploads}
      sessionSeedPhrase={sessionSeedPhrase}
      dialogs={dialogs}
    />
  )
}
