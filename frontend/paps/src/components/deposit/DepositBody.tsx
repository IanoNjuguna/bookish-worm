import { DepositAmount } from './DepositAmount';
import { DepositFailureNote } from './DepositFailureNote';
import { DepositQuoteFacts } from './DepositQuoteFacts';
import { DepositReceipt } from './DepositReceipt';
import type { DepositBodyProps } from './DepositSheet.types';

/**
 * Everything above the action: what is being sent, what it was quoted at, the receipt, or why it
 * stopped. One of those four, in that order, and the sections stay mounted through a failure so
 * a retry does not lose the face of the deposit.
 */
export function DepositBody({ api, ada, onReconnect }: DepositBodyProps) {
  const { state } = api;

  if (api.blocked) {
    return <p className="text-small leading-relaxed text-muted">{api.blocked}</p>;
  }

  const frozen = api.working || state.txHash !== null;

  return (
    <div className="space-y-3">
      <DepositAmount
        amount={api.amount}
        problem={api.problem?.message ?? null}
        disabled={frozen}
        onAmount={api.setAmount}
      />

      {state.quote && !state.txHash && (
        <DepositQuoteFacts
          ada={ada}
          usdValue={state.quote.usdValue}
          depositAddress={state.quote.depositAddress}
          confirmations={state.quote.confirmationsRequired}
          remaining={api.remaining}
          expired={api.expired}
          copied={api.copied}
          onCopy={api.copyAddress}
        />
      )}

      {state.stage === 'pending' && state.txHash && (
        <DepositReceipt
          txHash={state.txHash}
          confirmations={state.quote?.confirmationsRequired ?? 0}
        />
      )}

      {state.failure && (
        <DepositFailureNote failure={state.failure} txHash={state.txHash} onReconnect={onReconnect} />
      )}
    </div>
  );
}
