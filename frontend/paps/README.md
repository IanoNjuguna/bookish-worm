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

Sign-in is one tap on a phone: **Continue with Google** through UTXOS, which creates an
embedded non-custodial Cardano wallet and signs Strike's consent message from it. A
browser wallet (CIP-30) stays available for people who already have one.

    VITE_UTXOS_PROJECT_ID   from the utxos.dev dashboard; without it only CIP-30 works
    VITE_BUILDER_CODE       paps — registered on mainnet, not on testnet
    fee                     requested at 0 bps: paps never sends an order

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

Nothing here asks for a signature: connecting identifies, it does not authorise. Orders
are paper and the wallet cannot be asked to move anything.

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
