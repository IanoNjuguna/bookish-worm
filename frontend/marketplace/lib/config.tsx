import { QueryClient } from '@tanstack/react-query';

const rawNetwork = (process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'Mainnet').trim().toLowerCase();
export const CARDANO_NETWORK = rawNetwork === 'preprod' ? 'Preprod' : 'Mainnet';

const rawBlockfrostProjectId = (
	(
		CARDANO_NETWORK === 'Mainnet'
			? process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID_MAINNET
			: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID_PREPROD
	) || process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID || ''
).trim();

export const BLOCKFROST_PROJECT_ID = rawBlockfrostProjectId.replace(/^['\"]|['\"]$/g, '');

export const BLOCKFROST_URL = CARDANO_NETWORK === 'Mainnet'
	? 'https://cardano-mainnet.blockfrost.io/api/v0'
	: 'https://cardano-preprod.blockfrost.io/api/v0';

export const MINTING_POLICY_ID = process.env.NEXT_PUBLIC_MINTING_POLICY_ID || '';

export const EXPLORER_URL = 'https://cardanoscan.io';

export const queryClient = new QueryClient();

export const TREASURY_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS_MAINNET || '';

export const FEE_BPS = 500n; // 5%

