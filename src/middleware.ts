import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/jwt";
import { hasRole, ROLES } from "@/lib/auth/rbac";

const SESSION_COOKIE = "cs_session";

// Route prefix → roles allowed to access it.
const PROTECTED: { prefix: string; roles: string[] }[] = [
  { prefix: "/espace-admin", roles: [ROLES.ADMIN] },
  { prefix: "/espace-staff", roles: [ROLES.STAFF, ROLES.ADMIN] },
  { prefix: "/espace-client", roles: [ROLES.CLIENT, ROLES.STAFF, ROLES.ADMIN] },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = PROTECTED.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`)
  );
  if (!rule) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!hasRole(session.roles, rule.roles as never)) {
    const url = req.nextUrl.clone();
    url.pathname = "/espace-client";
    url.searchParams.set("denied", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/espace-client/:path*", "/espace-staff/:path*", "/espace-admin/:path*"],
};
