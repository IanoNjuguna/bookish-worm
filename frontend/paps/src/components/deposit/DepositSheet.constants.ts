/** Copy and layout constants for the deposit sheet. Values only, no logic. */

import type { DepositStage } from '../../lib/deposit/machine';

/** What a tap on a chip puts in the field. Ada, as typed. */
export const AMOUNT_CHIPS = ['100', '500', '1000'] as const;

/** The label under the amount while a call or a wallet prompt is open. */
export const WORKING_LABEL: Partial<Record<DepositStage, string>> = {
  quoting: 'asking strike for a quote…',
  building: 'asking strike for the transaction…',
  signing: 'waiting for your wallet…',
  submitting: 'submitting the transfer…',
  confirming: 'telling strike the hash…',
};

/** Said once, above the signing action. It is the whole risk of the screen in one sentence. */
export const SIGN_WARNING =
  'signing sends this ada to the address above. a cardano transfer cannot be undone.';

/** The credit is not this screen's to report, and saying so stops a reload from looking broken. */
export const PENDING_NOTE =
  'strike credits the balance when the transfer settles. this screen does not poll, and it does not store the hash, so keep it: a reload clears this.';

export const AMOUNT_NOTE = 'ada has 6 decimals. the minimum is whatever strike quotes.';
