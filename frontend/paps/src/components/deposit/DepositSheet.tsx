import { lovelaceToAda } from '../../lib/deposit/amount';
import { useDeposit } from '../../hooks/useDeposit';
import { Sheet } from '../sheets/Sheet';
import { DepositBody } from './DepositBody';
import { DepositFooter } from './DepositFooter';
import type { DepositSheetProps } from './DepositSheet.types';

/**
 * The deposit screen: amount, quote, wallet signed transfer, hash.
 *
 * Every address and every byte of cbor shown or signed here came back from one of the three
 * endpoints. This component decides nothing about money; it renders `useDeposit`, which renders
 * `machine.ts`, which is where the ordering rules live and where they are tested.
 */
export function DepositSheet({ open, onClose, identity, onReconnect }: DepositSheetProps) {
  const api = useDeposit(identity);
  const { state } = api;

  // The quote's own lovelace decides what was priced. The typed string is the input, not the fact.
  const ada = state.quote ? lovelaceToAda(state.quote.lovelace) : api.amount;

  const reconnect = () => {
    onReconnect();
    onClose();
  };

  const footer = api.blocked ? undefined : (
    <DepositFooter
      state={state}
      ada={ada}
      expired={api.expired}
      signable={state.quote !== null && !api.expired && !api.working}
      ready={api.problem === null && api.amount.trim() !== ''}
      working={api.working}
      onQuote={api.quote}
      onSign={api.sign}
      onRetryConfirm={api.retryConfirm}
      onReset={api.reset}
    />
  );

  return (
    <Sheet open={open} title="deposit ada" onClose={onClose} footer={footer}>
      <DepositBody api={api} ada={ada} onReconnect={reconnect} />
    </Sheet>
  );
}
