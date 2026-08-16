import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'
export const alt = 'doba track share card'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface PageProps {
	params: Promise<{ id: string; locale: string }>
}

async function getTrack(id: string) {
	const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://bookish-worm-production.up.railway.app').replace(/\/$/, '')
	try {
		const res = await fetch(`${apiUrl}/songs/${id}`, {
			next: { revalidate: 60 },
		})
		if (res.ok) return await res.json()
	} catch (e) {
		console.error('OG image: failed to fetch track', e)
	}
	return null
}

export default async function Image({ params }: PageProps) {
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
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					background: 'linear-gradient(135deg, #0D0D12 0%, #141419 100%)',
					padding: 64,
					fontFamily: 'Chivo',
				}}
			>
				{/* Ambient orbs (brand background recipe) */}
				<div
					style={{
						position: 'absolute',
						top: -160,
						left: 320,
						width: 560,
						height: 560,
						borderRadius: 9999,
						background: 'rgba(255, 31, 138, 0.10)',
						display: 'flex',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						bottom: -200,
						right: -80,
						width: 480,
						height: 480,
						borderRadius: 9999,
						background: 'rgba(183, 148, 244, 0.08)',
						display: 'flex',
					}}
				/>

				{/* Cover */}
				{cover ? (
					<img
						src={cover}
						alt={title}
						width={440}
						height={440}
						style={{ borderRadius: 24, objectFit: 'cover', flexShrink: 0 }}
					/>
				) : (
					<div
						style={{
							width: 440,
							height: 440,
							borderRadius: 24,
							background: 'rgba(255, 255, 255, 0.04)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 120,
							fontWeight: 700,
							color: '#FF1F8A',
							flexShrink: 0,
						}}
					>
						doba
					</div>
				)}

				{/* Text block */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						marginLeft: 64,
						flex: 1,
						minWidth: 0,
					}}
				>
					<div
						style={{
							display: 'flex',
							fontSize: 28,
							fontWeight: 700,
							color: '#FF1F8A',
							letterSpacing: 2,
							marginBottom: 24,
						}}
					>
						doba
					</div>
					<div
						style={{
							display: 'flex',
							fontSize: 64,
							fontWeight: 700,
							color: '#FFFFFF',
							lineHeight: 1.1,
							marginBottom: 16,
							maxHeight: 220,
							overflow: 'hidden',
						}}
					>
						{title}
					</div>
					<div
						style={{
							display: 'flex',
							fontSize: 32,
							fontWeight: 400,
							color: '#B794F4',
							marginBottom: 40,
							maxHeight: 96,
							overflow: 'hidden',
						}}
					>
						{artist}
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							fontSize: 26,
							fontWeight: 700,
							color: 'rgba(255, 255, 255, 0.6)',
						}}
					>
						Collect for {price} ADA
					</div>
				</div>
			</div>
		),
		{
			...size,
			fonts: [
				{ name: 'Chivo', data: chivoBold, weight: 700, style: 'normal' },
				{ name: 'Chivo', data: chivoRegular, weight: 400, style: 'normal' },
			],
		}
	)
}
