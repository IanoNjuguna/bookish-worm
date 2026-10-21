import { describe, expect, it } from 'vitest';
import { OrderBook } from './book';

const snap = (id: number) => ({
  lastUpdateId: id,
  E: 0,
  T: 0,
  bids: [['10.00', '1'], ['9.99', '2']] as [string, string][],
  asks: [['10.01', '1'], ['10.02', '2']] as [string, string][],
});

describe('OrderBook', () => {
  it('applies a snapshot in the documented order', () => {
    const book = new OrderBook();
    book.applySnapshot(snap(100));
    const { bids, asks } = book.levels();
    expect(bids[0][0]).toBe('10.00');
    expect(asks[0][0]).toBe('10.01');
  });

  it('buffers deltas that arrive before the snapshot and replays the newer ones', () => {
    const book = new OrderBook();
    book.applyUpdate({ e: 'depthUpdate', s: 'X', u: 99, b: [['9.98', '5']], a: [] });
    book.applyUpdate({ e: 'depthUpdate', s: 'X', u: 101, b: [['10.00', '0']], a: [] });
    book.applySnapshot(snap(100));
    const { bids } = book.levels();
    expect(bids.map((b) => b[0])).not.toContain('10.00'); // replayed the removal
    expect(bids.map((b) => b[0])).not.toContain('9.98'); // older than the snapshot
  });

  it('ignores stale updates and tolerates a missing side', () => {
    const book = new OrderBook();
    book.applySnapshot(snap(100));
    book.applyUpdate({ e: 'depthUpdate', s: 'X', u: 100, b: [['1.00', '1']], a: [] });
    book.applyUpdate({ e: 'depthUpdate', s: 'X', u: 102, b: undefined as never, a: [['10.03', '7']] });
    const { bids, asks } = book.levels();
    expect(bids.map((b) => b[0])).not.toContain('1.00');
    expect(asks.map((a) => a[0])).toContain('10.03');
  });

  it('compares ids above Number.MAX_SAFE_INTEGER without losing precision', () => {
    const book = new OrderBook();
    book.applySnapshot({ ...snap(Number.MAX_SAFE_INTEGER), lastUpdateId: '9007199254740993' });
    book.applyUpdate({ e: 'depthUpdate', s: 'X', u: '9007199254740992', b: [['1.00', '1']], a: [] });
    expect(book.levels().bids.map((b) => b[0])).not.toContain('1.00');
  });
});
