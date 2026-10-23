import { describe, expect, it } from 'vitest';
import { FALLBACK_WIDTH, PASS_THRESHOLD, resolveSwipe, SWIPE_THRESHOLD } from './swipe';

/** The two phones in the issue, plus the width the host reports before it is measured. */
const WIDTHS = [320, 360, 390];

describe('resolveSwipe', () => {
  it('arms a long for a rightward drag past the threshold', () => {
    for (const w of WIDTHS) {
      expect(resolveSwipe(240, 0, w)).toBe('LONG');
    }
  });

  it('arms a short for a leftward drag past the threshold', () => {
    for (const w of WIDTHS) {
      expect(resolveSwipe(-240, 0, w)).toBe('SHORT');
    }
  });

  it('snaps back a drag under the threshold', () => {
    for (const w of WIDTHS) {
      // 40px is the short drag from the issue: a nudge, not a decision.
      expect(resolveSwipe(40, 0, w)).toBeNull();
      expect(resolveSwipe(-40, 0, w)).toBeNull();
    }
  });

  it('treats exactly-at-the-threshold as not yet a decision', () => {
    const edge = 390 * SWIPE_THRESHOLD;
    expect(resolveSwipe(edge, 0, 390)).toBeNull();
    expect(resolveSwipe(edge + 1, 0, 390)).toBe('LONG');
  });

  it('passes on an upward drag the card can read', () => {
    for (const w of WIDTHS) {
      expect(resolveSwipe(0, -120, w)).toBe('PASS');
    }
  });

  it('does not pass on a downward drag', () => {
    for (const w of WIDTHS) {
      expect(resolveSwipe(0, 120, w)).toBeNull();
    }
  });

  it('does not pass on a small upward nudge', () => {
    expect(resolveSwipe(0, -20, 390)).toBeNull();
    expect(resolveSwipe(0, -(390 * PASS_THRESHOLD), 390)).toBeNull();
  });

  it('lets a sideways flick win over the upward drift a thumb always has', () => {
    // A 240px fling right with 60px of drift is a long, not a pass.
    expect(resolveSwipe(240, -60, 390)).toBe('LONG');
    // Barely sideways, mostly up, and past the pass threshold: a pass.
    expect(resolveSwipe(30, -200, 390)).toBe('PASS');
  });

  it('passes when the drag is vertical and long enough for the width it was given', () => {
    // 120px up clears the pass threshold on the two phones in the issue.
    const upward = (w: number) => w * PASS_THRESHOLD;
    expect(120).toBeGreaterThan(upward(390));
    expect(120).toBeGreaterThan(upward(360));
    // ... and a position needs more travel than a pass on the same deck.
    expect(SWIPE_THRESHOLD).toBeGreaterThan(PASS_THRESHOLD);
  });

  it('falls back to a known width when the host reports none', () => {
    expect(resolveSwipe(200, 0, 0)).toBe('LONG');
    expect(resolveSwipe(40, 0, 0)).toBeNull();
    expect(FALLBACK_WIDTH * SWIPE_THRESHOLD).toBeLessThan(200);
  });

  it('commits nothing for a release that never moved', () => {
    expect(resolveSwipe(0, 0, 390)).toBeNull();
  });
});
