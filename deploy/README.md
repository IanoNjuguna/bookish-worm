# Metrics rollup

`metrics_daily` is the series the dashboard reads. It is rebuilt by a nightly job,
not written inline, so a failed rollup is visible rather than silent.

## What it does

`POST /admin/rollup?days=3` recomputes the trailing three days in `metrics_daily`:

- EAT day buckets, `date(created_at, '+3 hours')`
- collects, GMV, take, unpriced collects, plays, listeners, collectors
- failed collects, chain fallbacks and 5xx, counted from `events`

It is an upsert, so running it twice produces identical rows. Three days rather
than one because late writes, clock skew and a missed tick all exist.

## Install, on the Lightsail host

```bash
sudo mkdir -p /etc/doba
sudo install -m 600 /dev/null /etc/doba/core-api.env
# then fill it with at least:
#   ADMIN_API_KEY=...
#   PORT=3001            (whatever core-api listens on)
#   TURSO_URL=...
#   TURSO_AUTH_TOKEN=...
#   BLOCKFROST_PROJECT_ID=...
#   TREASURY_ADDRESS=...

sudo cp deploy/systemd/doba-rollup.service deploy/systemd/doba-rollup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now doba-rollup.timer
```

## Checking it

```bash
systemctl list-timers doba-rollup.timer
systemctl status doba-rollup.service
journalctl -u doba-rollup.service -n 20
```

Then read a row back:

```bash
curl -s -H "X-API-Key: $ADMIN_API_KEY" "$BASE/admin/overview?days=7" | jq
```

## Why a timer and not a cron entry

`systemd` shows the last run, the next run and the exit status in one command, and
`Persistent=true` catches up after downtime. A crontab entry with a `curl` in it
does neither, and this job is the difference between a dashboard with history and
one that quietly shows zeroes.

## Failure behaviour

The job failing is not an emergency: the dashboard reads the last complete day and
marks the rollup stale once `refreshed_at` is more than 26 hours old. That is a
visible `red-400` chip, not a silent gap.
