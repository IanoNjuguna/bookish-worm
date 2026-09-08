'use client'

import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import { useAudio } from '@/components/audio'
import type { AudioPlayerState, Track as AudioTrack } from '@/components/audio'
import { Track } from '@/lib/types'
import { API_URL } from './MyUploadsGrid.constants'
import type { MyUploadsGridProps } from './MyUploadsGrid.types'

export interface UseMyUploadsGridReturn {
	uploads: Track[]
	loading: boolean
	playerState: AudioPlayerState
	handlePlayTrack: (track: AudioTrack, tracks?: AudioTrack[]) => void
}

export function useMyUploadsGrid({ address, onUploadsLoaded }: MyUploadsGridProps): UseMyUploadsGridReturn {
	const { playerState, handlePlayTrack } = useAudio()
	const [uploads, setUploads] = useState<Track[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUploads = async () => {
			if (!address) {
				setLoading(false)
				onUploadsLoaded?.(false)
				return
			}

			try {
				const fetchUrl = `${API_URL.replace(/\/$/, '')}/songs?artist=${encodeURIComponent(address)}`
				const res = await fetch(fetchUrl)
				if (!res.ok) {
					const text = await res.text().catch(() => '')
					logger.error('Profile: Failed to fetch uploads', { status: res.status, statusText: res.statusText, body: text })
					throw new Error(`Failed to fetch user uploads (${res.status})`)
				}
				const userTracks: Track[] = await res.json()
				setUploads(userTracks)
				onUploadsLoaded?.(userTracks.length > 0)
			} catch (error) {
				logger.error('Profile: Error fetching uploads', error)
				onUploadsLoaded?.(false)
			} finally {
				setLoading(false)
			}
		}

		fetchUploads()
	}, [address])

	return { uploads, loading, playerState, handlePlayTrack }
}
