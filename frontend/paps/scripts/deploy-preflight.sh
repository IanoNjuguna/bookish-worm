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

require() { # name hint
  if [ -z "${!1:-}" ]; then
    echo "::error title=paps deploy provisioning::$1 is not configured. $2"
    missing=1
  fi
}

require CLOUDFLARE_API_TOKEN \
  'Add a Cloudflare API token with "Cloudflare Pages: Edit" and "D1: Edit" as the repo secret CLOUDFLARE_API_TOKEN.'
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
