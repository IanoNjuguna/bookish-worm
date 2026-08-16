'use client'
import { logger } from '@/lib/logger'
import { EXPLORER_URL } from '@/lib/config'

import React, { useState, useEffect } from 'react'
import { IconCopy, IconEdit, IconCheck, IconX, IconLogout, IconExternalLink, IconWallet, IconSettings, IconCurrencyDollar, IconPlus, IconCoins, IconHelpCircle, IconDownload, IconEye, IconEyeOff, IconNote } from '@tabler/icons-react'
import { Link } from '@/i18n/navigation'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { setCookieConsent } from '@/components/CookieConsent'
import MyUploadsGrid from '@/components/MyUploadsGrid'
import MonthlyBillboard from '@/components/MonthlyBillboard'
import { useAudio } from '@/components/AudioProvider'
import { useCardano } from '@/components/Providers'

const API_URL = '/api-backend'

interface UserProfile {
	address: string
	username: string | null
	bio: string | null
	avatar_url: string | null
	artist_mode?: boolean
}

const formatAddress = (addr: string, short = false) => {
	if (!addr || addr.length <= 19) return addr
	if (short) return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
	return `${addr.substring(0, 10)}...${addr.substring(addr.length - 9)}`
}

export function ProfileEditor({ address, tProfile, logout }: any) {
	const [profile, setProfile] = useState<UserProfile | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	const [isNoteOpen, setIsNoteOpen] = useState(false)
	const [showSeedPhrase, setShowSeedPhrase] = useState(false)
	const [username, setUsername] = useState('')
	const [bio, setBio] = useState('')
	const [avatarUrl, setAvatarUrl] = useState('')
	const [artistMode, setArtistMode] = useState(false)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const [hasUploads, setHasUploads] = useState<boolean | null>(null)
	const { getValidToken } = useAudio()
	const { lucid, walletName, sessionSeedPhrase } = useCardano()

	useEffect(() => {
		if (!isSettingsOpen) {
			setShowSeedPhrase(false)
		}
	}, [isSettingsOpen])


	const activeWalletIcon = walletName === 'utxos'
		? 'utxos'
		: walletName && typeof window !== 'undefined'
			? (window as any).cardano?.[walletName]?.icon
			: null;

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch(`${API_URL.replace(/\/$/, '')}/users/${address}`)
				if (res.ok) {
					const data = await res.json()
					const storedMode = typeof window !== 'undefined' && address
						? window.localStorage.getItem(`doba_artist_mode_${address}`)
						: null
					setProfile(data)
					setUsername(data.username || '')
					setBio(data.bio || '')
					setAvatarUrl(data.avatar_url || '')
					setArtistMode(storedMode !== null ? storedMode === 'true' : data.artist_mode || false)
				}
			} catch (err) {
				logger.error('Failed to fetch profile', err)
			} finally {
				setIsLoading(false)
			}
		}

		if (address) {
			fetchProfile()
		}
	}, [address])
	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			const reader = new FileReader()
			reader.onloadend = () => {
				setAvatarUrl(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSaving(true)

		try {
			const token = await getValidToken()
			if (!token) return

			const res = await fetch(`${API_URL.replace(/\/$/, '')}/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					address,
					username,
					bio,
					avatar_url: avatarUrl,
					artist_mode: artistMode
				})
			})

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}))
				logger.error('Failed to save profile', { status: res.status, error: errorData })
				throw new Error(errorData.message || 'Failed to save profile')
			}

			setProfile({ address, username, bio, avatar_url: avatarUrl, artist_mode: artistMode })
			setIsEditing(false)
			toast.dismiss()
			toast.success('Profile updated successfully!')
		} catch (err) {
			logger.error('Failed to save profile', err)
			toast.dismiss()
			toast.error('Failed to update profile')
		} finally {
			setIsSaving(false)
		}
	}

	const handleArtistModeToggle = async (enabled: boolean) => {
		setArtistMode(enabled)
		if (typeof window !== 'undefined' && address) {
			window.localStorage.setItem(`doba_artist_mode_${address}`, String(enabled))
		}
		try {
			const token = await getValidToken()
			if (!token) return
			const res = await fetch(`${API_URL.replace(/\/$/, '')}/users`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					address,
					username,
					bio,
					avatar_url: avatarUrl,
					artist_mode: enabled
				})
			})
			if (!res.ok) throw new Error('Failed to update artist mode')
			setProfile(prev => prev ? { ...prev, artist_mode: enabled } : prev)
			toast.success(enabled ? 'Artist mode enabled' : 'Artist mode disabled')
		} catch (err) {
			logger.error('Failed to save artist mode', err)
			toast.error('Failed to update artist mode')
			setArtistMode(!enabled)
		}
	}

	if (isLoading) {
		return <div className="p-8 glass-surface animate-pulse h-64 rounded-2xl"></div>
	}

	if (isEditing) {
		return (
			<form onSubmit={handleSave} className="space-y-6 animate-fade-in glass-surface p-5 sm:p-6 rounded-2xl shadow-xl">
				<div className="flex justify-between items-center">
					<h3 className="text-xl font-bold text-midnight dark:text-white">Edit Profile</h3>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => setIsEditing(false)}
						className="h-8 w-8 rounded-lg text-midnight/50 dark:text-white/50 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/10 transition-colors"
					>
						<IconX size={18} />
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
					{/* Avatar Edit */}
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
									<img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} alt="Preview" className="w-full h-full object-cover opacity-80 rounded-xl" />
								)}
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
									<IconEdit size={20} className="text-white" />
								</div>
								<input
									type="file"
									accept="image/*"
									onChange={handleAvatarChange}
									className="hidden"
								/>
							</label>
							<div className="text-sm text-midnight/60 dark:text-white/60">
								<p className="font-medium text-midnight/80 dark:text-white/80 mb-0.5">Profile Picture</p>
								<p className="text-xs text-midnight/70 dark:text-white/40">Click to upload. Square ratio recommended.</p>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-midnight/80 dark:text-white/80">Username</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Your Artist Name"
							className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-midnight/50 dark:placeholder:text-white/40"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-midnight/80 dark:text-white/80">Bio</label>
					<textarea
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						placeholder="Tell us about yourself..."
						rows={4}
						className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all resize-none placeholder:text-midnight/50 dark:placeholder:text-white/40"
					/>
				</div>

				<div className="flex justify-center pt-2">
					<Button
						type="submit"
						disabled={isSaving}
						className="bg-lavender hover:bg-lavender/90 text-midnight font-bold px-6 py-2 h-auto rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
					>
						{isSaving ? 'Saving...' : (
							<>
								<IconCheck size={18} />
								Save Profile
							</>
						)}
					</Button>
				</div>
			</form>
		)
	}

	return (
		<div id="profile-card" className="space-y-8">
			{/* Profile Header */}
			<div className="glass-surface p-6 sm:p-8 rounded-2xl shadow-xl relative">
				<div className="absolute top-4 right-4 sm:top-5 sm:right-6 flex items-center gap-1">
					<a
						href="https://www.doba.world/support"
						target="_blank"
						rel="noopener noreferrer"
						className="p-1.5 sm:p-2 text-midnight/50 dark:text-white/50 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/10 transition-colors rounded-lg"
						title="Help & Support"
					>
						<IconHelpCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
					</a>
					<button
						type="button"
						onClick={() => setIsNoteOpen(true)}
						className="p-1.5 sm:p-2 text-midnight/50 dark:text-white/50 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/10 transition-colors rounded-lg"
						title="A note from the founder"
					>
						<IconNote size={16} className="sm:w-[18px] sm:h-[18px]" />
					</button>
					<button
						type="button"
						onClick={() => setIsSettingsOpen(true)}
						className="p-1.5 sm:p-2 text-midnight/50 dark:text-white/50 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/10 transition-colors rounded-lg"
						title="Settings"
					>
						<IconSettings size={16} className="sm:w-[18px] sm:h-[18px]" />
					</button>
					<button
						type="button"
						onClick={() => setIsEditing(true)}
						className="p-1.5 sm:p-2 text-midnight/50 dark:text-white/50 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/10 transition-colors rounded-lg"
						title="Edit Profile"
					>
						<IconEdit size={16} className="sm:w-[18px] sm:h-[18px]" />
					</button>
				</div>

				<div className="flex items-center gap-5 sm:gap-8 pr-14 sm:pr-28">
					{profile?.avatar_url ? (
						<img src={profile.avatar_url} alt="Profile" className="w-20 h-20 sm:w-28 sm:h-28 object-cover border-2 sm:border-4 border-white/5 shadow-2xl rounded-xl sm:rounded-2xl shrink-0" />
					) : (
						<img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} alt="Profile" className="w-20 h-20 sm:w-28 sm:h-28 object-cover border-2 sm:border-4 border-white/5 shadow-2xl bg-midnight/5 dark:bg-white/5 rounded-xl sm:rounded-2xl shrink-0" />
					)}

					<div className="flex flex-col items-start justify-center min-w-0 flex-1 mt-6">
						<h3 className="text-[13px] sm:text-3xl font-bold text-midnight dark:text-white mb-1 sm:mb-2 truncate">
							{profile?.username || 'Anonymous Artist'}
						</h3>

						<div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-2 text-midnight/60 dark:text-white/60">
							<div className="flex items-center gap-2">
								{activeWalletIcon ? (
									activeWalletIcon === 'utxos' ? (
										<IconWallet size={16} className="hidden sm:block text-cyber-pink sm:w-[18px] sm:h-[18px]" />
									) : (
										<img src={activeWalletIcon} alt={walletName || 'Wallet'} className="w-[18px] h-[18px] sm:w-5 sm:h-5 object-contain rounded-full" />
									)
								) : (
									<div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
								)}
								<span className="hidden sm:inline text-sm font-semibold font-mono">{formatAddress(address)}</span>
								<span className="sm:hidden text-[10px] font-semibold font-mono">{formatAddress(address, true)}</span>
							</div>

							<div className="flex items-center gap-1">
								<button
									onClick={() => {
										navigator.clipboard.writeText(address)
										toast.success('Address copied!')
									}}
									className="p-1.5 hover:bg-midnight/5 dark:hover:bg-white/10 rounded-lg transition-colors"
									aria-label="Copy Address"
									title="Copy Address"
								>
									<IconCopy size={15} className="sm:w-4 sm:h-4" />
								</button>

								<a
									href={`${EXPLORER_URL}/address/${address}`}
									target="_blank"
									rel="noopener noreferrer"
									className="p-1.5 hover:bg-midnight/5 dark:hover:bg-white/10 rounded-lg transition-colors"
									title="View on Explorer"
								>
									<IconExternalLink size={15} className="sm:w-4 sm:h-4" />
								</a>

								<button
									onClick={logout}
									className="p-1.5 hover:bg-midnight/5 dark:hover:bg-white/10 rounded-lg transition-colors"
									aria-label="Disconnect"
									title="Disconnect"
								>
									<IconLogout size={15} className="hover:text-red-400 sm:w-4 sm:h-4" />
								</button>
							</div>
						</div>

						{profile?.bio && (
							<p className="text-midnight/70 dark:text-white/70 text-[9px] sm:text-sm mt-3 sm:mt-5 leading-relaxed">
								{profile.bio}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Wallet Actions */}
			<div className="glass-surface p-5 sm:p-6 rounded-2xl shadow-xl">
				<h4 className="text-xs font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-4">
					Actions
				</h4>
				<div id="profile-actions-bar" className="grid grid-cols-3 gap-2 sm:gap-4">
					<Link
						href="/send-money"
						className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 p-3 sm:p-4 bg-midnight/5 dark:bg-white/5 hover:bg-midnight/10 dark:hover:bg-white/10 border border-midnight/10 dark:border-white/10 hover:border-lavender/50 transition-all duration-200 group rounded-xl"
					>
						<div className="p-2 sm:p-2.5 bg-cyber-pink text-midnight group-hover:scale-110 transition-transform duration-200 shrink-0 rounded-xl">
							<IconCurrencyDollar size={18} className="sm:w-5 sm:h-5" />
						</div>
						<div className="min-w-0 flex flex-col items-center sm:items-start">
							<div className="text-[10px] sm:text-sm font-bold text-midnight dark:text-white transition-colors truncate">
								<span className="sm:hidden">Send</span>
								<span className="hidden sm:inline">Send Funds</span>
							</div>
							<div className="hidden sm:block text-xs text-midnight/50 dark:text-white/40 mt-0.5">
								Transfer ADA or assets
							</div>
						</div>
					</Link>

					<Link
						href="/deposit"
						className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 p-3 sm:p-4 bg-midnight/5 dark:bg-white/5 hover:bg-midnight/10 dark:hover:bg-white/10 border border-midnight/10 dark:border-white/10 hover:border-cyber-pink/50 transition-all duration-200 group rounded-xl"
					>
						<div className="p-2 sm:p-2.5 bg-cyber-pink text-midnight group-hover:scale-110 transition-transform duration-200 shrink-0 rounded-xl">
							<IconPlus size={18} className="sm:w-5 sm:h-5" />
						</div>
						<div className="min-w-0 flex flex-col items-center sm:items-start">
							<div className="text-[10px] sm:text-sm font-bold text-midnight dark:text-white transition-colors truncate">
								<span className="sm:hidden">Deposit</span>
								<span className="hidden sm:inline">Deposit Funds</span>
							</div>
							<div className="hidden sm:block text-xs text-midnight/50 dark:text-white/40 mt-0.5">
								Add funds to wallet
							</div>
						</div>
					</Link>

					<Link
						href="/assets"
						className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 p-3 sm:p-4 bg-midnight/5 dark:bg-white/5 hover:bg-midnight/10 dark:hover:bg-white/10 border border-midnight/10 dark:border-white/10 hover:border-lavender/50 transition-all duration-200 group rounded-xl"
					>
						<div className="p-2 sm:p-2.5 bg-cyber-pink text-midnight group-hover:scale-110 transition-transform duration-200 shrink-0 rounded-xl">
							<IconCoins size={18} className="sm:w-5 sm:h-5" />
						</div>
						<div className="min-w-0 flex flex-col items-center sm:items-start">
							<div className="text-[10px] sm:text-sm font-bold text-midnight dark:text-white transition-colors truncate">
								<span className="sm:hidden">Assets</span>
								<span className="hidden sm:inline">View Assets</span>
							</div>
							<div className="hidden sm:block text-xs text-midnight/50 dark:text-white/40 mt-0.5">
								View tokens & NFTs
							</div>
						</div>
					</Link>
				</div>
			</div>

			{/* Billboard Section */}
			<div className="glass-surface p-5 sm:p-6 rounded-2xl shadow-xl">
				<div className="flex items-center gap-3 mb-6">
					<h4 className="text-xs font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40">
						Billboard
					</h4>
					<span className="text-[10px] uppercase tracking-widest text-midnight/40 dark:text-white/20 font-bold">Top 7 • 30 Days</span>
				</div>
				<MonthlyBillboard address={address} />
			</div>

			{/* Uploads Grid */}
			{hasUploads !== false && (
				<div id="my-uploads-section" className="glass-surface p-5 sm:p-6 rounded-2xl shadow-xl">
					<h4 className="text-xs font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-6">
						My Uploads
					</h4>
					<MyUploadsGrid address={address} onUploadsLoaded={setHasUploads} />
				</div>
			)}

			{/* Settings Dialog */}
			<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
				<DialogContent className="sm:max-w-[440px] w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto glass-surface text-midnight dark:text-white shadow-2xl p-5 sm:p-6">
					<DialogHeader className="mb-4">
						<DialogTitle className="text-xl font-bold flex items-center gap-2">
							<IconSettings className="text-lavender" />
							Settings
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-5 py-2">
						{/* Preferences */}
						<section>
							<h3 className="text-[10px] font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-2">
								Preferences
							</h3>
							<div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4">
								<div className="flex items-start gap-3">
									<Checkbox
										id="artist-mode"
										checked={artistMode}
										onCheckedChange={(checked) => handleArtistModeToggle(checked === true)}
									/>
									<div className="space-y-1">
										<label
											htmlFor="artist-mode"
											className="text-sm font-semibold text-midnight dark:text-white cursor-pointer"
										>
											Artist Mode
										</label>
										<p className="text-xs text-midnight/60 dark:text-white/40 leading-relaxed">
											Show studio features like Earnings and Analytics in the sidebar, even before you upload your first track.
										</p>
									</div>
								</div>
							</div>
						</section>

						{/* App */}
						<section>
							<h3 className="text-[10px] font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-2">
								App
							</h3>
							<div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4">
								<div className="flex items-center justify-between gap-4">
									<div className="space-y-1">
										<p className="text-sm font-semibold text-midnight dark:text-white">Install Doba</p>
										<p className="text-xs text-midnight/60 dark:text-white/40 leading-relaxed">
											Add Doba to your home screen for instant access and lock screen controls.
										</p>
									</div>
									<Button
										size="sm"
										onClick={() => {
											setIsSettingsOpen(false)
											window.dispatchEvent(new Event('doba-trigger-install'))
										}}
										className="shrink-0 bg-lavender hover:bg-lavender/90 text-midnight font-bold text-xs uppercase tracking-wider px-3 py-2 h-auto rounded-xl"
									>
										<IconDownload size={14} className="mr-1.5" />
										Install
									</Button>
								</div>
							</div>
						</section>

						{/* Privacy */}
						<section>
							<h3 className="text-[10px] font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-2">
								Privacy
							</h3>
							<div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4">
								<div className="flex items-center justify-between gap-4">
									<div className="space-y-1">
										<p className="text-sm font-semibold text-midnight dark:text-white">Cookie Preferences</p>
										<p className="text-xs text-midnight/60 dark:text-white/40 leading-relaxed">
											Reset your choice to allow or disable analytics cookies.
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setCookieConsent(null)
											window.dispatchEvent(new Event('doba-consent-change'))
											toast.success('Cookie preferences reset. The banner will appear again.')
										}}
										className="shrink-0 text-xs font-bold uppercase tracking-wider text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white px-3 py-2 h-auto rounded-xl border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5"
									>
										Reset
									</Button>
								</div>
							</div>
						</section>

						{/* Security */}
						<section>
							<h3 className="text-[10px] font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-2">
								Security
							</h3>
							{sessionSeedPhrase ? (
								<div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4 space-y-3">
									<div className="flex items-center justify-between gap-3">
										<p className="text-sm font-semibold text-midnight dark:text-white">Seed Phrase</p>
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setShowSeedPhrase(prev => !prev)}
												className="h-8 text-xs text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5 rounded-lg shrink-0"
											>
												{showSeedPhrase ? <IconEyeOff size={14} /> : <IconEye size={14} />}
												<span className="ml-1">{showSeedPhrase ? 'Hide' : 'Reveal'}</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													navigator.clipboard.writeText(sessionSeedPhrase)
													toast.success('Copied to clipboard')
												}}
												className="h-8 text-xs text-lavender hover:bg-lavender/10 hover:text-lavender rounded-lg shrink-0"
											>
												<IconCopy size={14} className="mr-1" />
												Copy
											</Button>
										</div>
									</div>
									<div className="bg-midnight/5 dark:bg-white/5 p-3 font-mono text-xs leading-relaxed text-midnight/70 dark:text-white/60 rounded-lg min-h-[44px] flex items-center">
										{showSeedPhrase ? (
											<span className="select-all break-words">{sessionSeedPhrase}</span>
										) : (
											<span className="tracking-widest">••• ••• ••• ••• ••• •••</span>
										)}
									</div>
									<p className="text-[10px] text-midnight/50 dark:text-white/40 leading-relaxed">
										Your seed phrase is the master key to your wallet. Anyone with it can access your funds, so store it somewhere safe and never share it. For your security, Doba only keeps it in memory during this browser session — once you close or refresh this tab, it is erased and cannot be shown again.
									</p>
								</div>
							) : (
								<div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4 flex items-start gap-3">
									<div className="p-2 bg-midnight/5 dark:bg-white/5 rounded-lg shrink-0">
										<IconWallet className="text-midnight/60 dark:text-white/40" size={20} />
									</div>
									<p className="text-sm text-midnight/60 dark:text-white/60 leading-relaxed">
										No recovery phrase available. You are likely connected via a browser extension wallet which securely manages your keys.
									</p>
								</div>
							)}
						</section>
					</div>
				</DialogContent>
			</Dialog>

			{/* Founder Note Dialog */}
			<Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
				<DialogContent className="sm:max-w-[520px] w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto glass-surface text-midnight dark:text-white shadow-2xl p-5 sm:p-6">
					<DialogHeader className="mb-4">
						<DialogTitle className="text-xl font-bold flex items-center gap-2">
							<IconNote className="text-lavender" />
							A note from the founder
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<img
							src="/note.jpg"
							alt="Handwritten note from the founder"
							className="w-full rounded-xl border border-midnight/10 dark:border-white/10"
						/>
						<p className="text-sm text-midnight/70 dark:text-white/70 text-center">
							Glad you made it. I hope doba brings you joy.
						</p>
						<p className="text-xs text-midnight/50 dark:text-white/50 text-center">
							— Ian, founder of doba
						</p>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
