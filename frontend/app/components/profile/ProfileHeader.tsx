'use client'

import { ProfileHeaderActions } from './ProfileHeaderActions'
import { ProfileAddress } from './ProfileAddress'
import type { UserProfile } from './ProfileEditor.types'

interface ProfileHeaderProps {
  profile: UserProfile | null
  address: string
  activeWalletIcon: string | null
  walletName?: string | null
  onNote: () => void
  logout: () => void
}

export function ProfileHeader({
  profile,
  address,
  activeWalletIcon,
  onNote,
  logout,
}: ProfileHeaderProps) {
  return (
    <div className="glass-surface p-6 sm:p-8 rounded-2xl shadow-xl relative">
      <div className="absolute top-4 right-4 sm:top-5 sm:right-6">
        <ProfileHeaderActions onNote={onNote} />
      </div>

      <div className="flex items-center gap-5 sm:gap-8 pr-14 sm:pr-28">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="w-20 h-20 sm:w-28 sm:h-28 object-cover border-2 sm:border-4 border-white/5 shadow-2xl rounded-xl sm:rounded-2xl shrink-0"
          />
        ) : (
          <img
            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`}
            alt="Profile"
            className="w-20 h-20 sm:w-28 sm:h-28 object-cover border-2 sm:border-4 border-white/5 shadow-2xl bg-midnight/5 dark:bg-white/5 rounded-xl sm:rounded-2xl shrink-0"
          />
        )}

        <div className="flex flex-col items-start justify-center min-w-0 flex-1 mt-6">
          <h3 className="text-[13px] sm:text-3xl font-bold text-midnight dark:text-white mb-1 sm:mb-2 truncate">
            {profile?.username || 'Anonymous Artist'}
          </h3>

          <ProfileAddress address={address} activeWalletIcon={activeWalletIcon} logout={logout} />

          {profile?.bio && (
            <p className="text-midnight/70 dark:text-white/70 text-[9px] sm:text-sm mt-3 sm:mt-5 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
