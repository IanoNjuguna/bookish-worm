#!/usr/bin/env bash
# Deploy one app on one host: fetch a prebuilt artifact, swap the release symlink,
# restart one unit, prove it answers, roll back if it does not.
#
#   sudo ./deploy.sh admin
#   sudo ./deploy.sh app studio
#
# Builds do NOT happen here. `next build` on a 1 GB t3.micro will swap and often
# OOM; CI builds the standalone bundle, uploads it to S3, and this script pulls it
# using the instance role (no keys on the box).
#
#   ARTIFACT_BUCKET=bookish-worm-releases ./deploy.sh admin --build
# is the escape hatch for a box with enough RAM to build locally.
set -euo pipefail

ROOT=/srv/bookish-worm
SRC=${SRC:-/srv/bookish-worm/src}
BUCKET=${ARTIFACT_BUCKET:-}
HEALTH_TIMEOUT=${HEALTH_TIMEOUT:-30}
BUILD_LOCALLY=0

log() { printf '\n== %s\n' "$*"; }
die() { printf 'FAIL: %s\n' "$*" >&2; exit 1; }

args=()
for arg in "$@"; do
  case "$arg" in
    --build) BUILD_LOCALLY=1 ;;
    *) args+=("$arg") ;;
  esac
done
set -- "${args[@]}"
[ $# -ge 1 ] || die "usage: deploy.sh <app> [app...] [--build]"

declare -A SRC_DIR=( [admin]=frontend/admin [app]=frontend/app [studio]=frontend/studio )
declare -A PORT=( [admin]=3100 [app]=3200 [studio]=3300 )
declare -A MEM=( [admin]=300M [app]=600M [studio]=400M )

for app in "$@"; do
  dir="${SRC_DIR[$app]:-}"
  [ -n "$dir" ] || die "unknown app: $app"
  port="${PORT[$app]}"
  release="$ROOT/releases/$app-$(date +%Y%m%d%H%M%S)"

  if [ "$BUILD_LOCALLY" -eq 1 ]; then
    log "$app: building on this host"
    ( cd "$SRC/$dir" && bun install --frozen-lockfile && bun run build )
    [ -d "$SRC/$dir/.next/standalone" ] || die "$app: no standalone output (set output:'standalone')"
    mkdir -p "$release"
    cp -a "$SRC/$dir/.next/standalone/." "$release/"
    mkdir -p "$release/.next"
    cp -a "$SRC/$dir/.next/static" "$release/.next/static"
    [ -d "$SRC/$dir/public" ] && cp -a "$SRC/$dir/public" "$release/public"
  else
    [ -n "$BUCKET" ] || die "ARTIFACT_BUCKET is not set (or pass --build)"
    sha=${SHA:-$(git -C "$SRC" rev-parse --short HEAD)}
    log "$app: pulling s3://$BUCKET/$app/$sha.tar.gz"
    mkdir -p "$release"
    aws s3 cp --only-show-errors "s3://$BUCKET/$app/$sha.tar.gz" /tmp/"$app".tar.gz
    tar -xzf /tmp/"$app".tar.gz -C "$release"
    rm -f /tmp/"$app".tar.gz
  fi

  previous=""
  if [ -L "$ROOT/current/$app" ]; then previous=$(readlink -f "$ROOT/current/$app"); fi

  log "$app: releasing $(basename "$release")"
  mkdir -p "$ROOT/current"
  ln -sfn "$release" "$ROOT/current/$app.new"
  mv -Tf "$ROOT/current/$app.new" "$ROOT/current/$app"

  mkdir -p "/etc/systemd/system/doba-$app.service.d"
  printf '[Service]\nEnvironment=PORT=%s\nMemoryMax=%s\n' "$port" "${MEM[$app]}" \
    > "/etc/systemd/system/doba-$app.service.d/limits.conf"

  systemctl daemon-reload
  systemctl enable --quiet "doba-app@$app" 2>/dev/null || true
  systemctl restart "doba-app@$app"

  log "$app: health check on :$port"
  healthy=0
  for _ in $(seq 1 "$HEALTH_TIMEOUT"); do
    if curl -fsS --max-time 2 "http://127.0.0.1:$port/" >/dev/null 2>&1; then healthy=1; break; fi
    sleep 1
  done

  if [ "$healthy" -ne 1 ]; then
    printf 'FAIL: %s did not answer on :%s\n' "$app" "$port" >&2
    if [ -n "$previous" ]; then
      printf 'rolling back to %s\n' "$previous" >&2
      ln -sfn "$previous" "$ROOT/current/$app.new"
      mv -Tf "$ROOT/current/$app.new" "$ROOT/current/$app"
      systemctl restart "doba-app@$app" || true
    else
      systemctl stop "doba-app@$app" || true
    fi
    die "$app failed; previous release restored"
  fi

  log "$app: up on :$port"
done

# Keep the last three releases per app; a rollback needs one, not twenty.
for app in "$@"; do
  ls -1dt "$ROOT"/releases/"$app"-* 2>/dev/null | tail -n +4 | xargs -r rm -rf
done

log "done"
