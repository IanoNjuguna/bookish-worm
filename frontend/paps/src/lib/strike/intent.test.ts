import { describe, expect, it } from 'vitest';
import {
  IDLE_PLACE,
  accepted,
  arm,
  canConfirm,
  canTrade,
  discard,
  draftKey,
  refuse,
  rejected,
  sending,
  tradeBlock,
  type TradeDraft,
} from './intent';
import { marketFilters, planOrder, type OrderPlan } from './orders';
import { adaSymbolFixture } from './order.fixtures';

/**
 * Two clicks, one order — and the reasons a click may do nothing at all.
 *
 * `client_order_id` is the only thing standing between a flaky connection and a duplicated
 * position, so these tests pin down exactly when it is minted, when it is reused, and when
 * a fresh one is correct.
 */

const filters = marketFilters(adaSymbolFixture);

const draft = (over: Partial<TradeDraft> = {}): TradeDraft => ({
  symbol: 'ADA-USD',
  side: 'LONG',
  kind: 'market',
  size: 1200.5,
  price: 0.2415,
  ...over,
});

const planFor = (d: TradeDraft): OrderPlan => {
  const result = planOrder({ ...d, filters });
  if (!result.ok) throw new Error(result.reason);
  return result.plan;
};

/** Deterministic ids so a reuse is visibly the same string, not just the same shape. */
const counter = () => {
  let n = 0;
  return () => `paps-test-${++n}`;
};

const armWith = (prev = IDLE_PLACE, d = draft(), newId = counter()) =>
  arm(prev, d, planFor(d), newId);

describe('arming an intent', () => {
  it('mints an id on the first click and sends nothing', () => {
    const state = armWith();

    expect(state.stage).toBe('confirm');
    expect(state.intent?.id).toBe('paps-test-1');
    expect(state.intent?.body.side).toBe('buy');
    expect(state.message).toBeNull();
  });

  it('keeps the same id when the same intent is armed again', () => {
    const newId = counter();
    const first = armWith(IDLE_PLACE, draft(), newId);
    const second = armWith(first, draft(), newId);

    expect(second.intent?.id).toBe(first.intent?.id);
    expect(second.intent?.id).toBe('paps-test-1');
  });

  it('mints a new id when the size changes, because that is a different order', () => {
    const newId = counter();
    const first = armWith(IDLE_PLACE, draft(), newId);
    const bigger = armWith(first, draft({ size: 2400 }), newId);

    expect(bigger.intent?.id).toBe('paps-test-2');
    expect(bigger.intent?.key).not.toBe(first.intent?.key);
  });

  it('treats side, type and reduce-only as part of the intent', () => {
    expect(draftKey(draft({ side: 'SHORT' }))).not.toBe(draftKey(draft()));
    expect(draftKey(draft({ kind: 'limit' }))).not.toBe(draftKey(draft()));
    expect(draftKey(draft({ reduceOnly: true }))).not.toBe(draftKey(draft()));
  });

  it('mints a new id after an acceptance: two filled intents are two orders', () => {
    const newId = counter();
    const first = armWith(IDLE_PLACE, draft(), newId);
    const done = accepted(sending(first));
    const again = armWith(done, draft(), newId);

    expect(done.stage).toBe('accepted');
    expect(again.intent?.id).toBe('paps-test-2');
  });
});

describe('retrying a refused intent', () => {
  it('reuses the id, so a retry cannot become a second position', () => {
    const newId = counter();
    const armed = armWith(IDLE_PLACE, draft(), newId);
    const failed = rejected(sending(armed), 'insufficient margin to open this position');

    expect(failed.stage).toBe('rejected');
    expect(failed.message).toBe('insufficient margin to open this position');

    const retry = armWith(failed, draft(), newId);
    expect(retry.intent?.id).toBe('paps-test-1');
    expect(retry.stage).toBe('confirm');
  });

  it('has nothing to retry when the refusal was local', () => {
    const local = refuse('minimum order $10');

    expect(local.intent).toBeNull();
    expect(canConfirm(local, null)).toBe(false);
    expect(discard().stage).toBe('idle');
  });
});

describe('the send is disabled, not merely slow', () => {
  it('refuses a second send while one is in flight', () => {
    const armed = armWith();

    expect(canConfirm(armed, null)).toBe(true);
    expect(canConfirm(sending(armed), null)).toBe(false);
  });

  it('refuses to send with no live read', () => {
    const armed = armWith();

    expect(canConfirm(armed, tradeBlock('stale'))).toBe(false);
    expect(canConfirm(armed, tradeBlock('reconnect'))).toBe(false);
    expect(canConfirm(armed, tradeBlock('loading'))).toBe(false);
    expect(canConfirm(armed, tradeBlock('live'))).toBe(true);
  });
});

describe('which session states may trade', () => {
  it('only a live read may spend money', () => {
    expect(tradeBlock('live')).toBeNull();
    expect(canTrade('live')).toBe(true);
  });

  it('pauses on a stale read, and says why', () => {
    expect(tradeBlock('stale')).toContain('paused');
    expect(canTrade('stale')).toBe(false);
  });

  it('asks for a reconnect rather than guessing', () => {
    expect(tradeBlock('reconnect')).toContain('Reconnect');
    expect(canTrade('reconnect')).toBe(false);
  });

  it('waits for the first read before anything can be armed', () => {
    expect(canTrade('idle')).toBe(false);
    expect(canTrade('loading')).toBe(false);
  });
});
