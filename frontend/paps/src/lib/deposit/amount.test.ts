import { describe, expect, it } from 'vitest';
import { adaToLovelace } from '../../server/deposit';
import { lovelaceToAda, parseAdaAmount } from './amount';

/**
 * The browser's conversion, pinned to the server's.
 *
 * `src/server/deposit.ts` converts the same strings and refuses the same ones. Importing it here
 * is deliberate: two implementations that a test holds to each other cannot drift, and the test
 * fails the day one of them changes its mind about what an ada is.
 */

const CODE_OF = (input: string): string | null => {
  const parsed = parseAdaAmount(input);
  return parsed.ok ? null : parsed.problem.code;
};

describe('ada to lovelace in the browser', () => {
  it('converts what a user types into the lovelace a quote is asked for', () => {
    expect(parseAdaAmount('12.5')).toMatchObject({ ok: true, lovelace: '12500000' });
    expect(parseAdaAmount('1')).toMatchObject({ ok: true, lovelace: '1000000' });
    expect(parseAdaAmount('0.000001')).toMatchObject({ ok: true, lovelace: '1' });
    expect(parseAdaAmount(' 3.000000 ')).toMatchObject({ ok: true, lovelace: '3000000' });
  });

  it('agrees with the server, lovelace for lovelace and word for word', () => {
    // Zero is the one case excluded: the server's parser returns "0" and the quote path refuses
    // it a step later, in `checkedLovelace`. It is asserted on its own below.
    const cases = [
      '1',
      '12.5',
      '0.000001',
      '3.000000',
      '42.000001',
      '90071992547.40993',
      '007',
      '1.0000001',
      '1.000000',
      '1e6',
      '1,5',
      '-1',
      '.5',
      '',
      '   ',
      '12.',
    ];

    for (const input of cases) {
      let serverLovelace: string | null = null;
      let serverMessage = '';
      try {
        serverLovelace = adaToLovelace(input);
      } catch (e) {
        serverMessage = (e as Error).message;
      }

      const browser = parseAdaAmount(input);
      if (browser.ok) {
        expect(browser.lovelace).toBe(serverLovelace);
      } else {
        expect(serverLovelace).toBeNull();
        expect(browser.problem.message).toBe(serverMessage);
      }
    }
  });

  it('refuses a zero deposit before it asks for a quote', () => {
    // The server's wording, from `checkedLovelace` in src/server/deposit.ts.
    expect(parseAdaAmount('0')).toMatchObject({
      ok: false,
      problem: { code: 'invalid_amount', message: 'deposit amount must be positive' },
    });
    expect(CODE_OF('0.000000')).toBe('invalid_amount');
  });

  it('refuses more decimals than ada has, in the words the server uses', () => {
    expect(parseAdaAmount('1.0000001')).toMatchObject({
      ok: false,
      problem: { code: 'amount_precision', message: 'ADA has 6 decimals; 1.0000001 has 7' },
    });
    expect(CODE_OF('0.12345678')).toBe('amount_precision');
    // Six is allowed: the boundary is inclusive.
    expect(CODE_OF('0.123456')).toBeNull();
  });

  it('refuses what is not an amount at all', () => {
    for (const input of ['', ' ', '-1', '1,5', '1e6', 'abc', '.5', '12.']) {
      expect(CODE_OF(input)).toBe('invalid_amount');
    }
  });

  it('keeps every lovelace of a large amount, where a double does not', () => {
    const parsed = parseAdaAmount('90071992547.40993');
    expect(parsed.ok && parsed.lovelace).toBe('90071992547409930');
    // The number this replaces: a double loses ten lovelace at 2^53.
    expect(String(Math.round(Number('90071992547.40993') * 1e6))).toBe('90071992547409920');
  });

  it('reads lovelace back for display, trailing zeroes trimmed', () => {
    expect(lovelaceToAda('12500000')).toBe('12.5');
    expect(lovelaceToAda('1')).toBe('0.000001');
    expect(lovelaceToAda('90071992547409930')).toBe('90071992547.40993');
    expect(lovelaceToAda('1000000')).toBe('1');
  });
});
