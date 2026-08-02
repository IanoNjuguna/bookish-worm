import { logger } from '../src/lib/logger'
import { getAllTracks, deleteAllTracks } from '../src/database'
import axios from 'axios'
import { Storage } from '@google-cloud/storage'
const storage = new Storage()
const PINATA_JWT = process.env.PINATA_JWT?.trim()
const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'doba-music-streaming'

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

async function deleteFromGCS(filename: string) {
	if (!filename) return
	try {
		const bucket = storage.bucket(BUCKET_NAME)
		const file = bucket.file(filename)
		const [exists] = await file.exists()
		if (exists) {
			logger.debug(`[GCS] Deleting ${filename}...`)
			await file.delete()
			logger.info(`[GCS] Successfully deleted ${filename}`)
		}
	} catch (error: any) {
		logger.error(`[GCS] Failed to delete ${filename}`, error.message)
	}
}

function extractCID(url: string | undefined): string | null {
	if (!url) return null
	if (url.startsWith('ipfs://')) return url.replace('ipfs://', '').split('/')[0]
	if (url.includes('/ipfs/')) return url.split('/ipfs/')[1].split('/')[0]
	return null
}

function extractGCSFilename(url: string | undefined): string | null {
	if (!url) return null
	if (url.includes(`storage.googleapis.com/${BUCKET_NAME}/`)) {
		return url.split(`storage.googleapis.com/${BUCKET_NAME}/`)[1]
	}
	return null
}

async function main() {
	logger.info('🚀 Starting full data wipe...')

	try {
		const tracks = await getAllTracks()
		logger.info(`Found ${tracks.length} tracks to process.`)

		const cidsToUnpin = new Set<string>()
		const gcsFilesToDelete = new Set<string>()

		for (const track of tracks) {
			const audioCID = extractCID(track.audio_url)
			const imageCID = extractCID(track.image_url)

			// Also check external_url which might contain metadata CID
			const metaCID = extractCID(track.external_url)

			if (audioCID) cidsToUnpin.add(audioCID)
			if (imageCID) cidsToUnpin.add(imageCID)
			if (metaCID) cidsToUnpin.add(metaCID)

			const gcsFile = extractGCSFilename(track.streaming_url)
			if (gcsFile) gcsFilesToDelete.add(gcsFile)
		}

		logger.info(`Collected ${cidsToUnpin.size} unique IPFS CIDs and ${gcsFilesToDelete.size} GCS files.`)

		// 1. Unpin from Pinata
		for (const cid of cidsToUnpin) {
			await unpinFromPinata(cid)
		}

		// 2. Delete from GCS
		for (const file of gcsFilesToDelete) {
			await deleteFromGCS(file)
		}

		// 3. Clear Database
		logger.info('Cleaning database tables...')
		// We import the direct db client to run truncate/delete on all tables
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
