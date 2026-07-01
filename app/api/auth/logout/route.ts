import { NextResponse } from "next/server";
import { authApi } from "@/lib/api/authApi";
import { AUTH_COOKIE, AUTH_USER_COOKIE } from "@/lib/api/http";

export async function POST() {
  await authApi.logout();
  const clear = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, "", clear);
  response.cookies.set(AUTH_USER_COOKIE, "", clear);
  return response;
}
