import { ImageResponse } from 'next/og'
import { TrackCard } from '@/components/og/TrackCard'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * The share card, served from a route handler rather than from a file-based
 * `opengraph-image` under `[locale]`.
 *
 * Why: the file-based route generates a URL carrying the locale prefix
 * (`/en/track/<id>/opengraph-image-<hash>`), and next-intl runs with
 * `localePrefix: 'as-needed'`, so that prefixed URL answers 307 -> the unprefixed
 * one, which the hashed route does not serve. Every scraper was handed a redirect
 * to a 404. A route handler has one stable URL with no locale in it.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface PageProps {
	params: Promise<{ id: string }>
}

async function getTrack(id: string) {
	const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://app.doba.world/api-backend').replace(/\/$/, '')
	try {
		// A share card that waits on a dead API is a share card that never renders,
		// and a crawler gives up long before a default fetch timeout does.
		const res = await fetch(`${apiUrl}/songs/${id}`, {
			next: { revalidate: 60 },
			signal: AbortSignal.timeout(4000),
		})
		if (res.ok) return await res.json()
	} catch (e) {
		console.error('OG image: failed to fetch track', e)
	}
	return null
}

export async function GET(_request: Request, { params }: PageProps) {
	const { id } = await params
	const track = await getTrack(id)

	const [chivoBold, chivoRegular] = await Promise.all([
		readFile(join(process.cwd(), 'public/fonts/Chivo-Bold.ttf')),
		readFile(join(process.cwd(), 'public/fonts/Chivo-Regular.ttf')),
	])

	const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'
	const cover = track?.image_url ? track.image_url.replace('ipfs://', gateway) : null
	const title = track?.name || 'Track'
	const artist = track?.artist || 'Unknown Artist'
	const price = track?.price || '5'

	return new ImageResponse(
		TrackCard({ cover, title, artist, price }),
		{
			width: 1200,
			height: 630,
			headers: { 'Cache-Control': 'public, max-age=600, s-maxage=86400' },
			fonts: [
				{ name: 'Chivo', data: chivoBold, weight: 700, style: 'normal' },
				{ name: 'Chivo', data: chivoRegular, weight: 400, style: 'normal' },
			],
		}
	)
}
