import { createClient } from '@libsql/client'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

async function main() {
	const url = process.env.TURSO_URL
	const authToken = process.env.TURSO_AUTH_TOKEN

	if (!url || !authToken) {
		console.error('Missing TURSO_URL or TURSO_AUTH_TOKEN in .env')
		process.exit(1)
	}

	const db = createClient({ url, authToken })

	try {
		console.log('Connecting to Turso DB to clear legacy tracks (token_id < 10000)...')

		// Delete mints referencing legacy tracks
		const mintsResult = await db.execute('DELETE FROM mints WHERE track_id < 10000')
		console.log(`Deleted ${mintsResult.rowsAffected} legacy mints.`)

		// Delete collaborators referencing legacy tracks
		const collabsResult = await db.execute('DELETE FROM collaborators WHERE track_id < 10000')
		console.log(`Deleted ${collabsResult.rowsAffected} legacy collaborators.`)

		// Delete the tracks themselves
		const tracksResult = await db.execute('DELETE FROM tracks WHERE token_id < 10000')
		console.log(`Deleted ${tracksResult.rowsAffected} legacy tracks.`)

		console.log('Successfully cleared all legacy tracks from the database.')
	} catch (error) {
		console.error('Failed to clear database:', error)
	}
}

main()
