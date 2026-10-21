/**
 * Proves the book logic against the live feed, outside React.
 *   bun run scripts/book-check.ts
 */
import { OrderBook } from '../src/lib/book';

const REST = 'https://api.strikefinance.org/price/v2';
const WS = 'wss://api.strikefinance.org/ws/price';
const symbol = process.argv[2] ?? 'ADA-USD';

const book = new OrderBook();
const ws = new WebSocket(WS);
let updates = 0;
let skipped = 0;

ws.onopen = () => {
  ws.send(JSON.stringify({ id: Date.now(), method: 'subscribe', channel: 'depth', symbol: symbol.toLowerCase() }));

  const snap = await_fetch();
  async function await_fetch() {
    const r = await fetch(`${REST}/depth?symbol=${symbol}&limit=100`);
    const json = await r.json();
    console.log('snapshot lastUpdateId', json.lastUpdateId, 'bids', json.bids.length, 'asks', json.asks.length);
    console.log('  snapshot best bid', json.bids[0], 'best ask', json.asks[0]);
    book.applySnapshot(json);
    return json;
  }
};

ws.onmessage = (ev) => {
  const msg = JSON.parse(String(ev.data));
  if (msg.e !== 'depthUpdate') return;
  updates++;
  const before = book.levels(1);
  book.applyUpdate(msg);
  const after = book.levels(1);
  if (updates <= 3) {
    console.log(
      `update #${updates} u=${msg.u} b=${JSON.stringify(msg.b.slice(0, 2))} a=${JSON.stringify(msg.a.slice(0, 2))}`,
    );
    console.log('  best bid before/after', before.bids[0]?.[0], '->', after.bids[0]?.[0], '| best ask', before.asks[0]?.[0], '->', after.asks[0]?.[0]);
  }
};

setTimeout(() => {
  const { bids, asks } = book.levels(3);
  console.log(`\nafter ${updates} updates and ${skipped} skipped:`);
  console.log('  top bids', bids.map((b) => b[0]).join(' '));
  console.log('  top asks', asks.map((a) => a[0]).join(' '));
  const crossed = Number(bids[0][0]) >= Number(asks[0][0]);
  console.log(crossed ? '  CROSSED BOOK — bug' : '  book is uncrossed — correct');
  process.exit(0);
}, 6000);
