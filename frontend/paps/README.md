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
`/api/strike/<path>`, which maps onto the venue's `/v2/<path>` (our URLs do not repeat the
`/v2`, because `/api/strike/v2/positions` would forward as `/v2/v2/positions`), signs
`METHOD:PATH:TIMESTAMP:NONCE:SHA256(body)` with the held key, and forwards only to an
allowlist of routes paps uses.

The server code is in `src/server/` and imports no Workers globals, so every handler is
unit tested against a fake Strike and an in-memory store. `functions/api/` is the thin
adapter that knows about `context`.

`bun run dev` serves the SPA only, so the `/api` routes 404 locally. For the full stack:

    bun run build
    bunx wrangler pages dev dist --d1 DB=paps-keys --binding MASTER_KEY=$(openssl rand -base64 32)

## Reading the account

With a session, the blotter and the header stop being paper: `lib/strike/venue.ts` reads
`account`, `positions`, `openOrders`, `history/funding` and `history/transaction` through
`/api/strike/<path>` with `credentials: 'same-origin'`, and `hooks/useVenueAccount.ts`
refreshes on a 30s poll and on window focus.

    status    idle (no session) · loading · live · stale · reconnect
    on error  the previous numbers stay, with their age, and the age is what turns red
    on 401    the poll stops until connect runs again; it never retries a revoked key

Amounts are kept as the strings the venue sent and formatted at the edge with
`lib/format.ts`, because an entry price is not a float. Ordering is still paper: the
header says `live mainnet`, and the ticket button still says `still paper`, because no
order leaves the browser in this build.

The base taker rate comes from the public `/v2/fee-tiers` (PascalCase today, camelCase in
the docs) rather than a hardcoded 5 bps. When the schedule does not parse, the surfaces
say `5 bps fallback` instead of presenting the fallback as the venue's rate.

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
