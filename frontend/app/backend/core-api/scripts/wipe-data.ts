import { logger } from '../src/lib/logger'
import { getAllTracks, deleteAllTracks } from '../src/database'
import axios from 'axios'

const PINATA_JWT = process.env.PINATA_JWT?.trim()

async function unpinFromPinata(hash: string) {
	if (!PINATA_JWT) return
	if (!hash || hash === 'READY' || hash.length < 10) return

	try {
		logger.debug(`[IPFS] Unpinning ${hash}...`)
		await axios.delete(`https://api.pinata.cloud/pinning/unpin/${hash}`, {
			headers: { Authorization: `Bearer ${PINATA_JWT}` }
		})
		logger.info(`[IPFS] Successfully unpinned ${hash}`)
	} catch (error: any) {
		if (error.response?.status === 404) {
			logger.warn(`[IPFS] Hash ${hash} not found or already unpinned.`)
		} else {
			logger.error(`[IPFS] Failed to unpin ${hash}`, error.response?.data || error.message)
		}
	}
}

function extractCID(url: string | undefined): string | null {
	if (!url) return null
	if (url.startsWith('ipfs://')) return url.replace('ipfs://', '').split('/')[0]
	if (url.includes('/ipfs/')) return url.split('/ipfs/')[1].split('/')[0]
	return null
}

async function main() {
	logger.info('🚀 Starting full data wipe...')

	try {
		const tracks = await getAllTracks()
		logger.info(`Found ${tracks.length} tracks to process.`)

		const cidsToUnpin = new Set<string>()

		for (const track of tracks) {
			const audioCID = extractCID(track.audio_url)
			const imageCID = extractCID(track.image_url)
			const metaCID = extractCID(track.external_url)

			if (audioCID) cidsToUnpin.add(audioCID)
			if (imageCID) cidsToUnpin.add(imageCID)
			if (metaCID) cidsToUnpin.add(metaCID)
		}

		logger.info(`Collected ${cidsToUnpin.size} unique IPFS CIDs.`)

		// 1. Unpin from Pinata
		for (const cid of cidsToUnpin) {
			await unpinFromPinata(cid)
		}

		// 2. Clear Database
		logger.info('Cleaning database tables...')
		const { default: db } = await import('../src/database')

		await db.execute('DELETE FROM collaborators')
		await db.execute('DELETE FROM plays')
		await db.execute('DELETE FROM mints')
		await db.execute('DELETE FROM tracks')

		logger.info('✅ Full data wipe complete.')
	} catch (error) {
		logger.error('❌ Wipe failed', error)
	} finally {
		process.exit(0)
	}
}

main()
