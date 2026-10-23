/**
 * ADA → lovelace, in the browser, without a float.
 *
 * The server does this too (`src/server/deposit.ts`) and for the same reason: a double holds
 * 53 bits, and 9_007_199_254_740_993 lovelace is already past that, so `Number(ada) * 1e6`
 * drops lovelace off a large deposit. This copy exists because the client has to refuse a bad
 * amount before it asks the server for a quote, and a round trip that only says "400" is a
 * worse way to learn you typed seven decimals.
 *
 * The wording is the server's, verbatim, so a refusal reads the same wherever it is caught.
 * `amount.test.ts` pins the two implementations to each other: same lovelace, same message.
 */

export const LOVELACE_PER_ADA = 1_000_000n;
const ADA_DECIMALS = 6;

export type AmountCode = 'invalid_amount' | 'amount_precision';

export type AmountProblem = { code: AmountCode; message: string };

export type AmountParse =
  | { ok: true; lovelace: string; ada: string }
  | { ok: false; problem: AmountProblem };

const invalid = (raw: string): AmountParse => ({
  ok: false,
  problem: { code: 'invalid_amount', message: `not an ADA amount: ${raw}` },
});

/**
 * What the user typed, as the lovelace the quote is asked for.
 *
 * `ada` echoes back the trimmed amount so the screen can render what was priced. The refusal
 * messages quote the raw input exactly as the server does, which is the small oddity that keeps
 * one refusal reading the same wherever it was caught.
 */
export function parseAdaAmount(input: string): AmountParse {
  const ada = input.trim();
  const parts = /^(\d+)(?:\.(\d+))?$/.exec(ada);
  if (!parts) return invalid(input);

  const fraction = parts[2] ?? '';
  if (fraction.length > ADA_DECIMALS) {
    return {
      ok: false,
      problem: {
        code: 'amount_precision',
        message: `ADA has ${ADA_DECIMALS} decimals; ${input} has ${fraction.length}`,
      },
    };
  }

  const lovelace = (
    BigInt(parts[1]) * LOVELACE_PER_ADA +
    BigInt(fraction.padEnd(ADA_DECIMALS, '0'))
  ).toString();

  // The server refuses this in `checkedLovelace`; doing it here means a zero never becomes a
  // quote request, and the message is the same one it would have answered with.
  if (lovelace === '0') {
    return {
      ok: false,
      problem: { code: 'invalid_amount', message: 'deposit amount must be positive' },
    };
  }

  return { ok: true, lovelace, ada };
}

/** `"12500000"` lovelace → `"12.5"` ada, trailing zeroes trimmed. Display only. */
export function lovelaceToAda(lovelace: string): string {
  const total = BigInt(lovelace);
  const whole = total / LOVELACE_PER_ADA;
  const fraction = (total % LOVELACE_PER_ADA)
    .toString()
    .padStart(ADA_DECIMALS, '0')
    .replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
