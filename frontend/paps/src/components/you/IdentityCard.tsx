import { shortAddress, type Identity } from '../../lib/identity/types';

/**
 * Who you are, in one line each: the wallet, the Strike account it unlocked, and what
 * that account is. No ids on the surface — an address is the only thing a person
 * recognises, and the rest belongs behind a tap.
 */
export function IdentityCard({
  me,
  onConnect,
  onDisconnect,
}: {
  me: Identity | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  if (!me) {
    return (
      <div className="rounded-2xl border border-line bg-panel p-4">
        <p className="text-[13px] text-fg">You are trading as a guest.</p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">
          This run lives in this browser. Sign in to keep it when you switch device.
        </p>
        <button
          onClick={onConnect}
          className="mt-3 w-full rounded-xl bg-brand px-4 py-2.5 text-[13px] font-medium text-canvas"
        >
          Keep this run
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] text-fg">{me.wallet}</p>
          <p className="num mt-0.5 truncate text-[11px] text-muted">{shortAddress(me.address)}</p>
        </div>
        <button onClick={onDisconnect} className="shrink-0 text-[11px] text-muted hover:text-fg">
          sign out
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-line/70 pt-3">
        <span className="text-[11px] text-muted">Strike account</span>
        <span className="text-[11px] text-fg">
          {me.accountId ? 'connected' : 'wallet only'}
        </span>
        {me.accountId && (
          <span className="num ml-auto text-[11px] text-muted">
            {((me.feeShareBps ?? 0) / 100).toFixed(1)}% fee
          </span>
        )}
      </div>
    </div>
  );
}
