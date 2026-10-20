import React from 'react'
import TrackDetailClient from './TrackDetailClient'
import { Metadata } from 'next'

interface PageProps {
	params: Promise<{ id: string; locale: string }>
}

async function getTrack(id: string) {
	const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://app.doba.world/api-backend').replace(/\/$/, '')
	try {
		// Bounded: metadata that never resolves is metadata that never gets emitted,
		// and the page then renders with no title and no preview at all.
		const res = await fetch(`${apiUrl}/songs/${id}`, {
			next: { revalidate: 60 },
			signal: AbortSignal.timeout(4000),
		})
		if (res.ok) {
			return await res.json()
		}
	} catch (e) {
		console.error('Server: Failed to fetch track for metadata', e)
	}
	return null
}

/** One stable, locale-free URL for the share card. */
function shareCard(id: string) {
	return `/api/og/track/${id}`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { id } = await params
	const track = await getTrack(id)

	if (!track) {
		return {
			title: 'Track Not Found | Doba',
		}
	}

	return {
		title: `${track.name} by ${track.artist} | Doba`,
		description: track.description || `Listen to ${track.name} by ${track.artist} on Doba.`,
		openGraph: {
			title: `${track.name} by ${track.artist} | Doba`,
			description: track.description || `Listen to ${track.name} by ${track.artist} on Doba.`,
			images: [{ url: shareCard(id), width: 1200, height: 630, alt: `${track.name} by ${track.artist}` }],
			type: 'music.song',
		},
		twitter: {
			card: 'summary_large_image',
			title: `${track.name} by ${track.artist} | Doba`,
			description: track.description || `Listen to ${track.name} by ${track.artist} on Doba.`,
			images: [shareCard(id)],
		},
	}
}

export default async function Page({ params }: PageProps) {
	const { id } = await params
	const track = await getTrack(id)
	return <TrackDetailClient initialTrack={track} />
}
