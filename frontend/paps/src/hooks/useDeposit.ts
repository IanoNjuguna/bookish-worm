import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { parseAdaAmount, type AmountProblem } from '../lib/deposit/amount';
import { requestBuild, requestConfirm, requestQuote } from '../lib/deposit/client';
import {
  IDLE_DEPOSIT,
  busy,
  canQuote,
  canRetryConfirm,
  canSign,
  confirmed,
  failed,
  failureFromError,
  quoted,
  quoteExpired,
  quoteRemaining,
  quoting,
  reset,
  working,
  type DepositFailure,
  type DepositState,
} from '../lib/deposit/machine';
import { depositBlocked, openDepositWallet, type OpenedWallet } from '../lib/deposit/wallet';
import type { Identity } from '../lib/identity/types';

export type DepositApi = {
  state: DepositState;
  /** What is in the field, as typed. */
  amount: string;
  /** Why the typed amount is not quoteable, or null while it is. */
  problem: AmountProblem | null;
  setAmount: (value: string) => void;
  /** Why the deposit cannot start at all. Null when it can. */
  blocked: string | null;
  working: boolean;
  /** Milliseconds left on the quote. Null when the venue stated no expiry. */
  remaining: number | null;
  expired: boolean;
  /** The address the coins go to, from the quote. Never derived. */
  depositAddress: string | null;
  copied: boolean;
  quote: () => void;
  sign: () => void;
  retryConfirm: () => void;
  copyAddress: () => void;
  reset: () => void;
};

/**
 * One deposit, from the amount field to a hash the venue has been told about.
 *
 * The order is fixed in `machine.ts` and enforced by `canSign` / `canRetryConfirm`, so this hook
 * only sequences the calls. Three details are load-bearing:
 *
 * - The quote is read from a ref, not from the render closure: a wallet prompt can sit open for
 *   a minute and the closure it started in would still hold the quote it had at the click.
 * - The hash is committed to state *before* `/api/deposit/confirm` is called, so a failed
 *   confirm leaves a receipt on screen instead of losing the only record of the transaction.
 * - `getUtxos()` answering null is a locked wallet, answered as a failure the user can retry,
 *   and an empty array is a wallet with nothing to spend.
 */
export function useDeposit(identity: Identity | null): DepositApi {
  const [state, setState] = useState<DepositState>(IDLE_DEPOSIT);
  const [amount, setAmount] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);

  const stateRef = useRef<DepositState>(IDLE_DEPOSIT);
  const identityRef = useRef(identity);
  identityRef.current = identity;

  const apply = useCallback((next: DepositState | ((prev: DepositState) => DepositState)) => {
    const value = typeof next === 'function' ? next(stateRef.current) : next;
    stateRef.current = value;
    setState(value);
  }, []);

  // A countdown needs a clock, and only while there is something to count down to. Once the hash
  // exists the quote is a receipt, and a ticker under a finished deposit is a lie about state.
  useEffect(() => {
    if (!state.quote || state.txHash) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(id);
  }, [state.quote, state.txHash]);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2_000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const parsed = useMemo(() => parseAdaAmount(amount), [amount]);
  const problem = parsed.ok || amount.trim() === '' ? null : parsed.problem;
  const blocked = depositBlocked(identity);

  const start = useCallback(async () => {
    if (!canQuote(stateRef.current)) return;
    const parsedNow = parseAdaAmount(amount);
    if (!parsedNow.ok) {
      apply((prev) =>
        failed(prev, {
          kind: parsedNow.problem.code,
          at: 'quote',
          detail: parsedNow.problem.message,
        }),
      );
      return;
    }

    apply(quoting());
    try {
      apply(quoted(await requestQuote(parsedNow.lovelace)));
    } catch (e) {
      apply((prev) => failed(prev, failureFromError(e, 'quote')));
    }
  }, [amount, apply]);

  const sign = useCallback(async () => {
    const current = stateRef.current;
    const quote = current.quote;
    const me = identityRef.current;
    if (!quote || !me || !canSign(current, Date.now())) return;

    const stop = (failure: DepositFailure) => apply((prev) => failed(prev, failure));
    const at = 'build' as const;

    apply((prev) => working(prev, 'building'));

    let opened: OpenedWallet;
    try {
      opened = await openDepositWallet(me);
    } catch (e) {
      stop({ kind: 'wallet_refused', at, detail: e instanceof Error ? e.message : '' });
      return;
    }
    if (!opened.ok) {
      stop({ kind: opened.problem, at, detail: '' });
      return;
    }
    const wallet = opened.wallet;

    let utxos: string[] | null;
    try {
      utxos = await wallet.getUtxos();
    } catch (e) {
      stop({ kind: 'wallet_refused', at, detail: e instanceof Error ? e.message : '' });
      return;
    }
    if (!utxos) {
      stop({ kind: 'utxos_locked', at, detail: '' });
      return;
    }
    if (utxos.length === 0) {
      stop({ kind: 'utxos_required', at, detail: '' });
      return;
    }

    let unsignedTx: string;
    try {
      const built = await requestBuild({
        requestId: quote.requestId,
        userAddress: wallet.address,
        utxos,
        quoteExpiresAt: quote.expiresAt,
      });
      unsignedTx = built.unsignedTx;
    } catch (e) {
      stop(failureFromError(e, 'build'));
      return;
    }

    apply((prev) => working(prev, 'signing'));
    let signed: string;
    try {
      signed = await wallet.signTx(unsignedTx);
    } catch (e) {
      stop({ kind: 'wallet_refused', at, detail: e instanceof Error ? e.message : '' });
      return;
    }

    apply((prev) => working(prev, 'submitting'));
    let txHash: string;
    try {
      txHash = await wallet.submitTx(signed);
    } catch (e) {
      stop({ kind: 'submit_unreported', at, detail: e instanceof Error ? e.message : '' });
      return;
    }

    // Committed before the confirm call: from here the hash is the only proof of the transfer,
    // and a confirm that fails must not take it off the screen.
    apply((prev) => working(confirmed(prev, txHash), 'confirming'));

    try {
      await requestConfirm({ requestId: quote.requestId, txHash });
      apply((prev) => confirmed(prev, txHash));
    } catch (e) {
      apply((prev) => failed(prev, failureFromError(e, 'confirm')));
    }
  }, [apply]);

  const retryConfirm = useCallback(async () => {
    const current = stateRef.current;
    const quote = current.quote;
    const txHash = current.txHash;
    if (!quote || !txHash || !canRetryConfirm(current)) return;

    apply((prev) => working(prev, 'confirming'));
    try {
      await requestConfirm({ requestId: quote.requestId, txHash });
      apply((prev) => confirmed(prev, txHash));
    } catch (e) {
      apply((prev) => failed(prev, failureFromError(e, 'confirm')));
    }
  }, [apply]);

  /**
   * Typing a new amount drops a quote made for the old one, so the screen can never show a price
   * for one figure next to a signature for another. Never while a call is open, and never after a
   * submit: by then the quote is a receipt, not an offer.
   */
  const editAmount = useCallback(
    (value: string) => {
      setAmount(value);
      const current = stateRef.current;
      const quote = current.quote;
      if (!quote || busy(current) || current.txHash !== null) return;
      const next = parseAdaAmount(value);
      if (!next.ok || next.lovelace !== quote.lovelace) apply(reset());
    },
    [apply],
  );

  const copyAddress = useCallback(() => {
    const address = stateRef.current.quote?.depositAddress;
    if (!address) return;
    void navigator.clipboard
      .writeText(address)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  }, []);

  const clear = useCallback(() => {
    apply(reset());
    setAmount('');
  }, [apply]);

  return {
    state,
    amount,
    problem,
    setAmount: editAmount,
    blocked,
    working: busy(state),
    remaining: quoteRemaining(state.quote, now),
    expired: quoteExpired(state.quote, now),
    depositAddress: state.quote?.depositAddress ?? null,
    copied,
    quote: () => void start(),
    sign: () => void sign(),
    retryConfirm: () => void retryConfirm(),
    copyAddress,
    reset: clear,
  };
}
