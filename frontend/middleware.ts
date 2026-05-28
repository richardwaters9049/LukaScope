import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

const PROTECTED_ROUTES = ["/dashboard", "/results", "/profile", "/about"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isProtected) return NextResponse.next();

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!session) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/results/:path*", "/profile/:path*", "/about/:path*"],
};
