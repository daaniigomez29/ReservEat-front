import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authApi } from "@/lib/api/authApi";
import {
  ApiError,
  AUTH_COOKIE,
  AUTH_USER_COOKIE,
  REFRESH_COOKIE,
  authCookieOptions,
} from "@/lib/api/http";

export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  // Best-effort server-side revocation. If we have a refresh token, ask the
  // backend to invalidate its session row. Logout is idempotent there, so we
  // don't care whether it succeeds — the cookies are cleared regardless.
  if (refreshToken) {
    try {
      await authApi.logout({ refreshToken });
    } catch (err) {
      if (err instanceof ApiError) {
        console.error(
          "[logout] Backend error",
          err.status,
          err.message,
          JSON.stringify(err.body),
        );
      }
    }
  }

  const clear = authCookieOptions(0);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, "", clear);
  response.cookies.set(REFRESH_COOKIE, "", clear);
  response.cookies.set(AUTH_USER_COOKIE, "", clear);
  return response;
}
