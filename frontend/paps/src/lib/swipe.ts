/**
 * The deck's release decision, as arithmetic.
 *
 * A swipe is two facts — how far sideways, how far up — and one rule about which of
 * them wins. Keeping that rule out of the component means it can be tested at the
 * numbers a thumb actually produces, instead of by dragging a card by hand.
 */

/** Sideways travel, as a share of the deck width, before a release arms a position. */
export const SWIPE_THRESHOLD = 0.32;

/**
 * A pass opens nothing and costs nothing, so it needs less travel than a long or a
 * short. At deck width it lands a shade under 110px on a 390px phone, which is the
 * point at which a deliberate upward push stops feeling like a scrolled page.
 */
export const PASS_THRESHOLD = 0.28;

/** The deck width assumed before the host has been measured. */
export const FALLBACK_WIDTH = 320;

export type SwipeOutcome = 'LONG' | 'SHORT' | 'PASS' | null;

/**
 * Resolve a released drag into what it means, or nothing.
 *
 * Vertical is checked first and only when it dominates: a thumb flicking sideways
 * almost always drifts upward, and reading that drift as a pass would silently skip
 * the card the trader was aiming at.
 */
export function resolveSwipe(dx: number, dy: number, width: number): SwipeOutcome {
  const measured = width > 0 ? width : FALLBACK_WIDTH;
  const sideways = measured * SWIPE_THRESHOLD;
  const upward = measured * PASS_THRESHOLD;

  if (dy < 0 && Math.abs(dy) > upward && Math.abs(dy) > Math.abs(dx)) return 'PASS';
  if (Math.abs(dx) > sideways) return dx > 0 ? 'LONG' : 'SHORT';
  return null;
}
