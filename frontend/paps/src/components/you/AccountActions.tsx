import { useEffect, useState } from 'react';

/**
 * The two destructive actions, both in muted text rather than buttons that advertise
 * themselves. Reset is armed by the first tap and disarmed by four seconds of silence,
 * which is a confirm without a modal and without a toast.
 */
export function AccountActions({
  signedIn,
  onSignOut,
  onReset,
}: {
  signedIn: boolean;
  onSignOut: () => void;
  onReset: () => void;
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const id = window.setTimeout(() => setArmed(false), 4_000);
    return () => window.clearTimeout(id);
  }, [armed]);

  return (
    <div className="rounded-card border border-line bg-panel p-4">
      <div className="flex items-center justify-between gap-3">
        {signedIn ? (
          <button onClick={onSignOut} className="text-small text-muted hover:text-fg">
            sign out
          </button>
        ) : (
          <span className="text-small text-muted">this run lives in this browser</span>
        )}

        <button
          onClick={() => {
            if (armed) {
              setArmed(false);
              onReset();
            } else {
              setArmed(true);
            }
          }}
          className={armed ? 'text-small text-short' : 'text-small text-muted hover:text-fg'}
        >
          {armed ? 'reset everything?' : 'reset progress'}
        </button>
      </div>

      <p className="mt-2 text-small text-muted">
        Reset clears this account&rsquo;s stats, handle and starred markets. Tap again to
        confirm.
      </p>
    </div>
  );
}
