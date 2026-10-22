import { useEffect, useState } from 'react';
import { readVenue } from '../lib/strike/venue';
import { IDLE, VenueClient, type VenueState } from '../lib/strike/venue-client';

export const POLL_MS = 30_000;

/**
 * The venue's account, positions and history for a connected session.
 *
 * With no session this stays `idle` and the paper ledger is what the surfaces render. With
 * one, every number here came from the venue: a read that fails leaves the previous numbers
 * in place and marks them stale, and a 401 stops the poll instead of hammering a dead key.
 */
export function useVenueAccount(session: boolean): VenueState {
  const [state, setState] = useState<VenueState>(IDLE);

  useEffect(() => {
    if (!session) {
      setState(IDLE);
      return;
    }

    let alive = true;
    const client = new VenueClient({
      read: readVenue,
      pollMs: POLL_MS,
      onChange: (next) => {
        if (alive) setState(next);
      },
    });

    client.start();

    // Coming back to a tab that slept should not show hour-old money.
    const onFocus = () => void client.refresh();
    window.addEventListener('focus', onFocus);

    return () => {
      alive = false;
      window.removeEventListener('focus', onFocus);
      client.stop();
    };
  }, [session]);

  return state;
}
