import { getAllTracks } from '../src/database';
async function main() {
	const tracks = await getAllTracks();
	console.log('---CHECK_RESULT---');
	console.log('Tracks count:', tracks.length);
	console.log('---CHECK_RESULT---');
	process.exit(0);
}
main();
