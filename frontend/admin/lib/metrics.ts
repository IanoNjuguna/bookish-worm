import type { Release } from './api';
import { share } from './format';

export type Overview = {
  releases: number;
  releasedWithCollects: number;
  collects: number;
  minted: number;
  /** Sum of price x collects. What fans actually spent, as far as the record knows. */
  gmvAda: number;
  /** fan spend divided by collects, the only per-unit figure the record supports today. */
  averageCollectAda: number;
  /** Top release's share of GMV, the concentration signal at small n. */
  topReleaseShare: number;
  pricedReleases: number;
};

function priceOf(release: Release): number | null {
  const parsed = Number.parseFloat(release.price ?? '');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function summarize(releases: Release[]): Overview {
  let collects = 0;
  let minted = 0;
  let gmvAda = 0;
  let pricedReleases = 0;
  let releasedWithCollects = 0;
  let topReleaseGmv = 0;

  for (const release of releases) {
    const price = priceOf(release);
    collects += release.mint_count;
    minted += Number.parseInt(release.max_supply ?? '0', 10) || 0;
    if (release.mint_count > 0) releasedWithCollects += 1;
    if (price !== null) {
      pricedReleases += 1;
      const revenue = price * release.mint_count;
      gmvAda += revenue;
      topReleaseGmv = Math.max(topReleaseGmv, revenue);
    }
  }

  return {
    releases: releases.length,
    releasedWithCollects,
    collects,
    minted,
    gmvAda,
    averageCollectAda: collects === 0 ? 0 : gmvAda / collects,
    topReleaseShare: share(topReleaseGmv, gmvAda),
    pricedReleases,
  };
}
