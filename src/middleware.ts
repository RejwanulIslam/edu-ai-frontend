import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Next.js Middleware — Authentication Gate
 *
 * Responsibilities:
 * 1. Block unauthenticated users from accessing /dashboard/* routes.
 * 2. Redirect already-authenticated users away from /auth/* pages.
 *
 * Role-based authorization (STUDENT can't access /dashboard/admin etc.)
 * is intentionally handled in each layout.tsx because:
 *  - The Better Auth session cookie is opaque (cannot decode role in middleware).
 *  - The layout already calls useSession() which carries the full user + role.
 */

/** Better Auth session cookies (plain + __Secure- prefix on HTTPS) */
const SESSION_DATA_COOKIES = [
  "better-auth.session_data",
  "__Secure-better-auth.session_data",
] as const;

const SESSION_TOKEN_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
] as const;

function hasAuthSession(request: NextRequest): boolean {
  if (getSessionCookie(request.headers)) return true;
  if (SESSION_TOKEN_COOKIES.some((name) => !!request.cookies.get(name)?.value)) {
    return true;
  }
  return SESSION_DATA_COOKIES.some((name) => !!request.cookies.get(name)?.value);
}

/** Routes that require authentication */
const PROTECTED_PREFIXES = [
  "/dashboard/admin",
  "/dashboard/instructor",
  "/dashboard/user",
];

/** Routes that authenticated users should be bounced away from */
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasAuthSession(request);

  // 1️⃣  Unauthenticated user → block dashboard access
  if (isProtected(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    // Preserve the intended destination so we can redirect after login
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2️⃣  Authenticated user → bounce away from login/register pages
  // We removed this from middleware because opaque cookies cannot be validated here.
  // If the cookie is stale, this causes an infinite redirect loop.
  // Instead, the login page itself will handle redirecting truly authenticated users.

  return NextResponse.next();
}

export const config = {
  /*
   * Match all routes EXCEPT:
   *  - _next/static (static files)
   *  - _next/image  (image optimization)
   *  - favicon.ico
   *  - api routes (proxied to backend, handled separately)
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|api/).*)",
  ],
};
