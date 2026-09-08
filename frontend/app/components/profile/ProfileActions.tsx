'use client'

import { IconPencil, IconSettings, IconLogout, IconStar } from '@tabler/icons-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface ProfileActionProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick: () => void
  variant?: 'default' | 'danger'
}

function ProfileAction({ icon, title, subtitle, onClick, variant = 'default' }: ProfileActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'gap-3 p-4 sm:p-5 h-full',
        'bg-midnight/5 dark:bg-white/5 hover:bg-midnight/10 dark:hover:bg-white/10',
        'border border-midnight/10 dark:border-white/10 hover:border-lavender/50',
        'transition-all duration-200 group rounded-xl w-full'
      )}
    >
      <div
        className={cn(
          'p-2.5 sm:p-3 text-midnight group-hover:scale-110 transition-transform duration-200 shrink-0 rounded-xl',
          variant === 'danger' ? 'bg-red-400/20 text-red-600 dark:text-red-400' : 'bg-cyber-pink'
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex flex-col items-center">
        <div className="text-xs sm:text-sm font-bold text-midnight dark:text-white transition-colors leading-tight">
          {title}
        </div>
        <div className="text-[10px] sm:text-xs text-midnight/50 dark:text-white/40 mt-1 leading-snug">
          {subtitle}
        </div>
      </div>
    </button>
  )
}

interface ProfileActionsProps {
  onEdit: () => void
  onSettings: () => void
  artistMode: boolean
  onArtistModeToggle: (enabled: boolean) => Promise<void>
  logout: () => void
}

export function ProfileActions({ onEdit, onSettings, artistMode, onArtistModeToggle, logout }: ProfileActionsProps) {
  return (
    <div className="glass-surface p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40">
        Account
      </h4>
      <div id="profile-actions-bar" className="grid grid-cols-2 sm:grid-cols-3 auto-rows-fr gap-3 sm:gap-5">
        <ProfileAction
          icon={<IconPencil size={20} className="sm:w-5 sm:h-5" />}
          title="Edit Profile"
          subtitle="Name, avatar, bio"
          onClick={onEdit}
        />
        <ProfileAction
          icon={<IconSettings size={20} className="sm:w-5 sm:h-5" />}
          title="Settings"
          subtitle="Theme & privacy"
          onClick={onSettings}
        />
        <ProfileAction
          icon={<IconLogout size={20} className="sm:w-5 sm:h-5" />}
          title="Disconnect"
          subtitle="Sign out wallet"
          onClick={logout}
          variant="danger"
        />
      </div>

      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyber-pink text-midnight">
            <IconStar size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-midnight dark:text-white">Artist Mode</div>
            <div className="text-xs text-midnight/50 dark:text-white/40">Show creator features in the app</div>
          </div>
        </div>
        <Switch
          checked={artistMode}
          onCheckedChange={onArtistModeToggle}
          aria-label="Toggle artist mode"
        />
      </div>
    </div>
  )
}
