# paps

An interactive trading interface for Strike Finance perpetuals on Cardano. Public
market data is live; orders are demo until an API wallet is connected, and go to Strike
through the signing proxy after that.

    bun install
    bun run dev        # http://127.0.0.1:5175
    bun run build      # dist/
    bun run test       # order book sync tests

## What is real, and what is not

    market data     real. REST and WebSocket against api.strikefinance.org
    book, depth     real, built from a snapshot plus deltas
    ticket, maths   real formulas from Strike's docs, real tick and lot sizes from
                    exchangeInfo, real taker rate from /v2/fee-tiers with a stated
                    fallback
    orders          demo until a session exists: filled locally against the mark, no
                    request sent. With a session they are venue orders, two clicks, and
                    the venue's ids come back
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

The user stream (`/ws/user-api`, channel `userstream`) is not public. An `account_id`
subscribe without credentials answers 401 "Authentication required", while the same
connection with a random `vault_id` answers 404 "Vault not found" — vault streams resolve
without auth, account streams refuse before resolving. `AUTH` is refused as "not
available on this endpoint", so `session.logon` with an Ed25519 API wallet is the only
door, and the key is one the Worker holds and the browser must not. Fills, liquidations
and funding therefore cannot arrive on a socket the page opens. The frames and the parser
traps are in `docs/user-stream.md`.

## Environment

    VITE_STRIKE_ENV=mainnet | testnet     defaults to mainnet

Testnet carries four markets (ADA, SOL, BTC, ETH) and live quotes, so the terminal can
be pointed at it with one variable.

## Screens

Four tabs, one job each: **Deck** (swipe a market), **Trade** (asset page, ticket in a
sheet), **Positions** (what is open, and the two ways out), **You** (equity, behaviour,
risk and leverage). Below `sm` a position is a card; the blotter table is for wide screens.
The header carries four facts only — symbol, price, 24h change, freshness.

## Identity

Sign-in is one tap on a phone: **Continue with Google** through UTXOS, which creates an
embedded non-custodial Cardano wallet and signs Strike's consent message from it. A
browser wallet (CIP-30) stays available for people who already have one.

    VITE_UTXOS_PROJECT_ID   from the utxos.dev dashboard; without it only CIP-30 works
    VITE_BUILDER_CODE       paps — registered on mainnet, not on testnet
    fee                     requested at 0 bps; the builder's cut is taken by Strike

Two build notes worth keeping: UTXOS is Mesh underneath and needs node crypto polyfills
(`vite-plugin-node-polyfills`, crypto/buffer/stream only), and `libsodium-wrappers-sumo`
ships a broken relative import that is aliased to its CJS build. Both live in
`vite.config.ts` with the reason inline. The SDK is split into a `wallet` chunk so the
deck still opens without it.


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
    limits           per-session buckets on the proxy, per-IP on connect, counted in D1;
                     see Limits below

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

With a session the blotter stops being paper. `lib/strike/venue.ts` reads `account`,
`positions`, `openOrders`, `history/funding` and `history/transaction` through
`/api/strike/<path>` with `credentials: 'same-origin'`, and `hooks/useVenueAccount.ts`
refreshes on a 30s poll and on window focus.

    status    idle (no session) · loading · live · stale · reconnect
    on error  the previous numbers stay, with their age, and that age is what turns red
    on 401    the poll stops until connect runs again; it never retries a revoked key

Amounts stay the strings the venue sent and are formatted at the edge, because an entry
price is not a float. The header badge says `live` once a session exists and the blotter's
own header carries the age of that read, so a stale account never pretends to be current.

## Trading on the venue

`hooks/useVenueTrade.ts` is the only path that spends money, and it is two clicks: the
ticket (or a swipe) arms an intent, `components/OrderConfirm.tsx` shows the symbol, the
venue's side, the size at the market's step, the notional and both fees, and the second
click sends it. The rules it enforces:

    one order per intent    the client id is minted once and reused on retry, so a network
                            failure that actually landed cannot double a position
    leverage first          a failed setLeverage blocks the placement, because the margin
                            and liquidation on screen would otherwise be wrong
    accepted, not filled    an acceptance shows `accepted · seq N` until a read says more;
                            fills are only ever reported from the venue's /history/fill
    close and cancel        half or all, never a slice the venue has to guess; every write
                            asks for a read afterwards instead of assuming the result
    blocked, with a reason  a stale or reconnecting session turns the CTA off and says why

`lib/strike/fees.ts` parses the public `/v2/fee-tiers` (PascalCase today, camelCase in the
docs) and reports the 5 bps fallback as unknown when the schedule does not parse, rather
than presenting the fallback as the venue's rate.

## Deposits

The deposit flow is server-side so far: quote, build-tx and confirm, each signed through the
proxy, with amounts passed as lovelace strings because `Number(ada) * 1e6` loses lovelace past
about nine billion ADA. Failures are states, and the two 400s are not the same failure:

    amount_rejected   400 at quote: the venue refused the amount itself, which is what a
                      deposit below its minimum looks like. The venue's own message is
                      carried through, because that minimum is not documented anywhere
    quote_expired     400 at build or confirm: the quote died at the venue, so re-quote
    account_mismatch  403: the request_id belongs to another account
    already_submitted 409: Strike already has this transaction
    reconnect         401: the API wallet behind the session can no longer sign

## Limits

A session cookie is a handle on a key that can trade. It is therefore counted, in two
places, before any signature is made:

    /api/strike/v2/*   per session. Reads and writes are separate buckets
    /api/connect/*     per client IP, counting both steps of the flow

Reads are looser than writes on purpose. The terminal polls positions, orders and history
while a ticket is open, so a poll loop must never be able to starve an order, and a closed
write bucket must not blind the screen. Splitting them also means two sessions never share a
bucket: one abusive client cannot lock anyone else out.

A bucket holds one minute's allowance and refills continuously over that minute, so a client
that stops abusing it is back in service without waiting for a fixed window to roll over.
Over the line the answer is `429` with `retry-after`, and the same number as
`retryAfterSeconds` in the body, so a client can state a cooldown instead of retrying in a
loop. Nothing is sent upstream: the limit runs before the key is opened.

    RATE_READ_PER_MIN     240   proxy reads, per session
    RATE_WRITE_PER_MIN     30   proxy writes, per session
    RATE_CONNECT_PER_MIN   10   connect calls, per client IP

Those are the defaults in `src/server/rateLimit.ts`, so an environment that sets nothing
still has a limit. Set them per environment in `wrangler.toml` `[vars]` (or the Pages
dashboard for the deployed one). A value that is not a positive whole number falls back to
the default rather than turning the limit off — a typo must not disarm a control.

The counters live in `rate_limit_buckets`, one small row per bucket. This is the point of
the table: a count held in a Worker isolate is a suggestion, because every new isolate
starts full and a burst spread across the fleet gets admitted as if nothing had happened.
Refilling and spending are a single statement against the row, so two isolates racing cannot
both take the last token. Idle rows are only a timestamp, and can be pruned:

    bunx wrangler d1 execute paps-keys --remote --command \
      "DELETE FROM rate_limit_buckets WHERE updated_at < (strftime('%s','now') - 3600) * 1000"

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

`migrations/` holds both tables that matter: `0001` seals the API wallet keys,
`0002` counts the requests that spend them. An existing deployment needs the same apply to
pick up `0002`; the limit reads and writes the new table on every proxied call, so a
deployment that skips it answers 500 rather than signing without a limit.

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
