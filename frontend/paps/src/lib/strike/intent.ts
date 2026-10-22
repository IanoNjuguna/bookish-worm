import type { Side } from '../order';
import { bodyFor, type OrderBody, type OrderPlan, type OrderType } from './orders';
import type { VenueStatus } from './venue-client';

/**
 * The two-click rule, and the reason a click can be refused.
 *
 * Money leaves on the second click. The first one only ever arms an intent: it mints a
 * `client_order_id`, which is the idempotency key the venue dedupes on, and shows exactly
 * what is about to be sent. Retrying the same intent reuses that id; changing anything
 * about it — symbol, side, type, size, price, reduce-only — is a new intent and a new id,
 * because a resent order and a genuinely second order are not the same thing.
 *
 * `sending` is a settle state, not a spinner: while it is true the CTA is disabled, so a
 * double tap cannot become two positions.
 */

export type TradeDraft = {
  symbol: string;
  side: Side;
  kind: OrderType;
  /** Base units as the surface computed them, and the reference price it judged them at. */
  size: number;
  price: number;
  reduceOnly?: boolean;
  /**
   * The leverage the ticket priced this trade at. Not part of the order body and not part of
   * the intent key: it does not change which order is sent, only the margin behind it.
   */
  leverage?: number;
};

export type PlaceStage = 'idle' | 'confirm' | 'sending' | 'accepted' | 'rejected';

export type OrderIntent = {
  /** `client_order_id` for this intent. Minted once, reused by every retry of it. */
  id: string;
  key: string;
  draft: TradeDraft;
  body: OrderBody;
  notional: number;
};

export type PlaceState = {
  stage: PlaceStage;
  intent: OrderIntent | null;
  /** A local refusal or the venue's words, verbatim. Null when there is nothing to say. */
  message: string | null;
};

export const IDLE_PLACE: PlaceState = { stage: 'idle', intent: null, message: null };

/**
 * Why the CTA is off. Only a `live` read may spend money: a stale or reconnect session has
 * numbers we could not refresh, and pricing an order from them is how a trader sends a
 * size they did not mean.
 */
export function tradeBlock(status: VenueStatus): string | null {
  switch (status) {
    case 'live':
      return null;
    case 'stale':
      return 'The venue has not answered the last refresh, so trading is paused. Retrying.';
    case 'reconnect':
      return 'Session expired. Reconnect to trade.';
    case 'idle':
    case 'loading':
      return 'Reading your Strike account…';
  }
}

export const canTrade = (status: VenueStatus): boolean => tradeBlock(status) === null;

export const draftKey = (d: TradeDraft): string =>
  [
    d.symbol,
    d.side,
    d.kind,
    d.size,
    d.kind === 'limit' ? d.price : 'market',
    d.reduceOnly ? 'reduce' : 'open',
  ].join('|');

/**
 * The first click. Same intent still pending → same id; anything else → a fresh one.
 *
 * `accepted` mints a new id on purpose: the previous order went through, so an identical
 * second click is a second order, not a retry.
 */
export function arm(
  prev: PlaceState,
  draft: TradeDraft,
  plan: OrderPlan,
  newId: () => string,
): PlaceState {
  const key = draftKey(draft);
  const retry = prev.intent?.key === key && (prev.stage === 'confirm' || prev.stage === 'rejected');
  // The body is built from the id, not next to it: they can never disagree.
  const id = retry && prev.intent ? prev.intent.id : newId();

  return {
    stage: 'confirm',
    intent: { id, key, draft, body: bodyFor(plan, id), notional: plan.notional },
    message: null,
  };
}

export const sending = (s: PlaceState): PlaceState =>
  s.intent ? { ...s, stage: 'sending', message: null } : s;

export const accepted = (s: PlaceState): PlaceState => ({ ...s, stage: 'accepted', message: null });

/** Keeps the intent, so the retry that follows reuses its `client_order_id`. */
export const rejected = (s: PlaceState, message: string): PlaceState => ({
  stage: 'rejected',
  intent: s.intent,
  message,
});

/** A local refusal before anything was armed: nothing to retry, nothing was sent. */
export const refuse = (message: string): PlaceState => ({
  stage: 'rejected',
  intent: null,
  message,
});

export const discard = (): PlaceState => IDLE_PLACE;

/** The second click is only allowed when there is a live session and nothing in flight. */
export const canConfirm = (s: PlaceState, block: string | null): boolean =>
  Boolean(s.intent) && s.stage !== 'sending' && block === null;
