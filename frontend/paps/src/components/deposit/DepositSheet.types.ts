import type { DepositApi } from '../../hooks/useDeposit';
import type { DepositFailure } from '../../lib/deposit/machine';
import type { Identity } from '../../lib/identity/types';

/** Props for the deposit sheet and its parts. Explicit, so no part reads the hook. */

export type DepositSheetProps = {
  open: boolean;
  onClose: () => void;
  identity: Identity | null;
  /** Hand the user to the identity menu, where a strike session is made again. */
  onReconnect: () => void;
};

export type DepositEntryProps = {
  identity: Identity | null;
  onReconnect: () => void;
};

export type DepositBodyProps = {
  api: DepositApi;
  /** The amount as quoted, formatted back from the quote's lovelace. */
  ada: string;
  onReconnect: () => void;
};

export type AmountFieldProps = {
  amount: string;
  /** Why the typed amount cannot be quoted, or null. */
  problem: string | null;
  disabled: boolean;
  onAmount: (value: string) => void;
};

export type QuoteFactsProps = {
  /** The amount as the user typed it, which is what was priced. */
  ada: string;
  usdValue: number;
  depositAddress: string;
  confirmations: number;
  remaining: number | null;
  expired: boolean;
  copied: boolean;
  onCopy: () => void;
};

export type ReceiptProps = {
  txHash: string;
  confirmations: number;
};

export type FailureNoteProps = {
  failure: DepositFailure;
  /** Present when the transfer already left: the hash is then the proof, not a detail. */
  txHash: string | null;
  onReconnect: () => void;
};

export type FooterProps = {
  state: DepositApi['state'];
  ada: string;
  expired: boolean;
  /** A quote is alive and the expiry has not passed. */
  signable: boolean;
  /** The typed amount can be quoted at all. */
  ready: boolean;
  working: boolean;
  onQuote: () => void;
  onSign: () => void;
  onRetryConfirm: () => void;
  onReset: () => void;
};
