import { useCallback, useEffect, useRef, useState } from 'react';
import { readVenue } from '../lib/strike/venue';
import { IDLE, VenueClient, type VenueState } from '../lib/strike/venue-client';

export const POLL_MS = 30_000;

export type VenueSession = {
  state: VenueState;
  /** Read now. A placement or a cancel calls this instead of waiting out the poll. */
  refresh: () => void;
};

/**
 * The venue's account, positions and history for a connected session.
 *
 * With no session this stays `idle` and the paper ledger is what the surfaces render. With
 * one, every number here came from the venue: a read that fails leaves the previous numbers
 * in place and marks them stale, and a 401 stops the poll instead of hammering a dead key.
 */
export function useVenueAccount(session: boolean): VenueSession {
  const [state, setState] = useState<VenueState>(IDLE);
  const client = useRef<VenueClient | null>(null);

  useEffect(() => {
    if (!session) {
      setState(IDLE);
      return;
    }

    let alive = true;
    const next = new VenueClient({
      read: readVenue,
      pollMs: POLL_MS,
      onChange: (s) => {
        if (alive) setState(s);
      },
    });
    client.current = next;
    next.start();

    // Coming back to a tab that slept should not show hour-old money.
    const onFocus = () => void next.refresh();
    window.addEventListener('focus', onFocus);

    return () => {
      alive = false;
      client.current = null;
      window.removeEventListener('focus', onFocus);
      next.stop();
    };
  }, [session]);

  const refresh = useCallback(() => {
    void client.current?.refresh();
  }, []);

  return { state, refresh };
}
