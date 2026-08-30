'use client'

import { Button } from '@/components/ui/button'
import { IconX } from '@tabler/icons-react'
import { AvatarUpload } from './AvatarUpload'
import { ProfileTextFields } from './ProfileTextFields'
import { ProfileEditActions } from './ProfileEditActions'

interface ProfileEditFormProps {
  username: string
  setUsername: (value: string) => void
  bio: string
  setBio: (value: string) => void
  avatarUrl: string
  address: string
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
  onSave: (e: React.FormEvent) => void
  isSaving: boolean
}

export function ProfileEditForm({
  username,
  setUsername,
  bio,
  setBio,
  avatarUrl,
  address,
  onAvatarChange,
  onCancel,
  onSave,
  isSaving,
}: ProfileEditFormProps) {
  return (
    <form onSubmit={onSave} className="space-y-6 animate-fade-in glass-surface p-5 sm:p-6 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-midnight dark:text-white">Edit Profile</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 rounded-lg text-midnight/50 dark:text-white/50 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/10 transition-colors"
        >
          <IconX size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <AvatarUpload avatarUrl={avatarUrl} address={address} onChange={onAvatarChange} />
        <ProfileTextFields username={username} setUsername={setUsername} bio={bio} setBio={setBio} />
      </div>

      <ProfileEditActions isSaving={isSaving} />
    </form>
  )
}
