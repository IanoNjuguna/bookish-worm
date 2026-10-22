import { AgeBadge } from './AgeBadge';
import { IdentityMenu } from './IdentityMenu';
import type { useIdentity } from '../hooks/useIdentity';

/**
 * The top bar answers three questions and no market ones.
 *
 * What is this (paps), what kind of account is it (demo), and is the data still arriving
 * (the dot). The market facts deliberately live below it: the deck prints the symbol and
 * price on the card, the Trade tab prints them in its own header, and Positions prints
 * them per row. A second copy up here was duplication that cost the symbol its width —
 * it truncated at 390px while carrying nothing the screen below did not already say.
 */
export function TopBar({
  connected,
  lastAt,
  identity,
  identityOpen,
  onIdentityOpen,
}: {
  connected: boolean;
  lastAt: number;
  identity: ReturnType<typeof useIdentity>;
  identityOpen: boolean;
  onIdentityOpen: (open: boolean) => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4">
      <span className="text-title font-semibold tracking-tight text-fg">
        paps<span className="text-accent">.</span>
      </span>
      <span className="rounded-chip border border-line px-1.5 py-0.5 text-micro uppercase tracking-[0.1em] text-muted">
        demo
      </span>

      <span className="ml-auto flex shrink-0 items-center gap-2">
        <AgeBadge lastAt={lastAt} connected={connected} />
        <IdentityMenu identity={identity} open={identityOpen} onOpenChange={onIdentityOpen} />
      </span>
    </header>
  );
}
