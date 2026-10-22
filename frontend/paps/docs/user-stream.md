# The user stream needs a signature, not an id

What we asked: whether an ordinary account's `userstream` authenticates by `account_id`
alone, or needs an API-wallet signature. It needs the signature. Probed against
`wss://api.strikefinance.org/ws/user-api` on 2026-10-22; every frame below is a
transcript, not a reconstruction.

## The frames

A random uuid as `account_id`:

    out  {"method":"subscribe","channel":"userstream","account_id":"3200e542-4dc8-459b-9f78-084b29645d80","id":1}
    in   {"e":"error","E":1792670853893,"error":{"code":401,"msg":"Authentication required: use AUTH or session.logon before subscribing to user data streams"}}
    close 1005

The account id from Strike's own user-stream docs, in case the first rejection was about
the account not existing:

    out  {"method":"subscribe","channel":"userstream","account_id":"0199dc01-720d-7314-84d3-b3c3a102a9f9","id":1}
    in   {"e":"error","E":1792670909363,"error":{"code":401,"msg":"Authentication required: use AUTH or session.logon before subscribing to user data streams"}}

Authentication is checked before the account is resolved — no 404, no "not found", just
401 — so it is not an existence check wearing a different hat.

A random `vault_id`, the same channel, same connection, no credentials:

    out  {"method":"subscribe","channel":"userstream","vault_id":"0cff6289-3ab7-40be-9ca1-6d046c4af316","id":1}
    in   {"e":"error","E":1792670855473,"error":{"code":404,"msg":"Vault not found"}}

That is the contrast that settles it. The vault path resolves the vault with no
credentials at all and fails only on existence, exactly as documented. The account path
refuses before looking. Same channel, two rules.

`session.logon` with a freshly generated Ed25519 key pair that is not registered as an
API wallet:

    out  {"method":"session.logon","id":1,"params":{"apiKey":"5f4cae1f…","signature":"3e7d2164…","timestamp":1792670911573}}
    in   {"e":"error","E":1792670912382,"error":{"code":401,"msg":"Authentication failed"}}

So the signature is checked against a key registered server-side, not merely verified
cryptographically. A client-side signature from an unknown key gets nowhere.

The 401 message offers `AUTH` as an alternative, which would have meant a token path:

    out  {"method":"AUTH","id":1,"params":{"token":"x"}}
    in   {"e":"error","E":1792671035982,"error":{"code":400,"msg":"Authentication not available on this endpoint"}}
    out  {"method":"zzz","id":1,"params":{}}
    in   {"e":"error","E":1792671039228,"error":{"code":400,"msg":"Unknown method: zzz"}}

`AUTH` is a real method answering "not on this endpoint", not a typo handing back
"unknown method". There is no token lane on `/ws/user-api`. `session.logon` is the only
door.

## What this means for paps

The browser cannot open this stream. Subscribing needs the API-wallet private key, and
that key is deliberately not in the browser: `README.md` ("Holding the key") records it
sealed in D1 under `MASTER_KEY`, used by the Worker per request. Putting it in the page
to satisfy a socket would undo that.

The relay is therefore not optional, so it is a decision rather than an implementation
detail: a connection per session, a fan-out, and a reconnect regime on the Worker side.
The key custody it needs already exists — this branch adds no new secret handling — so
the cost is connections and lifetime, not keys. Left unbuilt, per the issue.

## Traps for whoever builds the parser

- Frames are newline-batched, same as the price socket: a frame can carry several JSON
  documents, and the docs say bursts of batch orders are where it happens.
- `ACCOUNT_UPDATE` has four payload shapes under one event name: standard balance and
  position arrays (`data.B`, `data.P`), vault events and credit events (`data.event_type`
  + `data.event_data`), and transaction status (`*_SETTLED` / `*_FAILED`, with `data.th`).
  `data.event_type` decides; absent means standard. A parser that assumes `data.B` will
  throw on the other three.
- A liquidation is not its own event. It arrives as `ACCOUNT_UPDATE` with
  `data.e: "LIQUIDATION"` and `data.r` carrying `PARTIAL_LIQUIDATED` / `FULLY_LIQUIDATED`,
  and the fee is on the `ORDER_TRADE_UPDATE` for the engine's closing order, whose
  `data.act` is `LIQUIDATION` and whose `data.n` is the commission. Reading only one of
  the two loses either the event or its cost.
- `data.P[].pa` is signed (direction) while `data.ps` is `LONG` / `SHORT`; the two can
  disagree in writing, so pick one and derive from it.
- Subscribe acks are `{"id":…,"result":null}` and ping replies are
  `{"method":"pong","id":…}`. Both look like messages and neither is an event.
- Numbers are strings, including `l`, `z`, `n`, `rp`. Do not `Number()` a balance into
  the display; format from the string.
