import { useState } from 'react';
import { cn } from '../../lib/cn';
import { availableWallets } from '../../lib/identity/cip30';
import { depositBlocked } from '../../lib/deposit/wallet';
import { DepositSheet } from './DepositSheet';
import type { DepositEntryProps } from './DepositSheet.types';

/**
 * Where the deposit starts: one row in the account, and the sheet behind it.
 *
 * It is gated rather than hopeful. With no browser wallet there is nothing this flow could do, so
 * the row is not drawn at all; with a wallet but no strike session, or a session that came from
 * the embedded wallet, the row is drawn disabled and says which of those it is. A button that
 * opens a sheet that cannot proceed is worse than no button.
 *
 * The You tab is the choice of home: a deposit is an account action, the session already lives
 * here, and the identity popover in the header is 268px of fields that closes on an outside
 * click, which is the wrong container for a four step money flow.
 */
export function DepositEntry({ identity, onReconnect }: DepositEntryProps) {
  const [open, setOpen] = useState(false);
  const [wallets] = useState(() => availableWallets());
  const blocked = depositBlocked(identity);

  if (wallets.length === 0) return null;

  return (
    <section className="rounded-card border border-line bg-panel p-4" aria-label="deposit">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-body text-fg">deposit ada</p>
          <p className="mt-0.5 text-small leading-snug text-muted">
            {blocked ?? 'send ada to strike from this wallet, then trade it.'}
          </p>
        </div>
        <button
          type="button"
          disabled={blocked !== null}
          onClick={() => setOpen(true)}
          className={cn(
            'shrink-0 rounded-control px-4 py-2.5 text-body',
            blocked
              ? 'border border-line text-muted opacity-40'
              : 'bg-accent font-medium text-canvas',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel',
          )}
        >
          deposit
        </button>
      </div>

      <DepositSheet
        open={open}
        onClose={() => setOpen(false)}
        identity={identity}
        onReconnect={onReconnect}
      />
    </section>
  );
}
