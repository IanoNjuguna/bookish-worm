import { sha256Hex } from './crypto';

/**
 * Sessions.
 *
 * The cookie carries a random token; the store only ever sees its SHA-256, so a leaked
 * table does not let anyone resume a session. The cookie is HttpOnly because nothing in
 * the browser needs to read it, Secure because this app only runs on mainnet, and
 * SameSite=Strict because no cross-site flow should ever spend a user's key.
 */

export const SESSION_COOKIE = 'paps_sid';
export const SESSION_MAX_AGE_S = 60 * 60 * 12;

export const sessionHash = (token: string): Promise<string> => sha256Hex(token);

export function sessionCookie(token: string, maxAge: number = SESSION_MAX_AGE_S): string {
  return [
    `${SESSION_COOKIE}=${token}`,
    'Path=/api',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
  ].join('; ');
}

export const clearedSessionCookie = (): string =>
  `${SESSION_COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export function readCookie(request: Request, name: string): string | null {
  const raw = request.headers.get('cookie');
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=') || null;
  }
  return null;
}

export const readSessionToken = (request: Request): string | null =>
  readCookie(request, SESSION_COOKIE);
