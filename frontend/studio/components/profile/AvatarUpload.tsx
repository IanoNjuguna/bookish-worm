'use client'

import { IconEdit } from '@tabler/icons-react'

interface AvatarUploadProps {
  avatarUrl: string
  address: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AvatarUpload({ avatarUrl, address, onChange }: AvatarUploadProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-midnight/80 dark:text-white/80">Avatar</label>
      <div className="flex gap-4 items-center">
        <label
          className="relative cursor-pointer group overflow-hidden w-16 h-16 border-2 border-midnight/10 dark:border-white/10 shrink-0 rounded-xl"
          title="Upload Avatar"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <img
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`}
              alt="Preview"
              className="w-full h-full object-cover opacity-80 rounded-xl"
            />
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <IconEdit size={20} className="text-white" />
          </div>
          <input type="file" accept="image/*" onChange={onChange} className="hidden" />
        </label>
        <div className="text-sm text-midnight/60 dark:text-white/60">
          <p className="font-medium text-midnight/80 dark:text-white/80 mb-0.5">Profile Picture</p>
          <p className="text-xs text-midnight/70 dark:text-white/40">Click to upload. Square ratio recommended.</p>
        </div>
      </div>
    </div>
  )
}
