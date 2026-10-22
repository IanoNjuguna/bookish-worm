import { useCallback, useEffect, useMemo, useState } from 'react';
import { availableWallets, connectCip30 } from '../lib/identity/cip30';
import { connectUtxos, utxosConfigured } from '../lib/identity/utxos';
import { connectBuilder } from '../lib/identity/builder';
import { loadProfile, saveProfile, toggleWatch } from '../lib/identity/profile';
import { DEFAULT_PROFILE, type Identity, type Profile } from '../lib/identity/types';
import type { Stats } from '../lib/progress';

const SESSION = 'paps.identity';

/**
 * Identity is an address plus preferences. Connecting is explicit — no auto-connect on
 * load — but the last wallet is remembered so the button can offer it first.
 */
export function useIdentity() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [profile, setProfile] = useState<Profile>(() => loadProfile(null));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const wallets = useMemo(() => availableWallets(), []);

  useEffect(() => {
    setProfile(loadProfile(identity?.address ?? null));
  }, [identity?.address]);

  useEffect(() => {
    if (identity?.address) localStorage.setItem(SESSION, JSON.stringify(identity));
  }, [identity]);

  const last = (() => {
    try {
      const raw = localStorage.getItem(SESSION);
      return raw ? (JSON.parse(raw) as Identity) : null;
    } catch {
      return null;
    }
  })();

  const connect = useCallback(async (walletId: string) => {
    setBusy(true);
    setError(null);
    try {
      setIdentity(await connectCip30(walletId));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);

  /** Strike builder connect: identity plus an API wallet, fee 0 bps. */
  const connectStrike = useCallback(async (walletId: string) => {
    setBusy(true);
    setError(null);
    try {
      setIdentity(await connectBuilder(walletId));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);

  const connectWithUtxos = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      setIdentity(await connectUtxos());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(SESSION);
    setIdentity(null);
    setProfile(loadProfile(null));
  }, []);

  const update = useCallback(
    (patch: Partial<Profile>) => {
      setProfile((prev) => {
        const next = { ...prev, ...patch };
        saveProfile(identity?.address ?? null, next);
        return next;
      });
    },
    [identity?.address],
  );

  const watch = useCallback(
    (symbol: string) => {
      setProfile((prev) => {
        const next = toggleWatch(prev, symbol);
        saveProfile(identity?.address ?? null, next);
        return next;
      });
    },
    [identity?.address],
  );

  const addProgress = useCallback(
    (delta: Partial<Stats> & { xp?: number }) => {
      setProfile((prev) => {
        const next = {
          ...prev,
          stats: {
            ...prev.stats,
            xp: prev.stats.xp + (delta.xp ?? 0),
            cleanCloses: prev.stats.cleanCloses + (delta.cleanCloses ?? 0),
            liquidations: prev.stats.liquidations + (delta.liquidations ?? 0),
            rounds: prev.stats.rounds + (delta.rounds ?? 0),
            best: Math.max(prev.stats.best, delta.best ?? 0),
            worst: Math.min(prev.stats.worst, delta.worst ?? 0),
            peak: Math.max(prev.stats.peak, delta.peak ?? 0),
          },
        };
        saveProfile(identity?.address ?? null, next);
        return next;
      });
    },
    [identity?.address],
  );

  return {
    addProgress,
    identity,
    profile,
    error,
    busy,
    wallets,
    last,
    utxosConfigured,
    connect,
    connectStrike,
    connectWithUtxos,
    disconnect,
    update,
    watch,
    reset: () => update(DEFAULT_PROFILE),
  };
}
