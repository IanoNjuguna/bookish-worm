import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { usd } from '../../lib/format';
import type { Tier } from '../../lib/progress';
import { cn } from '../../lib/cn';
import { RiskControls } from './RiskControls';

/**
 * Risk and leverage change the next swipe, so they stay on this page — but as one row
 * that already states both values, not as two more cards competing with the profile.
 * One tap opens the dials; the row answers the question without it.
 */
export function RiskSettings({
  risk,
  leverage,
  tier,
  onChange,
}: {
  risk: number;
  leverage: number;
  tier: Tier;
  onChange: (patch: { riskUsd?: number; leverage?: number }) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-card border border-line bg-panel">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-3"
      >
        <span className="text-small text-muted">risk settings</span>
        <span className="flex items-center gap-1.5">
          <span className="num text-small text-fg">
            ${usd(risk, 0)} · {leverage}×
          </span>
          <IconChevronDown
            size={12}
            className={cn('text-muted transition-transform', open && 'rotate-180')}
          />
        </span>
      </button>

      {open && (
        <div className="border-t border-line px-4 py-3">
          <RiskControls risk={risk} leverage={leverage} tier={tier} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
