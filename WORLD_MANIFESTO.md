# WORLD_MANIFESTO.md

> **100 invested fans outperform 100,000 streams.**

---

## 1. The Status Quo Is Broken

The music industry runs on deferred value and rented audiences. An artist uploads a master recording to a distributor, the distributor hands it to a platform, the platform pools it into a pro-rata royalty pot, and months later a statement arrives: fractions of a cent per stream, minus the label's cut, minus the distributor's fee, minus the aggregator's margin. The fan who pressed play has no relationship with the artist, no proof of support, and nothing to hold. The artist has no idea who their listeners are, because the platform owns the audience graph and rents access back to the creator who built it.

Even the tools meant to liberate artists recreate the same dependency. Download stores take 30%. "Fan clubs" are mailing lists the platform can revoke. Collaborator splits are settled with spreadsheets, invoices, and trust. Secondary markets — where a record actually accrues cultural value — pay the original artist exactly nothing. Every layer between the person who makes the music and the person who loves it extracts rent and adds latency. The entire stack is a chain of middlemen who contribute distribution and take ownership.

## 2. Our Core Thesis

Doba Protocol deletes the middle of that chain. We settle value on Cardano, store masters and metadata on IPFS, and enforce the business terms in Aiken-written Plutus V3 validators — not in a terms-of-service document. When a fan collects a release, the `distribution` validator pays the artist's wallet directly, atomically, in the same transaction that delivers the token. There is no payout threshold, no monthly statement, no counterparty. The protocol's fee is hard-coded in basis points inside the validator itself, visible and auditable by anyone.

This is possible now because the infrastructure finally crossed the usability threshold. CIP-68 gives us a reference token that carries mutable, standards-compliant metadata while the ownership token stays in the holder's wallet. CIP-60 v3 gives music a native on-chain metadata schema — song title, ISO-8601 duration, artists, files — that any indexer or marketplace can read without asking us. Wallet-signature challenge-response auth means your identity is your keypair, not a row in our user table. A decade ago "own your masters, own your audience" was a slogan. Today it is a transaction flow: drag an audio file onto the page, set your splits, sign, done.

## 3. Our Non-Negotiable Principles

- **Settlement over statements.** Payment executes in the collecting transaction itself. The distribution validator enforces creator payment and treasury fee on-chain; if the outputs don't match, the transaction fails. An artist should never wait 90 days to learn what they already earned.

- **The ledger over the database.** Our Postgres is a cache, not a source of truth. Downloads and ownership checks verify holdings on-chain (`verifyOwnershipOnChain`) and sync back to the database only as an index. If our servers disappeared tomorrow, every record of who owns what would survive — because it never lived on our servers.

- **Standards over lock-in.** CIP-68 for token structure, CIP-60 v3 for music metadata, IPFS CIDs for media. Any wallet, explorer, or competing marketplace can resolve a Doba release without our permission or our API. We link provenance straight to public explorers. Data that only works inside our app is a liability, not a moat.

- **Signatures over passwords.** Authentication is a nonce challenge answered by a Cardano wallet signature. There are no credentials to breach and no accounts to take over. Refresh tokens rotate with full family revocation on reuse — because a bearer of a keypair deserves infrastructure as careful as the keys.

- **Contracts over promises.** Collaborator splits, royalty rates, and supply caps are parameters of the minting and distribution validators, enforced by the ledger. "Trust us" is not a feature. The validator suite has been audited for double-satisfaction, value conservation, and datum integrity — and the audit findings live in the repo, in the open, under AGPL.

- **Creator sovereignty over platform gravity.** The artist's key — and only the artist's key — can mint, update metadata, reprice, reclaim unsold fractions, or burn the release entirely. The protocol can route value, but it can never seize the work.

- **Radical transparency over quiet rent.** One fee, in basis points, in the validator source. 90% to the artist on primary sales. 5% perpetual royalty to the creator on secondary sales. If a number can't be defended on-chain, it doesn't ship.

## 4. The World We Are Building

A musician in Lagos uploads a track on a Friday night. By Saturday morning a collector in Berlin owns fraction #17 of 1,000, the artist's wallet holds the proceeds, the producer's split has already landed, and the master is pinned to IPFS under a CID that will outlive every company involved. There was no distributor, no advance, no recoupment schedule, no gatekeeper's yes.

Scale that across the industry and the economics of music invert. Catalogs stop being illiquid assets hoarded by funds and become living, fan-held portfolios. Artists stop optimizing for playlist placement and start building direct, provable relationships with the thousand people who actually fund their work. Listeners stop renting access and start holding stake — in the art, in the artist, in the outcome. The audience graph belongs to the people in it, because it is written to a public ledger nobody can revoke.

For developers, this world is composable by default: open validators, standard metadata, AGPL source. Build a better player, a niche marketplace, an analytics layer, a physical-goods redemption flow — the protocol doesn't care, and that's the point. Infrastructure wins by being built on, not by walling off.

## 5. Join the Movement

If you're an artist tired of invoicing platforms for your own audience — connect a wallet and release something. If you're a collector who believes support should be provable, permanent, and direct — collect a fraction and hold the proof. If you're a developer who thinks the ledger should be the source of truth and the platform should be disposable — the contracts, the gateway, and the app are all in this repository under AGPL-3.0. Read the validators. Break them. Make them better.

The old industry was a pipeline with toll booths. We're building a protocol with none.

**Star the repo. Ship a release. Own the work.**
