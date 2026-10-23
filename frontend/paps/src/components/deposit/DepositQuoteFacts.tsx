import { usd } from '../../lib/format';
import { countdown } from '../../lib/deposit/format';
import { DepositRow } from './DepositRow';
import type { QuoteFactsProps } from './DepositSheet.types';

/**
 * What strike quoted: how much ada, what it is worth, where it goes, and how long that stands.
 *
 * The address is printed whole and left selectable. It is the one string on the screen someone
 * may copy by hand, and a truncated address is an invitation to guess. `exchangeRate` is
 * deliberately not shown: the venue has not said what that string means yet, and a number
 * nobody can define is not information.
 */
export function DepositQuoteFacts({
  ada,
  usdValue,
  depositAddress,
  confirmations,
  remaining,
  expired,
  copied,
  onCopy,
}: QuoteFactsProps) {
  const life = expired ? 'expired' : remaining === null ? 'no stated expiry' : countdown(remaining);
  // Both of these are 0 when the venue said nothing, and 0 is a different claim from "unknown".
  const value = usdValue > 0 ? `$${usd(usdValue)}` : '—';
  const needed = confirmations > 0 ? String(confirmations) : '—';

  return (
    <section className="rounded-card border border-line bg-panel-2/60 px-3 py-2" aria-label="quote">
      <div className="flex items-center justify-between pb-1">
        <span className="label">live deposit · real ada</span>
        <span className={expired ? 'num text-micro text-short' : 'num text-micro text-muted'}>
          {life}
        </span>
      </div>

      <dl>
        <DepositRow label="you send" value={`${ada} ada`} strong />
        <DepositRow label="usd value" value={value} />
        <DepositRow label="confirmations" value={needed} />
        <DepositRow label="send to" value={depositAddress} wrap />
      </dl>

      <div className="flex items-start justify-between gap-2 border-t border-line pt-1.5">
        <p className="text-micro leading-snug text-muted">
          the usd figure is strike&rsquo;s rate at quote time, not a settlement figure.
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 rounded-chip px-1.5 py-0.5 text-micro uppercase tracking-[0.08em] text-muted hover:text-fg"
        >
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
    </section>
  );
}
