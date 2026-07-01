import { NextResponse } from "next/server";
import { authApi } from "@/lib/api/authApi";
import { AUTH_COOKIE, AUTH_USER_COOKIE, ApiError } from "@/lib/api/http";
import type { AuthUser, Role } from "@/lib/types/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password } =
    (body as { email?: string; password?: string }) ?? {};

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  try {
    const raw = await authApi.login({ email, password });

    const user: AuthUser = {
      id: String(raw.userId),
      email: raw.email,
      name: raw.username,
      roles: [raw.globalRole as Role],
    };

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    const response = NextResponse.json({ user });
    response.cookies.set(AUTH_COOKIE, raw.token, cookieOptions);
    response.cookies.set(AUTH_USER_COOKIE, JSON.stringify(user), cookieOptions);
    return response;
  } catch (err) {
    if (err instanceof ApiError) {
      console.error("[login] Backend error", err.status, err.message, err.body);
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("[login] Unexpected error", err);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
