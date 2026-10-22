#!/usr/bin/env bash
#
# Boot the paps Pages Worker and assert the things tsc and vitest cannot.
#
# This is the CI gate for issue #88: a green check here means a Worker booted, bound D1,
# reached the venue and signed a proxied call — not that TypeScript compiled. Run it from
# frontend/paps after `bun run build` and after the migrations have been applied to the
# same state directory:
#
#   bunx wrangler@4 d1 migrations apply paps-keys --local --persist-to .wrangler/state
#   bash scripts/worker-smoke.sh
#
# Without the migrations above it must fail: that is the point of the test, and it is the
# one recipe wrangler makes easy to get wrong (`d1 execute --local` and `pages dev --d1`
# resolve different database ids, so migrations appear applied while the Worker sees no
# tables). Both commands here take `--persist-to`, which keeps them on the same database.
#
# Env: PORT (default 8788), PERSIST_TO (default .wrangler/state), MASTER_KEY (generated if
# unset). Exits non-zero on the first unmet assertion, after the Worker's log is printed.
set -uo pipefail

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PORT="${PORT:-8788}"
PERSIST_TO="${PERSIST_TO:-.wrangler/state}"
BASE_URL="http://127.0.0.1:${PORT}"
WRANGLER="${WRANGLER:-wrangler@4}"

WORK="$(mktemp -d)"
LOG="$WORK/worker.log"
# Well-formed Cardano mainnet address (header 0x01, 28-byte keyhash), belonging to nobody.
# The venue validates the shape, not the ownership, so this reaches the challenge endpoint.
ADDRESS="addr1qyqqzqsrqszsvpcgpy9qkrqdpc83qygjzv2p29shrqv35xcd6ka2g"

fails=0
worker_pid=""

cleanup() {
  if [ -n "$worker_pid" ] && kill -0 "$worker_pid" 2>/dev/null; then
    kill "$worker_pid" 2>/dev/null
    wait "$worker_pid" 2>/dev/null
  fi
}
trap cleanup EXIT

pass() { printf '  ok    %-58s %s\n' "$1" "${2:-}"; }
fail() {
  printf '  FAIL  %-58s %s\n' "$1" "${2:-}"
  [ -n "${3:-}" ] && printf '        %s\n' "$3"
  fails=$((fails + 1))
}

# Sets STATUS and BODY. Never aborts: a refused or dropped connection is 000, which every
# assertion below treats as a failure rather than an error in the harness.
request() {
  local method="$1" url="$2" cookie="${3:-}" data="${4:-}"
  local -a args=(-sS -m 25 -X "$method" -o "$WORK/body" -w '%{http_code}')
  [ -n "$cookie" ] && args+=(-H "cookie: paps_sid=${cookie}")
  [ -n "$data" ] && args+=(-H 'content-type: application/json' --data "$data")
  STATUS="$(curl "${args[@]}" "$url" 2>"$WORK/curl.err")" || STATUS=000
  BODY="$(cat "$WORK/body" 2>/dev/null)"
}

expect_status() { # label expected [hint]
  if [ "$STATUS" = "$2" ]; then pass "$1" "$STATUS"; else fail "$1" "$STATUS (want $2)" "${3:-}${BODY:+; body: $BODY}"; fi
}

expect_body() { # label needle
  if grep -qF -- "$2" <<<"$BODY"; then pass "$1" "contains $2"; else fail "$1" "no '$2'" "${BODY:+body: $BODY}"; fi
}

echo "paps worker smoke: $BASE_URL"
echo

if [ ! -d dist ]; then
  echo "dist/ is missing — run 'bun run build' first"
  exit 1
fi

# ---------------------------------------------------------------- boot
MASTER_KEY="${MASTER_KEY:-$(openssl rand -base64 32)}"
export MASTER_KEY

echo "booting: bunx $WRANGLER pages dev dist --persist-to $PERSIST_TO"
bunx "$WRANGLER" pages dev dist \
  --persist-to "$PERSIST_TO" \
  --binding "MASTER_KEY=$MASTER_KEY" \
  --port "$PORT" --ip 127.0.0.1 >"$LOG" 2>&1 &
worker_pid=$!

ready=""
for _ in $(seq 1 60); do
  if ! kill -0 "$worker_pid" 2>/dev/null; then break; fi
  code="$(curl -sS -m 2 -o /dev/null -w '%{http_code}' "$BASE_URL/" 2>/dev/null)"
  if [ "$code" = "200" ]; then ready=1; break; fi
  sleep 1
done

if [ -z "$ready" ]; then
  echo "the Worker did not answer on $BASE_URL within 60s"
  echo "--- worker log ---"
  tail -n 60 "$LOG"
  exit 1
fi

echo "worker up (pid $worker_pid, log $LOG)"
echo

# ---------------------------------------------------------------- anonymous session
echo "anonymous session"
request GET "$BASE_URL/api/session"
expect_status 'GET /api/session is refused without a cookie' 401
expect_body 'GET /api/session names the reason' 'no_session'

# ---------------------------------------------------------------- connect/start
# 200 here means three things at once: the D1 binding resolved, `pending_challenges`
# exists (so the migration ran against the database the Worker reads), and the venue
# answered the challenge request.
echo
echo "connect/start (venue + migration)"
request POST "$BASE_URL/api/connect/start" '' "{\"address\":\"$ADDRESS\"}"
expect_status 'POST /api/connect/start reaches the venue' 200 \
  "500 here usually means the D1 migration has not been applied to this --persist-to state (see the worker log for 'no such table'), or the venue is unreachable"
expect_body 'POST /api/connect/start returns a handle' '"token"'
expect_body 'POST /api/connect/start returns the venue message' '"message_to_sign"'

# ---------------------------------------------------------------- a session to proxy with
echo
echo "seeded session"
if ! SESSION_TOKEN="$(bun scripts/seed-session.ts "$WORK/session.sql" 2>"$WORK/seed.err")"; then
  fail 'seed a sealed session row' 'seed-session.ts failed' "$(tail -n 3 "$WORK/seed.err")"
  SESSION_TOKEN=""
elif ! bunx "$WRANGLER" d1 execute paps-keys --local --persist-to "$PERSIST_TO" \
  --file "$WORK/session.sql" >"$WORK/d1.log" 2>&1; then
  fail 'seed a sealed session row' 'd1 execute failed' \
    "$(tail -n 5 "$WORK/d1.log") — the api_keys table does not exist: apply the migrations"
  SESSION_TOKEN=""
else
  pass 'seed a sealed session row' 'inserted into api_keys'
fi

if [ -n "$SESSION_TOKEN" ]; then
  echo
  echo "session"
  request GET "$BASE_URL/api/session" "$SESSION_TOKEN"
  expect_status 'GET /api/session answers a sealed session' 200
  expect_body 'GET /api/session returns the stored account' 'smoke-account'

  echo
  echo "signing proxy"
  # `[[path]]` is joined onto /v2, so /api/strike/withdraw is the venue's /v2/withdraw —
  # the route paps deliberately does not hold a key for.
  request GET "$BASE_URL/api/strike/withdraw" "$SESSION_TOKEN"
  expect_status 'GET /api/strike/withdraw is refused' 403
  expect_body 'GET /api/strike/withdraw names the allowlist' 'path_not_allowed'

  request GET "$BASE_URL/api/strike/positions" "$SESSION_TOKEN"
  if grep -qE '"(no_session|path_not_allowed|reconnect|server_error|not_configured)"' <<<"$BODY"; then
    fail 'GET /api/strike/positions is signed and forwarded' "$STATUS" "paps answered instead of the venue: $BODY"
  else
    pass 'GET /api/strike/positions is signed and forwarded' "venue answered $STATUS"
  fi

  # A call the Worker did not sign gets a different answer from the venue, so the two
  # replies together show the proxy presented API-wallet credentials rather than merely
  # forwarding the request.
  request GET 'https://api.strikefinance.org/v2/positions'
  unsigned="$BODY"
  request GET "$BASE_URL/api/strike/positions" "$SESSION_TOKEN"
  if [ "$(tr -d '[:space:]' <<<"$BODY")" = "$(tr -d '[:space:]' <<<"$unsigned")" ]; then
    fail 'the proxy presents API-wallet credentials' 'same reply as an unsigned call' "body: $BODY"
  else
    pass 'the proxy presents API-wallet credentials' 'venue reply differs from unsigned'
  fi
else
  fail 'proxy assertions' 'skipped' 'no session row, so the proxy cannot be exercised'
fi

echo
if [ "$fails" -eq 0 ]; then
  echo "all worker smoke assertions passed"
  exit 0
fi

echo "$fails assertion(s) failed — worker log:"
tail -n 40 "$LOG"
exit 1
