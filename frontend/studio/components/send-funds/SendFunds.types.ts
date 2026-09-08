export interface AmountPreset {
	label: string;
	percent: number;
}

export interface UtxoLike {
	assets?: { lovelace?: bigint };
}
