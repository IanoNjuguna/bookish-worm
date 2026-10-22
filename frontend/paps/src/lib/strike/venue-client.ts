import { isReconnect, type VenueData } from './venue';

/**
 * The read state machine behind `useVenueAccount`.
 *
 * It is deliberately framework-free: the polling rules (never blank on error, never retry a
 * dead session, keep the last numbers and age them) are the part worth testing, and they
 * are easier to prove without a React tree around them.
 */

export type VenueStatus = 'idle' | 'loading' | 'live' | 'stale' | 'reconnect';

export type VenueState = {
  status: VenueStatus;
  data: VenueData | null;
  /** When the numbers on screen were read, Unix ms. 0 until the first success. */
  lastAt: number;
  error: string | null;
};

export const IDLE: VenueState = { status: 'idle', data: null, lastAt: 0, error: null };

export type VenueAction =
  | { type: 'start' }
  | { type: 'ok'; data: VenueData; at: number }
  | { type: 'fail'; error: string; reconnect: boolean };

/**
 * A failed read never clears `data` or moves `lastAt`: the previous numbers stay on screen
 * with their age, which is the only honest way to show a value we could not refresh.
 */
export function venueReducer(state: VenueState, action: VenueAction): VenueState {
  switch (action.type) {
    case 'start':
      return state.data ? state : { ...state, status: 'loading' };

    case 'ok':
      return { status: 'live', data: action.data, lastAt: action.at, error: null };

    case 'fail':
      return {
        ...state,
        status: action.reconnect ? 'reconnect' : 'stale',
        error: action.error,
      };
  }
}

/**
 * A 401 is terminal: the sealed key behind the session is gone, and polling it again only
 * burns requests. Everything else may recover on the next tick.
 */
export const shouldPoll = (state: VenueState): boolean => state.status !== 'reconnect';

export type VenueReader = (signal?: AbortSignal) => Promise<VenueData>;

export type VenueClientOptions = {
  read: VenueReader;
  pollMs?: number;
  now?: () => number;
  onChange?: (state: VenueState) => void;
};

export class VenueClient {
  private state: VenueState = IDLE;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;
  private inFlight = false;

  constructor(private readonly options: VenueClientOptions) {}

  current(): VenueState {
    return this.state;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    void this.refresh();
  }

  stop(): void {
    this.running = false;
    this.clear();
  }

  async refresh(): Promise<void> {
    if (!this.running || this.inFlight || !shouldPoll(this.state)) return;
    this.inFlight = true;
    this.apply({ type: 'start' });

    try {
      const data = await this.options.read();
      this.apply({ type: 'ok', data, at: this.at() });
    } catch (e) {
      this.apply({
        type: 'fail',
        error: e instanceof Error ? e.message : 'read failed',
        reconnect: isReconnect(e),
      });
    } finally {
      this.inFlight = false;
      this.schedule();
    }
  }

  private at(): number {
    return this.options.now?.() ?? Date.now();
  }

  private apply(action: VenueAction): void {
    this.state = venueReducer(this.state, action);
    this.options.onChange?.(this.state);
  }

  private clear(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }

  private schedule(): void {
    this.clear();
    if (!this.running || !shouldPoll(this.state)) return;
    this.timer = setTimeout(() => void this.refresh(), this.options.pollMs ?? 30_000);
  }
}
