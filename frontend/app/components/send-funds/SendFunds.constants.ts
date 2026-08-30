import type { AmountPreset } from './SendFunds.types';

export const AMOUNT_PRESETS: AmountPreset[] = [
	{ label: '25%', percent: 0.25 },
	{ label: '50%', percent: 0.5 },
	{ label: 'MAX', percent: 1 },
];

export const MAX_PRESET_LABEL = 'MAX';

export const BALANCE_POLL_INTERVAL_MS = 15000;

export const FEE_BUFFER_LOVELACE = 1500000n;

export const MAX_PRESET_FEE_BUFFER_ADA = 1.5;
