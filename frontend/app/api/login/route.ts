import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  // ---- STATIC CREDENTIAL CHECK (MVP) ----
  if (email === "admin@lukascope.com" && password === "password123") {
    const response = NextResponse.json({ success: true });

    // Set session cookie
    response.cookies.set("session", "logged-in", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
