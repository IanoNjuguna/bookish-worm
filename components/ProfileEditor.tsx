'use client'
import { logger } from '@/lib/logger'
import { EXPLORER_URL } from '@/lib/config'

import React, { useState, useEffect } from 'react'
import { IconCopy, IconEdit, IconCheck, IconX, IconLogout, IconExternalLink, IconWallet, IconSettings } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
}

const formatAddress = (addr: string | null | undefined) => {
	if (!addr || addr.length <= 19) return addr || ''
	return `${addr.substring(0, 10)}...${addr.substring(addr.length - 9)}`
}

export function ProfileEditor({ address, tProfile, logout }: any) {
	const [profile, setProfile] = useState<UserProfile | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	const [username, setUsername] = useState('')
	const [bio, setBio] = useState('')
	const [avatarUrl, setAvatarUrl] = useState('')
	const [avatarFile, setAvatarFile] = useState<File | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const { getValidToken } = useAudio()
	const { lucid, walletName, sessionSeedPhrase } = useCardano()


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
					setProfile(data)
					setUsername(data.username || '')
					setBio(data.bio || '')
					setAvatarUrl(data.avatar_url || '')
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
					avatar_url: avatarUrl
				})
			})

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}))
				logger.error('Failed to save profile', { status: res.status, error: errorData })
				throw new Error(errorData.message || 'Failed to save profile')
			}

			setProfile({ address, username, bio, avatar_url: avatarUrl })
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

	if (isLoading) {
		return <div className="p-8 bg-midnight/5 dark:bg-white-2 border border-midnight/[0.08] dark:border-white/[0.08] animate-pulse h-64"></div>
	}

	if (isEditing) {
		return (
			<form onSubmit={handleSave} className="p-8 bg-[rgba(26,26,36,0.5)] border border-cyber-pink/30 space-y-6 animate-fade-in relative overflow-hidden">
				{/* Decorative elements to match premium design */}
				<div className="absolute -top-24 -right-24 w-48 h-48 bg-cyber-pink/10 rounded-full blur-3xl pointer-events-none" />
				<div className="absolute -bottom-24 -left-24 w-48 h-48 bg-lavender/10 rounded-full blur-3xl pointer-events-none" />

				<div className="flex justify-between items-center relative z-10">
					<h3 className="text-xl font-bold text-midnight dark:text-white">Edit Profile</h3>
					<button
						type="button"
						onClick={() => setIsEditing(false)}
						className="text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white transition-colors"
						title="Close"
					>
						<IconX size={24} />
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
					{/* Avatar Edit */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-midnight/80 dark:text-white/80">Avatar</label>
						<div className="flex gap-4 items-center">
							<label
								className="relative cursor-pointer group overflow-hidden w-16 h-16 border-2 border-midnight/10 dark:border-white/10 shrink-0 rounded-none"
								title="Upload Avatar"
							>
								{avatarUrl ? (
									<img src={avatarUrl} alt="Preview" className="w-full h-full object-cover rounded-none" />
								) : (
									<img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} alt="Preview" className="w-full h-full object-cover opacity-80 rounded-none" />
								)}
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
									<IconEdit size={20} className="text-midnight dark:text-white" />
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
								<p className="text-xs text-midnight/70 dark:text-white/40">Click the square to upload. Square aspect ratio recommended.</p>
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
							className="w-full bg-black/40 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-midnight/50 dark:placeholder:text-white/50"
						/>
					</div>
				</div>

				<div className="space-y-2 relative z-10">
					<label className="text-sm font-medium text-midnight/80 dark:text-white/80">Bio</label>
					<textarea
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						placeholder="Tell us about yourself..."
						rows={4}
						className="w-full bg-black/40 border border-midnight/10 dark:border-white/10 rounded-none px-4 py-3 text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all resize-none placeholder:text-midnight/50 dark:placeholder:text-white/50"
					/>
				</div>

				<div className="flex justify-end gap-4 pt-4 relative z-10">
					<button
						type="button"
						onClick={() => setIsEditing(false)}
						className="px-6 py-2 border border-midnight/10 dark:border-white/10 text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSaving}
						className="bg-[#B794F4] hover:bg-[#A080E0] text-black font-bold py-2 px-8 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
					>
						{isSaving ? 'Saving...' : (
							<>
								<IconCheck size={18} />
								Save Profile
							</>
						)}
					</button>
				</div>
			</form>
		)
	}

	return (
		<div className="p-8 bg-midnight/5 dark:bg-white-2 border border-midnight/[0.08] dark:border-white/[0.08] relative group overflow-hidden">
			{/* Decorative gradient match */}
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lavender via-lavender/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

			<div className="absolute top-6 right-6 flex items-center gap-2 z-30 opacity-0 group-hover:opacity-100 transition-all">
				<button
					type="button"
					onClick={() => setIsSettingsOpen(true)}
					className="p-2 bg-midnight/5 dark:bg-white/5 hover:bg-midnight/10 dark:hover:bg-white/10 text-midnight/50 dark:text-white/50 hover:text-midnight dark:hover:text-white transition-all"
					title="Wallet Settings"
				>
					<IconSettings size={18} />
				</button>
				<button
					type="button"
					onClick={() => setIsEditing(true)}
					className="p-2 bg-midnight/5 dark:bg-white/5 hover:bg-midnight/10 dark:hover:bg-white/10 text-midnight/50 dark:text-white/50 hover:text-midnight dark:hover:text-white transition-all"
					title="Edit Profile"
				>
					<IconEdit size={18} />
				</button>
			</div>

			<div className="flex items-start gap-6 mb-8">
				{profile?.avatar_url ? (
					<img src={profile.avatar_url} alt="Profile" className="w-24 h-24 object-cover border-4 border-white/5 shadow-2xl rounded-none" />
				) : (
					<img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} alt="Profile" className="w-24 h-24 object-cover border-4 border-white/5 shadow-2xl bg-midnight/5 dark:bg-white/5 rounded-none" />
				)}

				<div className="pt-2">
					<h3 className="text-2xl font-bold text-midnight dark:text-white mb-1">
						{profile?.username || 'Anonymous Artist'}
					</h3>

					<div className="flex items-center gap-2 mt-1.5 mb-2 text-midnight/60 dark:text-white/60">
						{activeWalletIcon ? (
							activeWalletIcon === 'utxos' ? (
								<IconWallet size={16} className="text-[#FF1F8A]" />
							) : (
								<img src={activeWalletIcon} alt={walletName || 'Wallet'} className="w-5 h-5 object-contain rounded-none" />
							)
						) : (
							<div className="w-1.5 h-1.5 rounded-none bg-blue-500 animate-pulse" />
						)}
						<span className="text-xs font-semibold mr-1">{formatAddress(address)}</span>

						<button
							onClick={() => {
								navigator.clipboard.writeText(address)
								toast.success('Address copied!')
							}}
							className="p-1 hover:bg-midnight/5 dark:hover:bg-white/[0.1] rounded-none transition"
							aria-label="Copy Address"
							title="Copy Address"
						>
							<IconCopy size={14} className="hover:text-midnight dark:hover:text-white" />
						</button>
						
						<a
							href={`${EXPLORER_URL}/address/${address}`}
							target="_blank"
							rel="noopener noreferrer"
							className="p-1 hover:bg-midnight/5 dark:hover:bg-white/[0.1] rounded-none transition"
							title="View on Explorer"
						>
							<IconExternalLink size={14} className="hover:text-midnight dark:hover:text-white" />
						</a>

						<button
							onClick={logout}
							className="p-1 hover:bg-midnight/5 dark:hover:bg-white/[0.1] rounded-none transition"
							aria-label="Disconnect"
							title="Disconnect"
						>
							<IconLogout size={14} className="hover:text-red-400" />
						</button>
					</div>

					{profile?.bio && (
						<p className="text-midnight/70 dark:text-white/70 text-sm mt-4 italic leading-relaxed">
							"{profile.bio}"
						</p>
					)}
				</div>
			</div>



			{/* Monthly Billboard Section */}
			<div className="pt-8 border-t border-midnight/10 dark:border-white/10 relative z-10 mb-12">
				<h4 className="text-xl font-bold text-midnight dark:text-white mb-6 flex items-center gap-2">
					<span className="w-1 h-6 bg-cyber-pink rounded-none inline-block"></span>
					Monthly Billboard
					<span className="text-[10px] uppercase tracking-widest text-midnight/60 dark:text-white/30 font-bold ml-2">Top 7 • 30 Days</span>
				</h4>
				<MonthlyBillboard address={address} />
			</div>

			{/* Uploads Grid */}
			<div className="pt-8 border-t border-midnight/10 dark:border-white/10 relative z-10 mb-12">
				<h4 className="text-xl font-bold text-midnight dark:text-white mb-6 flex items-center gap-2">
					<span className="w-1 h-6 bg-lavender rounded-none inline-block"></span>
					My Uploads
				</h4>
				<MyUploadsGrid address={address} />
			</div>

			{/* Wallet Settings Dialog */}
			<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
				<DialogContent className="sm:max-w-md bg-[#FAF9F6] dark:bg-[#12121A] border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-none">
					<DialogHeader className="mb-4">
						<DialogTitle className="text-xl font-bold flex items-center gap-2">
							<IconSettings className="text-lavender" />
							Wallet Settings
						</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
						<div>
							<h3 className="text-sm font-semibold text-midnight/80 dark:text-white/80 mb-2 uppercase tracking-wide">Security</h3>
							{sessionSeedPhrase ? (
								<div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 p-4 rounded-none">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium text-midnight/90 dark:text-white/90">Current Session Recovery Phrase</span>
										<Button 
											type="button"
											onClick={() => {
												navigator.clipboard.writeText(sessionSeedPhrase)
												toast.success("Copied to clipboard")
											}}
											variant="ghost" 
											size="sm" 
											className="h-8 text-xs text-lavender hover:bg-lavender/10 hover:text-lavender rounded-none"
										>
											<IconCopy size={14} className="mr-1" /> Copy
										</Button>
									</div>
									<div className="bg-black/50 p-3 font-mono text-xs leading-relaxed text-midnight/60 dark:text-white/60 select-all break-words rounded-none">
										{sessionSeedPhrase}
									</div>
									<p className="text-[10px] text-midnight/70 dark:text-white/40 mt-2">
										Note: This phrase is only accessible during your current session. If you close or refresh this tab, it will be wiped from memory permanently.
									</p>
								</div>
							) : (
								<div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 p-4 rounded-none flex items-center gap-3">
									<IconWallet className="text-midnight/70 dark:text-white/40" size={24} />
									<p className="text-sm text-midnight/60 dark:text-white/60">
										No recovery phrase available. You are likely connected via a browser extension wallet which securely manages your keys.
									</p>
								</div>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
