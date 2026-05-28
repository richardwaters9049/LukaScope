import { NextResponse } from "next/server";
import { isDemoUser, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).email !== "string" ||
    typeof (body as Record<string, unknown>).password !== "string"
  ) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const { email, password } = body as { email: string; password: string };

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
