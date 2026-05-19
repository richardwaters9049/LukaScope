import { NextResponse } from "next/server";
import { isDemoUser, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (isDemoUser(email, password)) {
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE_NAME, "logged-in", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
