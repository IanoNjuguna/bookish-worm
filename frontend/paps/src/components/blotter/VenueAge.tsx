import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';
import type { VenueState } from '../../lib/strike/venue-client';

/**
 * Age of the venue read, not a green dot.
 *
 * A balance that is four minutes old is still useful; a balance that pretends to be
 * current is not. Past the poll interval the label turns to the short colour and says
 * stale, and a dead session says reconnect instead of an age that keeps growing.
 */
export function VenueAge({ state }: { state: VenueState }) {
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 5_000);
    return () => clearInterval(id);
  }, []);

  if (state.status === 'reconnect') {
    return <span className="text-micro lowercase text-short">reconnect needed</span>;
  }
  if (!state.lastAt) {
    return <span className="text-micro lowercase text-muted">reading…</span>;
  }

  const age = Math.max(0, Math.round((Date.now() - state.lastAt) / 1000));
  const label = age < 5 ? 'just now' : age < 60 ? `${age}s ago` : `${Math.round(age / 60)}m ago`;
  const late = state.status === 'stale';

  return (
    <span className={cn('num text-micro lowercase', late ? 'text-short' : 'text-muted')}>
      {late ? `stale · ${label}` : `updated ${label}`}
    </span>
  );
}
