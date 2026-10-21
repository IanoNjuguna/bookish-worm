import { useState } from 'react';
import { IconWallet, IconChevronDown } from '@tabler/icons-react';
import { cn } from '../lib/cn';
import { shortAddress, type Identity, type Profile } from '../lib/identity/types';
import type { useIdentity } from '../hooks/useIdentity';

type Props = { identity: ReturnType<typeof useIdentity> };

const LEV = [2, 5, 10, 20, 50];
const RISK = [25, 50, 100, 250, 500];

/**
 * The identity chip: connect when anonymous, preferences when connected. Everything a
 * trader can personalise is here, because a settings page for six fields is a surface
 * nobody opens.
 */
export function IdentityMenu({ identity }: Props) {
  const [open, setOpen] = useState(false);
  const { identity: me, profile, wallets, error, busy, connect, connectWithUtxos, disconnect, update, utxosConfigured } =
    identity;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 border px-2 py-1 text-[10px] uppercase tracking-[0.08em] transition-colors',
          me ? 'border-line text-fg/80 hover:text-fg' : 'border-brand/50 text-brand hover:bg-brand/10',
        )}
      >
        <IconWallet size={12} />
        <span className="num normal-case tracking-normal">
          {me ? (profile.handle || shortAddress(me.address)) : 'connect'}
        </span>
        <IconChevronDown size={11} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-1 w-[268px] border border-line bg-panel shadow-2xl">
          {!me ? (
            <div>
              <div className="border-b border-line px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-muted">
                connect a wallet
              </div>
              {wallets.length ? (
                wallets.map((w) => (
                  <button
                    key={w.id}
                    disabled={busy}
                    onClick={async () => {
                      await connect(w.id);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-[12px] hover:bg-panel-2"
                  >
                    {w.name}
                    <span className="text-[10px] text-muted">cip-30</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-3 text-[11px] text-muted">
                  No browser wallet found. Install Eternl, Lace or Nami, or use UTXOS below.
                </p>
              )}

              <button
                disabled={busy || !utxosConfigured}
                onClick={async () => {
                  await connectWithUtxos();
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between border-t border-line px-3 py-2 text-left text-[12px]',
                  utxosConfigured ? 'hover:bg-panel-2' : 'text-muted',
                )}
              >
                utxos.dev
                <span className="text-[10px] text-muted">
                  {utxosConfigured ? 'social login' : 'needs project id'}
                </span>
              </button>

              {error && <p className="border-t border-line px-3 py-2 text-[10px] text-short">{error}</p>}

              <p className="border-t border-line px-3 py-2 text-[10px] text-muted">
                Connecting identifies you. It cannot move funds: orders here are paper.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between border-b border-line px-3 py-2">
                <span className="num text-[11px]">{shortAddress(me.address)}</span>
                <span className="text-[10px] uppercase tracking-[0.08em] text-muted">{me.wallet}</span>
              </div>

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
