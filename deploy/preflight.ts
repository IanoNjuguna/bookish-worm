/**
 * Pre-deploy check. Run this on the host, with the environment core-api uses:
 *
 *   set -a; . /etc/doba/core-api.env; set +a
 *   bun run deploy/preflight.ts
 *
 * It fails loudly and exits non-zero rather than letting a half-configured deploy
 * look like a successful one. Everything here is a read: no writes, no restarts.
 */

type Check = { name: string; ok: boolean; detail: string };

const checks: Check[] = [];
const record = (name: string, ok: boolean, detail: string) => {
  checks.push({ name, ok, detail });
};

const env = process.env;
const base = (env.CORE_API_URL || `http://127.0.0.1:${env.PORT ?? '3001'}`).replace(/\/+$/, '');

async function http(path: string, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(`${base}${path}`, { ...init, signal: controller.signal });
    return { status: res.status, body: await res.text() };
  } finally {
    clearTimeout(timer);
  }
}

// --- secrets and addresses ---------------------------------------------------
const apiKey = env.ADMIN_API_KEY ?? '';
record(
  'ADMIN_API_KEY',
  apiKey.length >= 32,
  apiKey.length === 0
    ? 'missing: generate one with openssl rand -hex 32'
    : apiKey.length < 32
      ? `too short (${apiKey.length} chars, want 32+)`
      : `present, ${apiKey.length} chars`,
);

const treasury = env.TREASURY_ADDRESS ?? '';
record(
  'TREASURY_ADDRESS',
  treasury.startsWith('addr1') && treasury.length >= 50,
  treasury === ''
    ? 'missing: every collect would record an unknown fee'
    : treasury.startsWith('addr1') && treasury.length >= 50
      ? 'looks like a mainnet address'
      : 'not a mainnet addr1 address',
);

const feeBps = Number(env.DEFAULT_FEE_BPS ?? '');
record(
  'DEFAULT_FEE_BPS',
  Number.isFinite(feeBps) && feeBps >= 0 && feeBps <= 10000,
  Number.isFinite(feeBps) ? `${feeBps} bps` : 'not set: new releases store no intended fee',
);

// --- chain access ------------------------------------------------------------
const blockfrost = env.BLOCKFROST_PROJECT_ID ?? '';
if (blockfrost) {
  try {
    const res = await fetch('https://cardano-mainnet.blockfrost.io/api/v0/blocks/latest', {
      headers: { project_id: blockfrost },
    });
    record('BLOCKFROST_PROJECT_ID', res.ok, res.ok ? 'live mainnet call ok' : `HTTP ${res.status}`);
  } catch (error: any) {
    record('BLOCKFROST_PROJECT_ID', false, `request failed: ${error?.message ?? error}`);
  }
} else {
  record('BLOCKFROST_PROJECT_ID', false, 'missing: pricing and backfill both need it');
}

// --- the API itself ----------------------------------------------------------
try {
  const health = await http('/health');
  record('core-api /health', health.status === 200, `HTTP ${health.status}`);
} catch (error: any) {
  record('core-api /health', false, `unreachable at ${base}: ${error?.message ?? error}`);
}

try {
  const unauth = await http('/admin/overview');
  record(
    '/admin/* rejects without a key',
    unauth.status === 401 || unauth.status === 503,
    `HTTP ${unauth.status} (401 expected; 503 means no key configured)`,
  );
} catch (error: any) {
  record('/admin/* rejects without a key', false, `request failed: ${error?.message ?? error}`);
}

if (apiKey) {
  try {
    const overview = await http('/admin/overview?days=30', {
      headers: { 'X-API-Key': apiKey },
    });
    record('/admin/overview with key', overview.status === 200, `HTTP ${overview.status}`);
  } catch (error: any) {
    record('/admin/overview with key', false, `request failed: ${error?.message ?? error}`);
  }

  try {
    const timeline = await http('/admin/timeline?days=7', { headers: { 'X-API-Key': apiKey } });
    record('/admin/timeline with key', timeline.status === 200, `HTTP ${timeline.status}`);
  } catch (error: any) {
    record('/admin/timeline with key', false, `request failed: ${error?.message ?? error}`);
  }
}

// --- admin app configuration -------------------------------------------------
record(
  'CF_ACCESS_TEAM_DOMAIN',
  Boolean(env.CF_ACCESS_TEAM_DOMAIN),
  env.CF_ACCESS_TEAM_DOMAIN ? env.CF_ACCESS_TEAM_DOMAIN : 'not set: the admin app will answer 503',
);
record(
  'CF_ACCESS_AUD',
  Boolean(env.CF_ACCESS_AUD),
  env.CF_ACCESS_AUD ? 'present' : 'not set: the admin app will answer 503',
);

// --- report ------------------------------------------------------------------
const width = Math.max(...checks.map((c) => c.name.length));
for (const check of checks) {
  console.log(`${check.ok ? 'PASS' : 'FAIL'}  ${check.name.padEnd(width)}  ${check.detail}`);
}

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length > 0) {
  console.log(`\nNot ready. ${failed.length} check(s) failed, and a deploy now would look fine while serving wrong numbers.`);
  process.exit(1);
}
console.log('\nReady. Deploy core-api first, then the admin app.');
