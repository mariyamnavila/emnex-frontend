import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Backend JWT access secret (server-side only, never NEXT_PUBLIC)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

// Routes that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/about",
  "/features",
  "/pricing",
  "/contact",
  "/payment/success",
  "/payment/cancel",
];

// Role → home path (mirrors getHomePath in auth.hook.ts)
const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  HR_MANAGER: "/manager",
  FINANCE_MANAGER: "/finance",
};

// Route prefix → roles allowed (assignment: role enforcement at middleware level)
const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/manager": ["HR_MANAGER"],
  "/finance": ["FINANCE_MANAGER"],
};

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || (p !== "/" && pathname.startsWith(`${p}/`)),
  );
}

async function verifyToken(token: string) {
  if (!JWT_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { role?: string; userId?: string };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths and API/static routes
  if (isPublic(pathname)) return NextResponse.next();
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  // No cookie → redirect to login with return path
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify JWT — invalid/expired → clear cookies and redirect
  const payload = await verifyToken(token);
  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  const role = payload.role || "";

  // /dashboard is the employee area; roles with their own area go there instead
  if (pathname.startsWith("/dashboard") && ROLE_HOME[role]) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  // Role-based route enforcement (assignment requirement)
  for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(role)) {
      // Wrong role → send to their home (custom roles → /dashboard)
      const home = ROLE_HOME[role] || "/dashboard";
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except static assets and API
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.*).*)"],
};
