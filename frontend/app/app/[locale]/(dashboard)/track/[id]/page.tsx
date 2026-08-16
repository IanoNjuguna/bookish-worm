import React from 'react'
import TrackDetailClient from './TrackDetailClient'
import { Metadata } from 'next'

interface PageProps {
	params: Promise<{ id: string; locale: string }>
}

async function getTrack(id: string) {
	const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://bookish-worm-production.up.railway.app').replace(/\/$/, '')
	try {
		const res = await fetch(`${apiUrl}/songs/${id}`, {
			next: { revalidate: 60 } // cache for 1 minute
		})
		if (res.ok) {
			return await res.json()
		}
	} catch (e) {
		console.error('Server: Failed to fetch track for metadata', e)
	}
	return null
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
			// og:image comes from opengraph-image.tsx (composed 1200×630 share card)
			type: 'music.song',
		},
		twitter: {
			card: 'summary_large_image',
			title: `${track.name} by ${track.artist} | Doba`,
			description: track.description || `Listen to ${track.name} by ${track.artist} on Doba.`,
			// twitter:image falls back to the generated og card
		},
	}
}

export default async function Page({ params }: PageProps) {
	const { id } = await params
	const track = await getTrack(id)
	return <TrackDetailClient initialTrack={track} />
}
