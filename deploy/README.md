# Deploy

Two services, in this order: **core-api first**, then the admin app. The admin reads
`/admin/*`, so deploying it first gives you a dashboard whose every card says "no
metrics endpoint".

## 0. Before you deploy: the preflight

```bash
set -a; . /etc/doba/core-api.env; set +a
bun run deploy/preflight.ts
```

Ten checks: the shared secret length, the treasury address, the fee default, a live
Blockfrost call, `/health`, that `/admin/*` refuses an unauthenticated request, that
it answers an authenticated one, and both Access values. It runs no writes and
restarts nothing. It exits non-zero, because a half-configured deploy looks
successful while serving wrong numbers.

Verified both ways: `10/10 checks passed` with a complete environment, and
`exit 1` with seven failures when the key and Access values were missing.

## 1. core-api on the Lightsail host

```bash
git pull
bun install --frozen-lockfile
sudo systemctl restart doba-core-api    # or however the service is named today
```

Then the two one-time steps:

```bash
# the seven historical collects, now that TREASURY_ADDRESS is set
bun run scripts/backfill-collects.ts

# the nightly rollup
sudo cp deploy/systemd/doba-rollup.service deploy/systemd/doba-rollup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now doba-rollup.timer
systemctl list-timers doba-rollup.timer
```

Environment for core-api (see `frontend/app/backend/core-api/.env.example`):

```
ADMIN_API_KEY            openssl rand -hex 32
TREASURY_ADDRESS         addr1…  fees are recorded as unknown without it
BLOCKFROST_PROJECT_ID    pricing and the backfill
DEFAULT_FEE_BPS          1000 = 10%; recorded as each release's intended fee
```

## 2. The admin app

Vercel project, repository root `frontend/admin`:

- **Production branch must be `main`.** This is the failure we already have on
  `app.doba.world`: automatic deploys, green builds, and a site three commits behind
  because the project's production branch was not the one being merged into. Check it
  before the first deploy, not after.
- Preview deployments: disabled. There is one operator and no review surface worth
  exposing.
- Environment: `CORE_API_URL`, `ADMIN_API_KEY`, `CF_ACCESS_TEAM_DOMAIN`,
  `CF_ACCESS_AUD`. Do **not** set `ADMIN_ACCESS_BYPASS`.

Cloudflare Access application on `admin.doba.world`:

1. Zero Trust → Access → Applications → Add, self-hosted.
2. Domain `admin.doba.world`, session duration 24h.
3. Policy: allow, emails = yours only.
4. Copy the **Application Audience (AUD) tag** into `CF_ACCESS_AUD`, and the team
   domain (`https://<team>.cloudflareaccess.com`) into `CF_ACCESS_TEAM_DOMAIN`.

DNS: proxied CNAME `admin` → `cname.vercel-dns.com`.

The app verifies `Cf-Access-Jwt-Assertion` itself, so reaching the `vercel.app`
address directly still returns 403. Unconfigured means 503, never open.

## 3. Verify, do not assume

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://admin.doba.world/     # 302 to Access or 403
curl -s -H "X-API-Key: $ADMIN_API_KEY" https://app.doba.world/api-backend/admin/overview?days=7
```

Then open the Overview logged in and check three things against the chain: take per
fan is not a dash, the heatmap has cells, and the health strip shows real counts
rather than "not instrumented".
