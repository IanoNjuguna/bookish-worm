import { NextResponse, type NextRequest } from 'next/server';
import { ACCESS_HEADER, accessConfigFromEnv, verifyAccessJwt } from '@/lib/access';

/**
 * Every request is checked against Cloudflare Access before it reaches a page.
 *
 * Three states, and the third one matters: with no Access configuration the app
 * refuses to serve rather than falling open, because the failure mode of a
 * dashboard that silently becomes public is worse than a 503.
 *
 * Local development sets ADMIN_ACCESS_BYPASS=1 and skips the check.
 */
const PUBLIC_PREFIXES = ['/_next', '/favicon', '/icons', '/manifest.json', '/robots.txt'];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default async function proxy(request: NextRequest) {
  if (isPublic(request.nextUrl.pathname)) return NextResponse.next();

  if (process.env.ADMIN_ACCESS_BYPASS === '1') return NextResponse.next();

  const config = accessConfigFromEnv();
  if (!config) {
    return new NextResponse(
      'Admin access is not configured: CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD are required.',
      { status: 503 },
    );
  }

  const result = await verifyAccessJwt(request.headers.get(ACCESS_HEADER), config);
  if (result.ok) return NextResponse.next();

  // Not a redirect: a 403 with a reason is easier to debug from curl than a login
  // bounce, and Access has already had its chance to authenticate this request.
  return new NextResponse(`Forbidden: ${result.reason}`, { status: 403 });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
