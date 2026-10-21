import type { DepthSnapshot, DepthUpdate, Level } from './types';

/**
 * Local order book, maintained the way Strike's docs require:
 * subscribe first, buffer deltas, fetch the snapshot, replay only the deltas past
 * `lastUpdateId`, then apply anything newer. ID gaps are normal and are not missed
 * messages; ids can also exceed Number.MAX_SAFE_INTEGER, so comparisons use BigInt.
 */
export class OrderBook {
  private bids = new Map<string, string>();
  private asks = new Map<string, string>();
  private lastId = 0n;
  private buffered: DepthUpdate[] = [];
  private snapshotApplied = false;

  reset() {
    this.bids.clear();
    this.asks.clear();
    this.lastId = 0n;
    this.buffered = [];
    this.snapshotApplied = false;
  }

  /** Snapshot can land after deltas have already started arriving. */
  applySnapshot(s: DepthSnapshot) {
    this.bids = new Map(s.bids.map(([p, q]) => [p, q]));
    this.asks = new Map(s.asks.map(([p, q]) => [p, q]));
    this.lastId = BigInt(s.lastUpdateId);
    this.snapshotApplied = true;

    const pending = this.buffered;
    this.buffered = [];
    for (const d of pending) this.applyUpdate(d);
  }

  applyUpdate(u: DepthUpdate) {
    if (!this.snapshotApplied) {
      if (this.buffered.length < 200) this.buffered.push(u);
      return;
    }
    const id = BigInt(u.u);
    if (id <= this.lastId) return;

    const apply = (target: Map<string, string>, levels: Level[]) => {
      for (const [p, q] of levels) {
        if (q === '0') target.delete(p);
        else target.set(p, q);
      }
    };
    // Some depth updates carry only one side; a missing array is not a removal.
    apply(this.bids, u.b ?? []);
    apply(this.asks, u.a ?? []);
    this.lastId = id;
  }

  get ready() {
    return this.snapshotApplied;
  }

  levels(depth = 14): { bids: Level[]; asks: Level[] } {
    const sortDesc = (m: Map<string, string>): Level[] =>
      [...m.entries()]
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .slice(0, depth)
        .map(([p, q]) => [p, q] as Level);

    const sortAsc = (m: Map<string, string>): Level[] =>
      [...m.entries()]
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .slice(0, depth)
        .map(([p, q]) => [p, q] as Level);

    return { bids: sortDesc(this.bids), asks: sortAsc(this.asks) };
  }

  /** Cumulative size up to each level, for the depth bars behind the rows. */
  static cumulative(levels: Level[]): number[] {
    let run = 0;
    return levels.map(([, q]) => (run += Number(q)));
  }
}
