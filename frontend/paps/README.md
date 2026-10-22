# paps

An interactive trading interface for Strike Finance perpetuals on Cardano. Public
market data is live; orders are paper until an API wallet is connected.

    bun install
    bun run dev        # http://127.0.0.1:5175
    bun run build      # dist/
    bun run test       # order book sync tests

## What is real, and what is not

    market data     real. REST and WebSocket against api.strikefinance.org
    book, depth     real, built from a snapshot plus deltas
    ticket, maths   real formulas from Strike's docs, real tick and lot sizes from
                    exchangeInfo, real 5 bps taker fee
    orders          paper. Filled locally against the mark, no request is sent
    liquidation     strike's isolated formula, first-tier maintenance margin, so it
                    is an estimate and the UI says so

The header badge reads PAPER everywhere, and the ticket repeats it. Nothing in this
app can move funds.

## Strike API notes

The documented base URL is wrong: `/v2/exchangeInfo` returns 404 on both environments.
The live prefix is `/price/v2/...`:

    https://api.strikefinance.org/price/v2
    https://api-v2-testnet.strikefinance.org/price/v2

Builder routes are the exception to that prefix: the connect flow lives at
`/auth/builder/request-signature` and `/auth/builder/verify-signature`, and the fee field
is `fee_share_bps` — sending `max_fee_bps` is rejected as an unknown field, even though
Strike's own `strike-finance-skills` package documents that name.

WebSocket frames may carry several JSON documents separated by newlines. Parsing a
frame as one document silently drops every message after the first.

`/depth` is cached for five seconds server-side. Anchoring the local book to a cached
snapshot drops every delta in between, which shows up as a crossed spread; snapshots
are taken with `X-Cache: MISS` only.

## Environment

    VITE_STRIKE_ENV=mainnet | testnet     defaults to mainnet

Testnet carries four markets (ADA, SOL, BTC, ETH) and live quotes, so the terminal can
be pointed at it with one variable.

## Identity

An address is the identity; a profile is what it remembers.

    CIP-30 wallets     window.cardano, enabled on click, change address read from the
                       wallet — the same connector doba's other front ends use
    UTXOS (utxos.dev)  wired as a provider but not bundled; see lib/identity/utxos.ts
                       for the four-step switch-on. It needs a project id, and its type
                       graph took tsc from 9s to over five minutes, so it stays out
                       until there is something to authenticate against

Preferences live in `localStorage` keyed by address, so switching wallets switches
traders — useful when demoing two accounts:

    risk / swipe   25 · 50 · 100 · 250 · 500
    leverage       2 · 5 · 10 · 20 · 50
    opens on       pro · lite · swipe
    watchlist      markets that lead the deck

Signing in with Strike does ask for a signature, and that is the point: the wallet signs
Strike's consent message, which is what proves a human controls the address.

## Holding the key

paps holds the Strike API wallet key. Strike's consent text says as much ("you are
entrusting your API wallet private key to this builder"), and a browser is the wrong place
for a key that can trade an account.

    where it lives   AES-GCM sealed in D1, one row per session, under MASTER_KEY
    who sees it      the Worker, per request, never the browser and never a log
    session          random token in an HttpOnly, Secure, SameSite=Strict cookie scoped
                     to /api; only its SHA-256 is stored, so the table holds no credential
    expiry           every proxied call checks the API wallet expiry and answers
                     401 reconnect rather than failing upstream; Strike revokes the
                     previous wallet on reconnect, so a session is never permanent

The browser's half of the flow lives in `lib/identity/builder.ts` and calls
`/api/connect/start` then `/api/connect/finish`. Signed venue calls go through
`/api/strike/v2/...`, which signs `METHOD:PATH:TIMESTAMP:NONCE:SHA256(body)` with the held
key and forwards only to an allowlist of routes paps uses.

The server code is in `src/server/` and imports no Workers globals, so every handler is
unit tested against a fake Strike and an in-memory store. `functions/api/` is the thin
adapter that knows about `context`.

`bun run dev` serves the SPA only, so the `/api` routes 404 locally. For the full stack:

    bun run build
    bunx wrangler pages dev dist --d1 DB=paps-keys --binding MASTER_KEY=$(openssl rand -base64 32)

## UTXOS, when you turn it on

    bun add @utxos/sdk
    VITE_UTXOS_PROJECT_ID=...   VITE_NETWORK_ID=1

Then replace the throw in `connectUtxos()` with the four lines in that file. The rest of
the app already speaks `Identity`.

## Deploy

Cloudflare Pages, its own project, its own hostname. Nothing here shares a host with
doba's app or admin.

    bunx wrangler pages deploy dist --project-name paps

One-time, in the dashboard: create the `paps` Pages project, then add `paps.doba.world`
as a custom domain. Build output is `dist`, build command `bun run build`, root
`frontend/paps` if Pages builds it from git rather than from a local deploy.

The signing layer needs three things before the first real connect:

    bunx wrangler d1 create paps-keys        # paste the id into wrangler.toml
    bunx wrangler d1 migrations apply paps-keys --remote
    bunx wrangler pages secret put MASTER_KEY   # openssl rand -base64 32

`MASTER_KEY` seals every stored API wallet key. Losing it means every user reconnects;
leaking it means every stored key is exposed. It belongs in a password manager, not in
the repo, and rotating it invalidates all sessions by design.

The deploy itself is `.github/workflows/paps-worker.yml`, on push to `main` and only for
`frontend/paps/**` — a docs change does not redeploy the app. It runs the Worker smoke test
below first, and refuses to deploy — saying which piece is missing — unless these are set:

    CLOUDFLARE_API_TOKEN    repo secret. Pages: Edit, D1: Edit.
    CLOUDFLARE_ACCOUNT_ID   repo variable.
    PAPS_D1_DATABASE_ID     repo variable. Replaces the placeholder in wrangler.toml at
                            deploy time, so the id is configured once, not committed.
    MASTER_KEY              secret on the `paps` Pages project, checked there rather than
                            copied into GitHub — one copy, one place to leak.

### Verifying the Worker locally

`bunx tsc` and `bunx vitest` drive `src/server` with a fake venue; neither starts a Worker,
binds D1 or makes an HTTP call. This does, and it is what CI runs:

    bun run build
    bunx wrangler@4 d1 migrations apply paps-keys --local --persist-to .wrangler/state
    bash scripts/worker-smoke.sh

Two things about that recipe are load-bearing.

`--persist-to .wrangler/state` on the migration and no `--d1` flag on the boot. Not passing it
is the trap this test exists for: `wrangler d1 execute --local` and `pages dev --d1 NAME=...`
resolve different database ids, so the migration reports success and the Worker reads an
empty database, and every route that touches D1 answers 500. With one state directory and the
binding taken from `wrangler.toml`, both sides see the same file. `wrangler@4`, not the 3.x
line, which caps the runtime compatibility date at 2025-02-24 while this Worker asks for
`2026-10-01`.

The smoke test must fail on a fresh `.wrangler/`. It asserts `/api/session` is 401 without a
cookie, `/api/connect/start` is 200 with a handle and a venue challenge, a seeded session
reads back, `/api/strike/withdraw` is 403 `path_not_allowed`, and `/api/strike/positions` is
signed and answered by Strike rather than by paps. Delete the state and it fails on
`connect/start` with `no such table: pending_challenges` — that green-to-red is the check
that the migration landed where the Worker reads it, and it is the one thing a compiler
cannot tell you.

The connect and proxy assertions talk to the live venue, so they need egress to
`api.strikefinance.org`. The seeded session's key is thrown away and unknown to Strike: the
assertion is that the Worker signed and sent the call, not that Strike authorised it.
