import { QueryClient } from '@tanstack/react-query';

export const CARDANO_NETWORK = 'Mainnet';

export const BLOCKFROST_PROJECT_ID =
  process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID_MAINNET || 'mainnetGh0oJFsbqjGDzAV5mdGUI8wv9zxQlkUk';

export const MINTING_POLICY_ID = process.env.NEXT_PUBLIC_MINTING_POLICY_ID || '';

export const EXPLORER_URL = 'https://cardanoscan.io';

export const queryClient = new QueryClient();

export const TREASURY_ADDRESS =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS_MAINNET ||
  'addr1q9zxp864enlra5tmgl6y32havq946njdxa7qd4gcxetj0seycr094w3r7jt7sp46j7t6gz8k6aljk40k46cjm5epvjzsj0dkpq';

export const FEE_BPS = 700n; // 7%
