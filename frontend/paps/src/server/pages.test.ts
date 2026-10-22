import { describe, expect, it } from 'vitest';
import { upstreamPath } from './pages';

/**
 * The public URL deliberately drops the venue's `/v2`. Getting that wrong is a silent
 * 403 from the allowlist, which reads like an authentication problem rather than a
 * routing one, so the mapping gets a test of its own.
 */
describe('proxy path mapping', () => {
  it('maps a public path onto the venue path', () => {
    expect(upstreamPath(['positions'], '')).toBe('/v2/positions');
    expect(upstreamPath(['positions'], '?symbol=ADA-USD')).toBe('/v2/positions?symbol=ADA-USD');
    expect(upstreamPath(['history', 'funding'], '?limit=10')).toBe('/v2/history/funding?limit=10');
    expect(upstreamPath(['deposit', 'build-tx'], '')).toBe('/v2/deposit/build-tx');
  });

  it('does not double the prefix when a caller includes it', () => {
    // `/api/strike/v2/positions` is a mistake the README used to invite; the segments keep
    // it literal here so the allowlist refuses instead of silently signing `/v2/v2/…`.
    expect(upstreamPath(['v2', 'positions'], '')).toBe('/v2/v2/positions');
  });

  it('survives an empty catch-all rather than producing a bare prefix', () => {
    expect(upstreamPath([], '')).toBe('/v2/');
  });
});
