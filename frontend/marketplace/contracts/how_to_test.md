# Doba Protocol: Smart Contract Testing Guide

This guide explains how to compile the smart contracts, fund the test wallets, deploy the contracts, execute token distribution, and view the transactions and tokens on the Cardano Preprod testnet.

---

## Prerequisites

Make sure you have the following installed on your system:
- **Aiken CLI** (v1.1.x+) — to compile the smart contracts.
- **Deno** (v1.40.x+) — to run the TypeScript orchestration scripts.
- A **Cardano Preprod address** and corresponding private key.

---

## 1. Setup & Environment Configuration

1. **Configure Environment Variables:**
   Ensure you have a `.env` file in the root directory containing your Blockfrost Preprod Project ID:
   ```bash
   NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=preprod...
   ```

2. **Verify Wallet Keys:**
   Navigate to the `contracts` directory. You should find the following credentials generated:
   - `owner.sk` / `owner.addr` — Creator wallet.
   - `beneficiary.sk` / `beneficiary.addr` — Co-owner (buyer) wallet.

---

## 2. Compile the Smart Contracts

Compile the Aiken validators into a Plutus blueprint (`plutus.json`). Run this from the `contracts` directory:

```bash
cd contracts
aiken build
```

This compiles `validators/frac.ak` and updates `plutus.json` in the same directory, which is read by the Deno scripts.

---

## 3. Fund the Test Wallets

To execute transactions, both your `owner.addr` (creator) and `beneficiary.addr` (co-owner) wallets need test ADA (tADA) to pay for transaction fees and deposit requirements.

1. Display your creator and co-owner addresses:
   ```bash
   cat owner.addr
   cat beneficiary.addr
   ```
2. Request tADA from the official faucet:
   - **Url:** [Cardano Preprod Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet/)
   - Select **Preprod Testnet** and request funds for both addresses.

---

## 4. Run the Orchestration Scripts

All scripts are executed from the `contracts` directory. Deno requires network and file access permissions.

### Step 4A: Split UTxOs (Highly Recommended)
If your creator (`owner.addr`) wallet only has one large UTxO (e.g. from a single faucet request), you may experience transaction failures due to a lack of change/collateral inputs. Split them first:

1. Open `validators/frac.ts` and set the `PHASE` constant at the top to `"mint"`.
2. In the `try` block, uncomment the UTxO split section:
   ```typescript
   const splitTx = await splitUtxos()
   await lucid.awaitTx(splitTx)
   console.log(`✅ UTxOs split! Tx Hash: ${splitTx}`)
   ```
3. Run the script:
   ```bash
   deno run --allow-net --allow-read --allow-env validators/frac.ts
   ```
4. Once completed, re-comment the split code block.

### Step 4B: Phase 1 — Minting Tokens
Mints 1 Reference Token (carrying metadata) and 1000 Fractional Tokens.

1. Open `validators/frac.ts` and set the `PHASE` constant to `"mint"`.
2. Run the script:
   ```bash
   deno run --allow-net --allow-read --allow-env validators/frac.ts
   ```
3. Copy the outputted **Policy ID** and **Tx Hash** for reference.

### Step 4C: Phase 2 — Distributing/Claiming Fractions
Allows a co-owner (buyer) to claim a single fraction from the distribution script.

1. Open `validators/frac.ts` and set the `PHASE` constant to `"distro"`.
2. Run the script:
   ```bash
   deno run --allow-net --allow-read --allow-env validators/frac.ts
   ```
   *Alternative:* You can run `buy.ts` directly, which selects the co-owner's private key to execute the claim:
   ```bash
   deno run --allow-net --allow-read --allow-env validators/buy.ts
   ```

### Step 4D: Phase 3 — Updating Metadata
Updates the inline CIP-60 version 3 metadata of the reference token locked under the `locking` script.

1. Open `validators/frac.ts` and set the `PHASE` constant to `"update"`.
2. Run the script:
   ```bash
   deno run --allow-net --allow-read --allow-env validators/frac.ts
   ```

---

## 5. View Your Tokens and Transactions

Since all interactions take place on the Cardano Preprod testnet, you can look up your transactions, UTxOs, and tokens using Preprod explorers:

1. **View Mint / Update Transactions:**
   Search the transaction hashes printed by your scripts on [Cardanoscan Preprod](https://preprod.cardanoscan.io).
2. **View CIP-60 Metadata:**
   Look up your reference token by searching the generated `PolicyID` + `Asset Name` on Cardanoscan or Cexplorer Preprod.
3. **Verify Locking Script Utxo:**
   Verify that the reference token remains locked at the locking script address with the correct metadata datum version.
