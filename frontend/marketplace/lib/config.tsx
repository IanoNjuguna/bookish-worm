import { QueryClient } from '@tanstack/react-query';

export const CARDANO_NETWORK = 'Mainnet' as const;

const rawBlockfrostProjectId = (process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID_MAINNET || '').trim();
export const BLOCKFROST_PROJECT_ID = rawBlockfrostProjectId.replace(/^['\"]|['\"]$/g, '');

export const MINTING_POLICY_ID = process.env.NEXT_PUBLIC_MINTING_POLICY_ID || '';

export const EXPLORER_URL = 'https://cardanoscan.io';

export const queryClient = new QueryClient();

export const TREASURY_ADDRESS = process.env.NEXT_PUBLIC_TREASURY_ADDRESS_MAINNET;
	
export const FEE_BPS = 500n; // 5%

