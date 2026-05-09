import { useState } from "react";
import { Web3Wallet } from "@utxos/sdk";
import { IconWallet } from "@tabler/icons-react";

export const AuthButton = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsAuthenticating(true);
      const projectId = import.meta.env.VITE_UTXOS_PROJECT_ID;
      if (!projectId || projectId === 'your_project_id_here') {
        console.error("VITE_UTXOS_PROJECT_ID is not defined in .env");
        alert("Authentication is not configured. Please set VITE_UTXOS_PROJECT_ID in your .env file.");
        return;
      }

      const wallet = await Web3Wallet.enable({
        projectId,
        networkId: 0, // preprod testnet
      });

      if (wallet && wallet.cardano) {
        const addr = await wallet.cardano.getChangeAddress();
        setAddress(addr);
      } else {
        setAddress("Connected");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (address) {
    return (
      <div className="flex items-center gap-2 bg-lavender/20 text-lavender px-4 py-2 rounded-xl text-sm font-bold">
        <IconWallet className="w-5 h-5" />
        <span>
          {address === "Connected" ? address : `${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isAuthenticating}
      className="flex items-center gap-2 bg-lavender text-void px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span>{isAuthenticating ? "Signing In..." : "Sign In"}</span>
    </button>
  );
};
