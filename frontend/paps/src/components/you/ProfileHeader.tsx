import { useEffect, useRef, useState } from 'react';
import { shortAddress } from '../../lib/identity/types';
import type { Tier } from '../../lib/progress';

/**
 * The face of the account: one initial, one name, one fact, one chip. The name is the
 * only thing here that can be edited, so it is edited where it is read — no dialog.
 * An empty handle falls back to the address, because that is the only alias a trader
 * actually recognises.
 */
export function ProfileHeader({
  handle,
  address,
  wallet,
  tier,
  onRename,
  onConnect,
}: {
  handle: string;
  address: string | null;
  wallet: string | null;
  tier: Tier;
  onRename: (patch: { handle: string }) => void;
  onConnect: () => void;
}) {
  const [draft, setDraft] = useState(handle);
  const skipCommit = useRef(false);

  // Another surface (the identity menu) can rename too; the field must follow it.
  useEffect(() => setDraft(handle), [handle]);

  const fallback = address ? shortAddress(address) : 'guest';
  const initial = (handle.trim() || address || 'g').charAt(0).toUpperCase();

  const commit = () => {
    if (skipCommit.current) {
      skipCommit.current = false;
      return;
    }
    const next = draft.trim().slice(0, 18);
    setDraft(next);
    if (next !== handle) onRename({ handle: next });
  };

  return (
    <div className="rounded-card border border-line bg-panel p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-panel-2">
          <span className="num text-title text-fg">{initial}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <input
              aria-label="handle"
              value={draft}
              maxLength={18}
              placeholder={fallback}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  commit();
                  e.currentTarget.blur();
                }
                if (e.key === 'Escape') {
                  skipCommit.current = true;
                  setDraft(handle);
                  e.currentTarget.blur();
                }
              }}
              className="num min-w-0 flex-1 bg-transparent text-title text-fg outline-none placeholder:text-muted"
            />
            <span className="shrink-0 rounded-chip bg-panel-2 px-2 py-0.5 text-small text-fg">
              {tier.name}
            </span>
          </div>

          <p className="mt-1 truncate text-small text-muted">
            paper account · {wallet ?? 'guest'}
          </p>

          {!address && (
            <button
              onClick={onConnect}
              className="mt-1 text-small text-fg/80 underline-offset-2 hover:text-fg hover:underline"
            >
              sign in to keep this run
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
