import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VenueError, normaliseAccount, normalisePositions, type VenueData } from './venue';
import { IDLE, VenueClient, shouldPoll, venueReducer, type VenueState } from './venue-client';
import { accountFixture, positionsFixture } from './venue.fixtures';

const data = (): VenueData => ({
  account: normaliseAccount(accountFixture),
  positions: normalisePositions(positionsFixture),
  orders: [],
  funding: [],
  transactions: [],
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('venue reads while the venue is healthy', () => {
  it('goes loading, then live, and records when the numbers were read', async () => {
    const client = new VenueClient({ read: async () => data(), now: () => 1_000 });
    client.start();

    expect(client.current().status).toBe('loading');
    await vi.advanceTimersByTimeAsync(0);
    expect(client.current().status).toBe('live');
    expect(client.current().lastAt).toBe(1_000);
    expect(client.current().data?.positions).toHaveLength(2);
    client.stop();
  });

  it('polls on the interval it was given', async () => {
    const read = vi.fn(async () => data());
    const client = new VenueClient({ read, pollMs: 30_000 });
    client.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(read).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(30_000);
    expect(read).toHaveBeenCalledTimes(2);
    client.stop();
  });
});

describe('a refresh that fails', () => {
  it('keeps the last numbers, marks them stale, and keeps their age', async () => {
    let calls = 0;
    let now = 10_000;
    const read = async (): Promise<VenueData> => {
      calls += 1;
      if (calls === 1) return data();
      throw new Error('strike 502 bad_gateway');
    };

    const client = new VenueClient({ read, pollMs: 30_000, now: () => now });
    client.start();
    await vi.advanceTimersByTimeAsync(0);

    const live = client.current();
    expect(live.status).toBe('live');
    expect(live.lastAt).toBe(10_000);

    now = 40_000;
    await vi.advanceTimersByTimeAsync(30_000);

    const stale = client.current();
    expect(stale.status).toBe('stale');
    // The same numbers, still on screen, with the age they were read at.
    expect(stale.data).toBe(live.data);
    expect(stale.lastAt).toBe(10_000);
    expect(stale.error).toContain('502');
    client.stop();
  });

  it('recovers on the next interval, because a 502 is not a dead session', async () => {
    let calls = 0;
    const read = async (): Promise<VenueData> => {
      calls += 1;
      if (calls === 2) throw new Error('strike 502 bad_gateway');
      return data();
    };

    const client = new VenueClient({ read, pollMs: 30_000 });
    client.start();
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(30_000);
    expect(client.current().status).toBe('stale');

    await vi.advanceTimersByTimeAsync(30_000);
    expect(client.current().status).toBe('live');
    expect(calls).toBe(3);
    client.stop();
  });
});

describe('a 401 reconnect', () => {
  it('reports reconnect and stops polling instead of looping on a dead key', async () => {
    const read = vi.fn(async (): Promise<VenueData> => {
      throw new VenueError(401, 'reconnect');
    });
    const client = new VenueClient({ read, pollMs: 30_000 });
    client.start();
    await vi.advanceTimersByTimeAsync(0);

    expect(client.current().status).toBe('reconnect');
    expect(read).toHaveBeenCalledTimes(1);
    // No timer left behind, so there is nothing to fire in ten minutes' time.
    expect(vi.getTimerCount()).toBe(0);

    await vi.advanceTimersByTimeAsync(600_000);
    expect(read).toHaveBeenCalledTimes(1);

    // A window focus lands while the session is dead: still not a reason to retry.
    await client.refresh();
    expect(read).toHaveBeenCalledTimes(1);
    client.stop();
  });

  it('keeps the numbers it already had, so the screen is not blanked by a dead key', async () => {
    let calls = 0;
    const read = async (): Promise<VenueData> => {
      calls += 1;
      if (calls === 1) return data();
      throw new VenueError(401, 'reconnect');
    };

    const client = new VenueClient({ read, pollMs: 30_000 });
    client.start();
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(30_000);

    expect(client.current().status).toBe('reconnect');
    expect(client.current().data?.account.marginBalance).toBe('1222.13');
    expect(client.current().lastAt).toBeGreaterThan(0);
    client.stop();
  });
});

describe('the read state machine', () => {
  it('does not fall back to a loading state once it has numbers', () => {
    const live = venueReducer(IDLE, { type: 'ok', data: data(), at: 5_000 });
    expect(venueReducer(live, { type: 'start' })).toBe(live);
  });

  it('a failure never clears data or moves lastAt', () => {
    const live = venueReducer(IDLE, { type: 'ok', data: data(), at: 5_000 });
    const stale = venueReducer(live, { type: 'fail', error: 'boom', reconnect: false });

    expect(stale.status).toBe('stale');
    expect(stale.data).toBe(live.data);
    expect(stale.lastAt).toBe(5_000);
  });

  it('only a reconnect stops the poll', () => {
    const live: VenueState = venueReducer(IDLE, { type: 'ok', data: data(), at: 5_000 });

    expect(shouldPoll(live)).toBe(true);
    expect(shouldPoll(venueReducer(live, { type: 'fail', error: '502', reconnect: false }))).toBe(true);
    expect(shouldPoll(venueReducer(live, { type: 'fail', error: '401', reconnect: true }))).toBe(false);
  });
});
