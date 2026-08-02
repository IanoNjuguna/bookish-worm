import { logger } from '../../lib/logger'
import { deleteAllTracks } from '../src/database';

async function main() {
	logger.info('🗑️ Clearing tracks database...');
	try {
		await deleteAllTracks();
		logger.info('✅ Successfully removed all tracks from the database.');
	} catch (error) {
		logger.error('❌ Failed to remove tracks', error);
	} finally {
		process.exit(0);
	}
}

main();
