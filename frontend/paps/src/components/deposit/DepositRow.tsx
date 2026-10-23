import { cn } from '../../lib/cn';

/**
 * One fact per row: label left in the sans, value right in the mono.
 *
 * Every number on this screen goes through here, so a value never drifts into prose type and a
 * column of values never jitters as the countdown ticks.
 */
export function DepositRow({
  label,
  value,
  strong,
  wrap,
}: {
  label: string;
  value: string;
  /** The one figure the decision turns on. */
  strong?: boolean;
  /** For an address: it wraps instead of truncating into something untypeable. */
  wrap?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <dt className="shrink-0 text-small text-muted">{label}</dt>
      <dd
        className={cn(
          'num text-right text-small',
          wrap && 'break-all text-left',
          strong ? 'text-title text-fg' : 'text-fg',
        )}
      >
        {value}
      </dd>
    </div>
  );
}
