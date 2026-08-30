'use client'

interface ProfileTextFieldsProps {
  username: string
  setUsername: (value: string) => void
  bio: string
  setBio: (value: string) => void
}

export function ProfileTextFields({ username, setUsername, bio, setBio }: ProfileTextFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white/80">Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Your Artist Name"
          className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-midnight/50 dark:placeholder:text-white/40"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white/80">Bio</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all resize-none placeholder:text-midnight/50 dark:placeholder:text-white/40"
        />
      </div>
    </>
  )
}
