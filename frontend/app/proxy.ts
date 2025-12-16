import { NextRequest, NextResponse } from "next/server";

// Any route that starts with one of these prefixes is protected
const protectedPrefixes = ["/dashboard", "/results"];

function isProtectedRoute(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function hasSession(req: NextRequest) {
  return req.cookies.get("session");
}

function handleAuth(req: NextRequest) {
  if (isProtectedRoute(req.nextUrl.pathname) && !hasSession(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export function GET(req: NextRequest) {
  return handleAuth(req);
}

export function POST(req: NextRequest) {
  return handleAuth(req);
}

export function PUT(req: NextRequest) {
  return handleAuth(req);
}

export function DELETE(req: NextRequest) {
  return handleAuth(req);
}
