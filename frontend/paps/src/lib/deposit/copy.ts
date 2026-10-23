/**
 * What a deposit failure says, in words a first time depositor can act on.
 *
 * One entry per kind the machine can produce, so a new failure kind cannot reach the screen as
 * a bare code. The rule for each: name what happened, say whether anything was sent, and name
 * the next action. No adjectives, no reassurance, no exclamation marks.
 */

import type { DepositFailure } from './machine';

export type FailureCopy = { title: string; body: string };

const COPY: Record<DepositFailure['kind'], FailureCopy> = {
  reconnect: {
    title: 'your session has expired',
    body: 'the strike session behind this screen is gone. connect your wallet again, then start the deposit over.',
  },
  account_mismatch: {
    title: 'this wallet is not the address you signed in with',
    body: 'strike only accepts a deposit from the address your session connected with. this wallet is a different one. reconnect the session with this wallet, then deposit again.',
  },
  already_submitted: {
    title: 'strike already has this transaction',
    body: 'the deposit is recorded. it was not sent twice, and there is nothing more to sign. the balance moves once the transfer settles.',
  },
  quote_expired: {
    title: 'the quote expired',
    body: 'nothing was signed. get a fresh quote: the rate and the address come from strike, so both are new.',
  },
  utxos_required: {
    title: 'your wallet reported no ada to spend',
    body: 'strike builds the transfer from the utxos your wallet lists, and it listed none it can spend. add ada to this wallet, or deposit from one that holds some.',
  },
  utxos_invalid: {
    title: 'your wallet returned utxos in a format we cannot pass on',
    body: 'the wallet has to report utxos as hex, and this one reported something else. nothing was signed. try a different browser wallet.',
  },
  invalid_amount: {
    title: 'that is not an ada amount',
    body: 'ada amounts are digits with an optional decimal point, up to 6 decimals. nothing was sent.',
  },
  amount_precision: {
    title: 'ada has 6 decimals',
    body: 'this amount has more, and lovelace cannot express it. trim it to 6 decimals or fewer, then get a fresh quote. nothing was sent.',
  },
  amount_rejected: {
    title: 'strike refused that amount',
    body: 'the venue refused this amount and said why below. a deposit below its minimum is refused exactly like this, so nothing is wrong with the app.',
  },
  rate_limited: {
    title: 'too many deposit calls',
    body: 'the api allows a few a minute. wait a moment, then try again. nothing was signed.',
  },
  utxos_locked: {
    title: 'your wallet is locked',
    body: 'unlock it in the browser extension, then sign again. nothing was built and nothing was sent.',
  },
  wallet_unsupported: {
    title: 'this wallet cannot sign a cardano transaction here',
    body: 'the deposit needs a browser wallet extension that reports utxos and signs cardano transactions. the embedded wallet cannot, so this deposit has to come from an extension.',
  },
  wallet_missing: {
    title: 'the wallet that signed you in is not in this browser',
    body: 'unlock the extension and reload the page, then deposit again. a deposit cannot come from any other wallet.',
  },
  wallet_refused: {
    title: 'the wallet did not sign',
    body: 'nothing was submitted. unlock the wallet, check it is on mainnet, and sign again.',
  },
  submit_unreported: {
    title: 'the wallet did not report a transaction',
    body: 'as far as this screen knows nothing was sent, but a wallet can submit and still throw. check the wallet history before you build a second transaction.',
  },
  confirm_unreported: {
    title: 'the transfer went out, strike did not record it',
    body: 'your ada is on its way and the hash below is the proof. send the hash again, and check the deposit in the venue history if it still does not appear.',
  },
  venue: {
    title: 'strike did not complete the deposit',
    body: 'the venue answered with an error this screen cannot read. the detail is below.',
  },
};

/** The words for a failure. Title is the headline, body is the sentence under it. */
export const failureCopy = (failure: DepositFailure): FailureCopy => COPY[failure.kind];
