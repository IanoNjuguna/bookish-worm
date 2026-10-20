import { logger } from './lib/logger';

/**
 * Event writing for code that cannot import the database module directly.
 *
 * `database.ts` already imports `web3.ts`, so a static import back would be a
 * cycle. A dynamic import keeps telemetry one-way and, more importantly, keeps a
 * failing metrics path from ever breaking a chain read.
 */
async function write(kind: 'collect_failed' | 'chain_fallback' | 'http_5xx' | 'collect_unpriced', subject: string, detail?: string) {
  try {
    const { recordEvent } = await import('./database');
    await recordEvent(kind, subject, detail);
  } catch (error) {
    logger.warn(`telemetry dropped: ${kind} ${subject}`);
  }
}

export function noteChainFallback(subject: string, detail?: string): void {
  void write('chain_fallback', subject, detail);
}

export function noteHttp5xx(subject: string, detail?: string): void {
  void write('http_5xx', subject, detail);
}

export function noteCollectFailed(subject: string, detail?: string): void {
  void write('collect_failed', subject, detail);
}
