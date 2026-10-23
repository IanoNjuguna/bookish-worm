import { useState } from 'react';
import { IconWallet, IconChevronDown } from '@tabler/icons-react';
import { cn } from '../lib/cn';
import { shortAddress, type Identity, type Profile } from '../lib/identity/types';
import type { useIdentity } from '../hooks/useIdentity';

type Props = {
  identity: ReturnType<typeof useIdentity>;
  /** Optional: lets another surface (the You tab) open the sheet. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const LEV = [2, 5, 10, 20, 50];
const RISK = [25, 50, 100, 250, 500];

/**
 * The identity chip: connect when anonymous, preferences when connected. Everything a
 * trader can personalise is here, because a settings page for six fields is a surface
 * nobody opens.
 */
export function IdentityMenu({ identity, open: openProp, onOpenChange }: Props) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = (next: boolean | ((v: boolean) => boolean)) => {
    const value = typeof next === 'function' ? next(open) : next;
    setOpenState(value);
    onOpenChange?.(value);
  };
  const {
    identity: me,
    profile,
    wallets,
    error,
    busy,
    connectStrike,
    connectStrikeUtxos,
    disconnect,
    update,
    utxosConfigured,
  } = identity;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-control border px-3 text-small transition-colors',
          me ? 'border-line bg-panel text-fg' : 'border-line bg-panel-2 text-fg hover:bg-panel-2/70',
        )}
      >
        <IconWallet size={13} />
        {/* On a phone the chip is an icon: the header has four facts to fit and this is
            the only element that can lose its label without losing its meaning. */}
        <span className="num normal-case tracking-normal">
          {me ? (profile.handle || shortAddress(me.address)) : 'connect'}
        </span>
        <IconChevronDown size={12} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-1 w-[268px] border border-line bg-panel shadow-2xl">
          {!me ? (
            <div>
              <div className="border-b border-line px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-muted">
                connect a wallet
              </div>
              {utxosConfigured && (
                <button
                  disabled={busy}
                  onClick={async () => {
                    await connectStrikeUtxos();
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between bg-brand/10 px-3 py-2.5 text-left text-[12px] text-brand hover:bg-brand/20"
                >
                  Continue with Google
                  <span className="text-[10px] uppercase tracking-[0.08em]">utxos</span>
                </button>
              )}

              <div className="border-t border-line px-3 py-1.5 text-[9px] uppercase tracking-[0.1em] text-muted">
                or a browser wallet
              </div>

              {wallets.length ? (
                wallets.map((w) => (
                  <button
                    key={w.id}
                    disabled={busy}
                    onClick={async () => {
                      await connectStrike(w.id);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-[12px] hover:bg-panel-2"
                  >
                    {w.name}
                    <span className="text-[10px] text-muted">sign in</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-3 text-small leading-relaxed text-muted">
                  {utxosConfigured
                    ? 'No browser wallet found on this device. Install Eternl, Lace or Nami, or use Continue with Google above.'
                    : 'No browser wallet found on this device. Install Eternl, Lace or Nami, then reload this page.'}
                </p>
              )}

              {error && <p className="border-t border-line px-3 py-2 text-[10px] text-short">{error}</p>}

              <p className="border-t border-line px-3 py-2 text-[10px] text-muted">
                Signing connects your wallet to Strike through the <span className="text-fg/70">paps</span> builder
                at 1% on top of Strike's taker fee. The signature itself cannot move funds.
                Orders are paper until you sign in; after that a swipe arms a real order that
                you confirm in two steps.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between border-b border-line px-3 py-2">
                <span className="num text-[11px]">{shortAddress(me.address)}</span>
                <span className="text-[10px] uppercase tracking-[0.08em] text-muted">
                  {me.accountId ? 'strike' : me.wallet}
                </span>
              </div>
              {me.accountId && (
                <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
                  <span className="text-[10px] text-muted">strike account</span>
                  <span className="num text-[10px]">{me.accountId.slice(0, 14)}…</span>
                </div>
              )}

              <Field label="handle">
                <input
                  value={profile.handle}
                  onChange={(e) => update({ handle: e.target.value.slice(0, 18) })}
                  placeholder="anon"
                  className="num w-full bg-panel-2 px-2 py-1 text-right text-[11px] outline-none"
                />
              </Field>

              <Field label="risk / swipe">
                <Chips values={RISK} current={profile.riskUsd} onPick={(v) => update({ riskUsd: v })} prefix="$" />
              </Field>

              <Field label="leverage">
                <Chips values={LEV} current={profile.leverage} onPick={(v) => update({ leverage: v })} suffix="×" />
              </Field>

              <Field label="opens on">
                <Chips
                  values={['pro', 'lite', 'swipe'] as const}
                  current={profile.defaultView}
                  onPick={(v) => update({ defaultView: v as Profile['defaultView'] })}
                />
              </Field>

              <Field label="watching">
                <span className="num text-[11px] text-muted">
                  {profile.watchlist.length ? profile.watchlist.length + ' markets' : 'nothing yet'}
                </span>
              </Field>

              <button
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
                className="w-full border-t border-line px-3 py-2 text-left text-[11px] text-muted hover:text-fg"
              >
                disconnect
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-1.5">
      <span className="text-[10px] uppercase tracking-[0.08em] text-muted">{label}</span>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}

function Chips<T extends number | string>({
  values,
  current,
  onPick,
  prefix = '',
  suffix = '',
}: {
  values: readonly T[];
  current: T;
  onPick: (v: T) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <>
      {values.map((v) => (
        <button
          key={String(v)}
          onClick={() => onPick(v)}
          className={cn(
            'num px-1.5 py-0.5 text-[10px] transition-colors',
            v === current ? 'bg-panel-2 text-fg' : 'text-muted hover:text-fg',
          )}
        >
          {prefix}
          {String(v)}
          {suffix}
        </button>
      ))}
    </>
  );
}

export type { Identity, Profile };
