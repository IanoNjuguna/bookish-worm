# Deploy

Two services, in this order: **core-api first**, then the admin app. The admin reads
`/admin/*`, so deploying it first gives you a dashboard whose every card says "no
metrics endpoint".

## Where things run (migration target)

    box A  t3.micro   admin.doba.world            admin only, behind Access
    box B  t3.small   app.doba.world, studio.doba.world
    box C  t3.micro   api (app.doba.world/api-backend)
    db     RDS        PostgreSQL, outside every box
    edge   Cloudflare DNS + Tunnel per host + Access on box A

No box has an inbound security-group rule. Each runs its own `cloudflared` and dials
out; the only way in is the tunnel, and the admin hostname additionally requires an
Access session. Templates live in `deploy/hosts/`:

    cloud-init.yaml       Ubuntu 24.04, node 22, bun, cloudflared, swap, ufw deny-in
    doba-app@.service     one unit per app, MemoryMax, hardening, restart-always
    deploy.sh             pull artifact, atomic symlink swap, health check, rollback
    tunnel.md             tunnel per host, ingress map, Access application

### Builds do not happen on the boxes

`next build` on a t3.micro swaps and often OOMs. CI builds the standalone bundle and
uploads `s3://<bucket>/<app>/<sha>.tar.gz`; `deploy.sh` pulls it with the instance
role, so no credentials live on a host. `--build` exists for a box with enough RAM.

### Prerequisite in the app repos, before P2

Each Next app needs `output: 'standalone'` in its `next.config`. Without it there is
no `server.js` to run and `deploy.sh` refuses the release. Not added yet: it changes
every build, and it belongs in the migration PR, not in a deploy-docs one.

## 1. Before you deploy: the preflight

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
