import { createLocalJWKSet, createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';

/**
 * Cloudflare Access verification, the only thing standing between the public
 * internet and a dashboard full of wallet addresses.
 *
 * Access puts a signed `Cf-Access-Jwt-Assertion` header on every request it lets
 * through. Verifying it against the team's JWKS is what makes the app private even
 * if someone reaches the Vercel URL directly and bypasses the Access hostname.
 */
export type AccessConfig = { teamDomain: string; audience: string };

export type AccessResult =
  | { ok: true; email: string | null }
  | { ok: false; reason: 'missing-token' | 'invalid' | 'expired' | 'wrong-audience' | string };

const HEADER = 'cf-access-jwt-assertion';

export function accessConfigFromEnv(env: NodeJS.ProcessEnv = process.env): AccessConfig | null {
  const teamDomain = env.CF_ACCESS_TEAM_DOMAIN?.trim();
  const audience = env.CF_ACCESS_AUD?.trim();
  if (!teamDomain || !audience) return null;
  return {
    teamDomain: teamDomain.replace(/\/+$/, ''),
    audience,
  };
}

/** Production uses the team's live certs; tests pass a local JWKS instead. */
export function remoteJwks(config: AccessConfig): JWTVerifyGetKey {
  return createRemoteJWKSet(new URL(`${config.teamDomain}/cdn-cgi/access/certs`));
}

export async function verifyAccessJwt(
  token: string | null,
  config: AccessConfig,
  jwks: JWTVerifyGetKey = remoteJwks(config),
): Promise<AccessResult> {
  if (!token) return { ok: false, reason: 'missing-token' };

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: config.teamDomain,
      audience: config.audience,
    });
    const email = typeof payload.email === 'string' ? payload.email : null;
    return { ok: true, email };
  } catch (error: any) {
    // jose throws on the two cases worth distinguishing for the operator.
    if (error?.code === 'ERR_JWT_EXPIRED') return { ok: false, reason: 'expired' };
    if (error?.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
      return { ok: false, reason: 'wrong-audience' };
    }
    return { ok: false, reason: error?.code ?? 'invalid' };
  }
}

/** Test-only helper: a JWKS built from public keys you generated locally. */
export function localJwks(keys: Parameters<typeof createLocalJWKSet>[0]) {
  return createLocalJWKSet(keys);
}

export const ACCESS_HEADER = HEADER;
