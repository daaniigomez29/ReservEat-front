import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authApi } from "@/lib/api/authApi";
import {
  ACCESS_TOKEN_MAX_AGE,
  ApiError,
  AUTH_COOKIE,
  AUTH_USER_COOKIE,
  REFRESH_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  authCookieOptions,
} from "@/lib/api/http";
import type { AuthUser, GlobalRolePermission, RestaurantRolePermission } from "@/lib/types/auth";

export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  try {
    const raw = await authApi.refresh(refreshToken);

    const user: AuthUser = {
      id: String(raw.userId),
      email: raw.email,
      name: raw.username,
      globalRole: raw.globalRole as GlobalRolePermission,
      restaurantRole: raw.restaurantRole as RestaurantRolePermission,
    };

    // Rotation: overwrite the whole trio with the freshly issued pair.
    const response = NextResponse.json({ user });
    response.cookies.set(
      AUTH_COOKIE,
      raw.token,
      authCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );
    response.cookies.set(
      REFRESH_COOKIE,
      raw.refreshToken,
      authCookieOptions(REFRESH_TOKEN_MAX_AGE),
    );
    response.cookies.set(
      AUTH_USER_COOKIE,
      JSON.stringify(user),
      authCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );
    return response;
  } catch (err) {
    // A rejected/expired refresh token means the session is dead: clear the
    // cookies so the client falls back to logging in again.
    const status = err instanceof ApiError ? err.status : 401;
    if (err instanceof ApiError) {
      console.error("[refresh] Backend error", err.status, err.message, err.body);
    } else {
      console.error("[refresh] Unexpected error", err);
    }

    const clear = authCookieOptions(0);
    const response = NextResponse.json(
      { message: "Session expired" },
      { status: status === 200 ? 401 : status },
    );
    response.cookies.set(AUTH_COOKIE, "", clear);
    response.cookies.set(REFRESH_COOKIE, "", clear);
    response.cookies.set(AUTH_USER_COOKIE, "", clear);
    return response;
  }
}
