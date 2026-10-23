import { cn } from '../../lib/cn';
import { AMOUNT_CHIPS, AMOUNT_NOTE } from './DepositSheet.constants';
import type { AmountFieldProps } from './DepositSheet.types';

/**
 * The amount, in ada, and the three chips that save typing one.
 *
 * The field is the only text input on the screen and it takes what a person types, including
 * trailing decimals: a refusal belongs under the field, in the words the server would have used,
 * not in the middle of a quote attempt.
 */
export function DepositAmount({ amount, problem, disabled, onAmount }: AmountFieldProps) {
  return (
    <section className="space-y-2" aria-label="amount">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor="deposit-amount" className="label">
          amount (ada)
        </label>
        <div className="flex gap-1">
          {AMOUNT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              disabled={disabled}
              onClick={() => onAmount(chip)}
              className={cn(
                'chip',
                amount === chip && 'chip-on',
                disabled && 'opacity-40',
              )}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <input
        id="deposit-amount"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        value={amount}
        onChange={(e) => onAmount(e.target.value)}
        placeholder="0.00"
        aria-invalid={problem ? true : undefined}
        aria-describedby={problem ? 'deposit-amount-problem' : 'deposit-amount-note'}
        className={cn('field num text-title', disabled && 'opacity-40')}
      />

      {problem ? (
        <p id="deposit-amount-problem" className="text-small text-short">
          {problem}
        </p>
      ) : (
        <p id="deposit-amount-note" className="text-micro text-muted">
          {AMOUNT_NOTE}
        </p>
      )}
    </section>
  );
}
