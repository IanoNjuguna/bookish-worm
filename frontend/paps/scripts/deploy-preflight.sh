#!/usr/bin/env bash
#
# Refuse to deploy paps until the Worker has somewhere to seal a key.
#
# Deploying the code is harmless; deploying it onto a project with no MASTER_KEY, or onto a
# database id that is still the placeholder in wrangler.toml, produces a site that boots and
# fails every connect with a 500 — the most expensive kind of green. So this step runs before
# anything is uploaded and names exactly what is missing.
#
# Env: CLOUDFLARE_API_TOKEN (secret), CLOUDFLARE_ACCOUNT_ID (variable),
#      PAPS_D1_DATABASE_ID (variable, the id `wrangler d1 create paps-keys` printed),
#      PAPS_PROJECT_NAME / PAPS_DATABASE_NAME (optional, default paps / paps-keys).
set -uo pipefail

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PROJECT="${PAPS_PROJECT_NAME:-paps}"
DATABASE="${PAPS_DATABASE_NAME:-paps-keys}"
WRANGLER="${WRANGLER:-wrangler@4}"

missing=0

# An unprovisioned pipeline SKIPS; a half-provisioned one FAILS.
#
# `main` used to go red on every paps push because CLOUDFLARE_API_TOKEN was never added, and a
# permanently red main is worse than no deploy job: it trains everyone to ignore the check that
# is supposed to mean "the Worker booted and signed". The distinction worth keeping is between
# "nobody has provisioned this yet" (skip, with the same loud message) and "someone provisioned
# it wrongly" (fail). release.yml already skips on an empty vars.AWS_ROLE_ARN for this reason.
skip=0

require() { # name hint
  if [ -z "${!1:-}" ]; then
    echo "::error title=paps deploy provisioning::$1 is not configured. $2"
    missing=1
  fi
}

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  # The one check whose absence means "not provisioned", not "provisioned wrong".
  skip=1
  missing=0
  echo "::warning title=paps deploy skipped::CLOUDFLARE_API_TOKEN is not set, so this run did not deploy paps. Add a Cloudflare API token with \"Cloudflare Pages: Edit\" and \"D1: Edit\" as the repo secret CLOUDFLARE_API_TOKEN, and the same push deploys."
  echo
  echo "Nothing was uploaded, and the previous deployment is still live."
fi

if [ "$skip" -eq 1 ]; then
  [ -n "${GITHUB_OUTPUT:-}" ] && echo "deploy=skip" >>"$GITHUB_OUTPUT"
  exit 0
fi

if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "deploy=yes" >>"$GITHUB_OUTPUT"
fi
require CLOUDFLARE_ACCOUNT_ID \
  'Add the account id (dash.cloudflare.com, right sidebar) as the repo variable CLOUDFLARE_ACCOUNT_ID.'
require PAPS_D1_DATABASE_ID \
  "Add the id printed by 'bunx wrangler d1 create ${DATABASE}' as the repo variable PAPS_D1_DATABASE_ID. It replaces the placeholder in wrangler.toml at deploy time."

if [ "${PAPS_D1_DATABASE_ID:-}" = "REPLACE_WITH_D1_DATABASE_ID" ]; then
  echo "::error title=paps deploy provisioning::PAPS_D1_DATABASE_ID is still the placeholder from wrangler.toml. Paste the real id."
  missing=1
fi

if [ "$missing" -ne 0 ]; then
  echo
  echo "paps was not deployed. The Worker seals every stored API wallet key with MASTER_KEY in"
  echo "D1, so a deploy without a database and that secret is a deploy that cannot connect."
  echo "Nothing was uploaded, and the previous deployment is still live."
  exit 1
fi

# MASTER_KEY is checked on the project, not copied into GitHub: it seals every stored key,
# so a second copy is a second place it can leak. `pages secret list` prints names only.
if ! listing="$(bunx "$WRANGLER" pages secret list --project-name "$PROJECT" 2>&1)"; then
  echo "::error title=paps deploy provisioning::could not list secrets for the '${PROJECT}' Pages project. Create it once with 'bunx wrangler pages project create ${PROJECT}', and check CLOUDFLARE_API_TOKEN can read it."
  echo "$listing"
  exit 1
fi

if ! grep -qw "MASTER_KEY" <<<"$listing"; then
  echo "::error title=paps deploy provisioning::the '${PROJECT}' Pages project has no MASTER_KEY secret. Set it once with 'bunx wrangler pages secret put MASTER_KEY --project-name ${PROJECT}' (openssl rand -base64 32). Without it every /api/connect/start returns 500 and no session can be sealed."
  echo "$listing"
  exit 1
fi

echo "provisioning ok: ${PROJECT} has MASTER_KEY, ${DATABASE} is ${PAPS_D1_DATABASE_ID:0:8}…"
