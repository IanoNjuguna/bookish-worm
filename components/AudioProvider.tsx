'use client'
import React, { createContext, useContext, useCallback, useMemo } from 'react'
import { useAudioPlayer, type Track } from '@/hooks/useAudioPlayer'
import { useCardano } from '@/components/Providers'
import { useBackendAuth } from '@/hooks/useBackendAuth'

interface AudioContextType {
	playerState: ReturnType<typeof useAudioPlayer>
	handlePlayTrack: (track: Track, tracks?: any[]) => void
	effectiveAddress: string | null
	isConnected: boolean
	isAuthenticated: boolean
	isCheckingAuth: boolean
	accessToken: string | null
	getValidToken: () => Promise<string | null>
	sidebarTrack: any | null
	isSidebarOpen: boolean
	handleOpenSidebar: (track: any) => void
	toggleSidebar: () => void
	login: () => Promise<string | null>
	logout: () => void
	isLoading: boolean
}

const AudioContext = createContext<AudioContextType | null>(null)

export const useAudio = () => {
	const context = useContext(AudioContext)
	if (!context) throw new Error('useAudio must be used within an AudioProvider')
	return context
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
	const playerState = useAudioPlayer()
	const { isConnected } = useCardano()
	const { accessToken, getValidToken, login: baseLogin, isAuthenticated: isAuth, isCheckingAuth, isLoading, logout, effectiveAddress } = useBackendAuth()

	const [sidebarTrack, setSidebarTrack] = React.useState<any | null>(null)
	const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
	const login = useCallback(() => {
		if (isAuth && accessToken) {
			return Promise.resolve(accessToken)
		}
		return baseLogin()
	}, [isAuth, accessToken, baseLogin])

	const [recordedTracks, setRecordedTracks] = React.useState<Set<number>>(new Set())

	// 1-minute stream rule implementation
	React.useEffect(() => {
		const track = playerState.currentTrack as any
		if (!track || !playerState.isPlaying) return

		const trackId = Number(track.id ?? track.token_id)
		if (isNaN(trackId)) return

		if (recordedTracks.has(trackId)) return

		// Check for 1 minute reached
		if (playerState.currentTime >= 60) {
			const recordPlay = async () => {
				try {
					// SILENT analytics: Only record if we already have a valid token
					if (!accessToken) return

					const res = await fetch(`/api-backend/songs/${trackId}/play`, {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					})
					if (res.ok) {
						setRecordedTracks(prev => new Set(prev).add(trackId))
					} else {
						const errText = await res.text()
						console.error(`[Analytics] Failed:`, res.status, errText)
					}
				} catch (err) {
					console.error('[Analytics] Network error:', err)
				}
			}
			recordPlay()
		}
	}, [playerState.currentTime, playerState.isPlaying, playerState.currentTrack, recordedTracks, getValidToken])

	// Reset recorded tracks when the authenticated user changes or periodically? 
	// For now, let's just keep track of what's been recorded in this session.
	// We might want to allow re-recording same track?
	// The requirement is "1 stream equals every stream greater than 1 minute".
	// If they play for 1 min, stop, and play again, should it count as another stream? 
	// Usually yes. So let's clear the recorded flag if the track ID changes.
	const [lastTrackId, setLastTrackId] = React.useState<number | null>(null)
	React.useEffect(() => {
		const track = playerState.currentTrack as any
		const currentId = track?.id ?? track?.token_id
		if (currentId !== lastTrackId) {
			setLastTrackId(currentId)
		}
	}, [playerState.currentTrack, lastTrackId])

	// Sync sidebar track with current player track if sidebar is open
	React.useEffect(() => {
		if (playerState.currentTrack && isSidebarOpen) {
			// Always sync if sidebar is open and doesn't match current track
			const sidebarId = sidebarTrack?.id ?? sidebarTrack?.token_id
			const currentTrack = playerState.currentTrack as any
			const currentId = currentTrack?.id ?? currentTrack?.token_id

			if (!sidebarTrack || sidebarId !== currentId) {
				setSidebarTrack(playerState.currentTrack)
			}
		}
	}, [playerState.currentTrack?.id, isSidebarOpen])
	// Auto-sign-in logic removed to prevent "Popup blocked" errors. 
	// Users must explicitly click to authenticate, ensuring a valid user gesture.
	const handleOpenSidebar = useCallback((track: any) => {
		const trackId = track?.id ?? track?.token_id
		setIsSidebarOpen(prev => {
			if (prev) {
				const currentSidebarId = sidebarTrack?.id ?? sidebarTrack?.token_id
				if (currentSidebarId === trackId) {
					return false
				}
			}
			setSidebarTrack(track)
			return true
		})
	}, [sidebarTrack])

	const toggleSidebar = useCallback(() => {
		setIsSidebarOpen(prev => !prev)
	}, [])

	const handlePlayTrack = useCallback((track: Track, tracks?: any[]) => {
		if (!isConnected) {
			login() // Only trigger login if NOT EVEN CONNECTED
			return
		}

		if (playerState.currentTrack?.id === track.id) {
			playerState.togglePlayPause()
			return
		}

		// Clear recorded flag if playing a different track
		const trackId = track.id
		if (trackId !== lastTrackId) {
			setRecordedTracks(prev => {
				const next = new Set(prev)
				next.delete(trackId)
				return next
			})
		}

		playerState.play(track, tracks)

		// If sidebar is open, update it to the track being played
		if (isSidebarOpen) {
			setSidebarTrack(track)
		}
	}, [playerState, isAuth, login, isSidebarOpen, lastTrackId])

	const value = useMemo(() => ({
		playerState,
		handlePlayTrack,
		effectiveAddress,
		isConnected,
		isAuthenticated: isAuth,
		isCheckingAuth,
		isLoading,
		accessToken,
		getValidToken,
		sidebarTrack,
		isSidebarOpen,
		handleOpenSidebar,
		toggleSidebar,
		login,
		logout
	}), [playerState, handlePlayTrack, effectiveAddress, isConnected, isAuth, isCheckingAuth, isLoading, accessToken, getValidToken, sidebarTrack, isSidebarOpen, handleOpenSidebar, toggleSidebar, login, logout])

	return (
		<AudioContext.Provider value={value}>
			{children}
		</AudioContext.Provider>
	)
}
