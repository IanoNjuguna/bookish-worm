#!/usr/bin/env bash
# Runs on the box, invoked by SSM. Pulls the artifact for the current commit and
# hands off to deploy.sh, which owns the symlink swap, health check and rollback.
#
#   sudo SHA=abc1234 ARTIFACT_BUCKET=bookish-worm-releases release.sh admin
#
# Kept as a file rather than an inline SSM command so the quoting lives in git and
# not in a JSON string inside a workflow.
set -euo pipefail

APP=${1:?usage: release.sh <admin|app|studio>}
SRC=${SRC:-/srv/bookish-worm/src}
BRANCH=${BRANCH:-main}

log() { printf '\n== %s\n' "$*"; }

# Keep the checkout current so deploy.sh's --build path and the release history
# agree on what "this commit" is.
if [ -d "$SRC/.git" ]; then
  log "updating $SRC to origin/$BRANCH"
  git -C "$SRC" fetch --quiet --all --prune
  git -C "$SRC" checkout --quiet --force "$BRANCH"
  git -C "$SRC" reset --hard --quiet "origin/$BRANCH"
else
  log "no checkout at $SRC; deploying the artifact only"
fi

if [ -n "${SHA:-}" ]; then
  export SHA
elif [ -d "$SRC/.git" ]; then
  SHA=$(git -C "$SRC" rev-parse --short HEAD)
  export SHA
else
  echo "SHA is not set and there is no checkout to read it from" >&2
  exit 1
fi

log "releasing $APP at $SHA"
exec "$SRC/deploy/hosts/deploy.sh" "$APP"
