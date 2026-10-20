/**
 * Backfill the chain money for collects recorded before it was captured.
 *
 *   TURSO_URL=... BLOCKFROST_PROJECT_ID=... bun run scripts/backfill-collects.ts
 *
 * Idempotent: it only looks at rows where price_lovelace IS NULL, and re-running
 * after a success finds nothing. Anything that cannot be read stays NULL and is
 * reported, rather than being guessed at from tracks.price.
 */
import { getCollectAmounts } from '../src/collects';
import { getUnpricedMints, recordEvent, setMintAmounts } from '../src/database';

const rows = await getUnpricedMints();
console.log(`unpriced collects: ${rows.length}`);

let priced = 0;
let failed = 0;

for (const row of rows) {
  try {
    const amounts = await getCollectAmounts(row.tx_hash, row.user_address);
    await setMintAmounts(row.user_address, row.track_id, amounts);
    const fee = amounts.feeLovelace === null ? 'unknown' : `${(amounts.feeLovelace / 1e6).toFixed(2)} ADA`;
    const price = amounts.priceLovelace === null ? 'unknown' : `${(amounts.priceLovelace / 1e6).toFixed(2)} ADA`;
    console.log(`${row.user_address.slice(0, 12)}… track ${row.track_id}  price ${price}  fee ${fee}`);
    priced += 1;
  } catch (error: any) {
    failed += 1;
    console.log(`${row.user_address.slice(0, 12)}… track ${row.track_id}  FAILED: ${error?.message ?? error}`);
    await recordEvent('collect_unpriced', row.tx_hash, String(error?.message ?? error));
  }
  // Blockfrost rate limits hurt more than the wall clock here.
  await new Promise((r) => setTimeout(r, 300));
}

console.log(`done: ${priced} priced, ${failed} failed, ${rows.length - priced - failed} skipped`);
