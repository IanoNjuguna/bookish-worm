'use client';

import React from 'react';
import { useSendFunds } from './send-funds/useSendFunds';
import { SendFundsHeader } from './send-funds/SendFundsHeader';
import { RecipientField } from './send-funds/RecipientField';
import { AmountField } from './send-funds/AmountField';
import { SendButton } from './send-funds/SendButton';

export function SendFunds() {
	const funds = useSendFunds();

	return (
		<div className="space-y-5">
			<SendFundsHeader />

			<div className="space-y-4">
				<RecipientField
					recipient={funds.recipient}
					onRecipientChange={funds.setRecipient}
				/>
				<AmountField
					amount={funds.amount}
					balance={funds.balance}
					isLoadingBalance={funds.isLoadingBalance}
					activePreset={funds.activePreset}
					onAmountChange={funds.handleAmountChange}
					onPresetSelect={funds.handlePercentage}
				/>
			</div>

			<SendButton
				isValid={funds.isValid}
				isSending={funds.isSending}
				onSend={funds.handleSend}
			/>
		</div>
	);
}
