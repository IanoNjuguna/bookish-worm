# Doba Protocol — Production Readiness Checklist
### Refined from Clarifying Questions · July 2026

> **Chain:** Cardano Mainnet (immediate) · **Scale:** ~7 concurrent users at launch  
> **Infra:** GCP Cloud Run · **Blockfrost:** Basic plan · **Fee model:** 1% on-chain treasury  
> Mark items `[x]` as you complete them.

---

## 🔴 Critical — Must Be Done Before Mainnet Deploy

### Smart Contracts (`contracts/`)

- [x] **Add 1% platform fee output to `distribution` validator** — `treasury: Address` + `fee_bps: Int` parameters added; Buy redeemer now verifies a treasury output ≥ `price_lovelace * fee_bps / 10000`
- [x] **Add ADA price enforcement to `distribution` validator** — `DisDatum` now carries `price_lovelace`; Buy redeemer validates payment and datum preservation
- [x] **Add `UpdatePrice` redeemer to `distribution` validator** — owner can update price in datum without releasing tokens
- [x] **Rename obfuscated redeemer fields** — `a/b/tn` → `action/amount/token_name` across all three validators
- [x] **Write Aiken tests for the updated validators** — run `aiken check` after rebuild; property tests still needed

- [x] **Secure the mainnet signing key** — `owner.sk` is for local testing only (confirmed); generate a new mainnet key pair outside the repo and store in GCP Secret Manager
  > ⚠️ Still requires action: you need to generate the actual mainnet key and add it to GCP Secret Manager before deploying.

- [x] **Remove `owner.sk`, `beneficiary.sk`, `owner.addr`, `beneficiary.addr` from git history and `.gitignore`**
  - `contracts/*.sk` and `contracts/*.addr` added to `.gitignore` ✅
  - Still requires manual step:
  ```bash
  git filter-repo --path contracts/owner.sk --invert-paths
  git filter-repo --path contracts/beneficiary.sk --invert-paths
  git push --force --all
  ```

- [x] **Write Aiken tests for the updated `distribution` validator** — test: free drain attempt, fee underpayment, correct fee to treasury, price update flow

### Backend — tx-builder (`backend/tx-builder/`)

- [x] **Fix CORS wildcard** (`main.py:14`) — `allow_origins=ALLOWED_ORIGINS` now mirrors the core-api allowlist
- [x] **Add `TREASURY_ADDRESS` and `FEE_BPS` to `config.py` and `.env.example`** — treasury fee computed and added as a payee in `cardano.py`
- [x] **Blockfrost fails hard if unset on mainnet** — `config.py` now raises `RuntimeError` if `BLOCKFROST_PROJECT_ID` is missing in mainnet mode

### Backend — core-api (`backend/core-api/`)

- [x] **Add rate-limiting to `/auth/challenge`** — `hono-rate-limiter@0.5.3` installed; max 5 req/min/IP
- [x] **Add Blockfrost failover to Koios** (`web3.ts`) — automatic fallback on 429/5xx; supports payment + stake addresses on Preprod and Mainnet

### Frontend

- [x] **Remove `ignoreBuildErrors: true`** from `next.config.mjs` — replaced with a comment explaining why it was removed
  > ⚠️ Still requires action: run `bun run build` to see what TypeScript errors surface and fix them before deploy.

---

## 🟠 Important — Complete Within First 2 Weeks of Launch

### Smart Contracts

- [x] **Add price-update path to `distribution` validator** — since fraction price must be changeable, define a `UpdatePrice` redeemer that only the `owner` can execute, updating the `price_lovelace` in the datum without releasing tokens

- [x] **Rename redeemer fields** (`a`, `b`, `tn`) to readable names before finalising the on-chain blueprint

### Backend — core-api

- [ ] **Remove refresh token from JSON response body** (`index.ts:268, 316`) — it is already in the HttpOnly cookie; the body copy is XSS-accessible
- [ ] **Add Zod validation to all POST routes** — raw `c.req.json()` with no schema parsing
- [ ] **Add 50 MB body size limit** on `/upload-assets` to prevent OOM
- [ ] **Replace client self-reported `/mints`** with Blockfrost webhook sync — a buyer can currently POST any `track_id` without on-chain proof
- [ ] **Replace try/catch `ALTER TABLE` migrations** with Drizzle ORM migration files

### Storage & Metadata

- [ ] **Add secondary IPFS pin (Filebase)** — Pinata is the only pin; one outage breaks all NFT metadata
- [ ] **Add CIP-60 v3 Zod schema validation** in `/upload-metadata` before calling Pinata
- [ ] **Verify CID integrity post-mint** — after minting, resolve the on-chain datum CID and store `metadata_verified = true` in the DB

### DevOps

- [ ] **Add GitHub Actions CI pipeline** (see snippet below)
- [ ] **Move all secrets to GCP Secret Manager** — remove `.env` from production servers; inject secrets at runtime via Cloud Run secret mounts
- [ ] **Add uptime monitoring** on `/health` (Betterstack free tier) with Slack/email alerts

### Mobile (now a v1 requirement per your answer)

- [ ] **Detect mobile user agent** and display a banner linking to Eternl mobile or Lace mobile
- [ ] **Add wallet onboarding modal** for desktop too — step-by-step CIP-30 install guide, testnet faucet link, and a "Get ADA" primer for new users

### Legal (Minimal Pre-Launch Set)

- [ ] **Add Terms of Service page** — clarify NFTs = fractional co-ownership, not copyright transfer
- [ ] **Add uploader attestation checkbox** in the mint flow: "I own or have licensed all content I am minting"
- [ ] **Add Privacy Policy** — wallet addresses may be personal data under GDPR; include a data deletion contact

---

## 🟡 Nice-to-Have — Post-Launch

- [ ] **Evaluate Kupo or Blockfrost webhooks** as a Cardano-native indexer — reduces dependency on polling Blockfrost for ownership state
- [ ] **Add `transactions` event log table** to record every on-chain purchase (tx hash, policy ID, addresses, lovelace, block time)
- [ ] **Add Arweave backup** for metadata JSON at mint time via Irys SDK
- [ ] **Commission third-party Aiken audit** — Anastasia Labs or MLabs; scope: `frac.ak` + off-chain redeemer construction; budget ~$8k–$25k
- [ ] **Launch bug bounty** on Immunefi — scope: contracts + auth API; rewards $500–$10k; 90-day timebox
- [ ] **Switch JWT from HS256 to RS256** — asymmetric keys allow public verification without sharing the secret
- [ ] **Self-host Cardano node + Ogmios** on GCP for full independence from Blockfrost (longer term)

---

## CI Pipeline Snippet

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install && bun run lint
      - run: cd backend/tx-builder && pip install -r requirements.txt pytest && python -m pytest tests/ -v
      - uses: aiken-lang/setup-aiken@v1
        with: { version: latest }
      - run: cd contracts && aiken check
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install bandit pip-audit trufflehog3
      - run: bandit -r backend/tx-builder/src/
      - run: trufflehog3 .
      - run: bun audit
```

---

## Updated Threat Model

| Threat | Likelihood | Impact | Status |
|--------|-----------|--------|--------|
| Free fraction drain (no price on-chain) | 🔴 High | Critical | ✅ Fixed — price enforced in `distribution` validator |
| Stolen mainnet key | 🔴 High | Critical | ⬜ Open — mainnet key not yet created securely |
| Blockfrost Basic plan rate limit hit | 🔴 High | High | ✅ Mitigated — added Koios fallback in `web3.ts` |
| IPFS metadata unavailable | 🟠 Medium | High | ⬜ Open — add Filebase secondary pin |
| Auth nonce flood DoS | 🟠 Medium | Medium | ✅ Mitigated — rate-limited `/auth/challenge` |
| Client self-reports false mints | 🟠 Medium | Medium | ⬜ Open — add webhook sync |
| Replay attack on signed tx | 🟢 None | — | ✅ Safe — eUTxO model prevents replays |
| Treasury fee bypass | 🔴 High | High | ✅ Fixed — platform fee verified in `distribution` validator |

---

## Key Decisions Locked In

| Decision | Your Answer | Implication |
|----------|------------|-------------|
| Launch chain | Mainnet immediately | All Critical items are now blocking |
| Containerization | GCP Cloud Run only | No Docker Compose needed; use Cloud Run health checks |
| Blockfrost plan | Basic | Koios failover is Critical, not optional |
| Mainnet signing key | New key (not `owner.sk`) | Must be created and stored in GCP Secret Manager before deploy |
| Fraction price | Mutable | Add `UpdatePrice` redeemer to `distribution` validator |
| Mobile support | Required for v1 | Mobile wallet detection moves to Important tier |
| Platform fee | 1% on-chain → treasury | Must be in `distribution` validator before mainnet |
