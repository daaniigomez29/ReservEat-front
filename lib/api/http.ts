import { cookies } from "next/headers";

export const AUTH_COOKIE = "auth_token";
export const AUTH_USER_COOKIE = "auth_user";
export const REFRESH_COOKIE = "refresh_token";

// Cookie lifetimes. The access token JWT only lives ~15 min, but we let its
// cookie persist as long as the refresh token so a silent refresh can revive
// the session instead of forcing a re-login. The refresh cookie mirrors the
// backend's jwt.refresh-expiration (7 days).
const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;
export const ACCESS_TOKEN_MAX_AGE = SEVEN_DAYS_SECONDS;
export const REFRESH_TOKEN_MAX_AGE = SEVEN_DAYS_SECONDS;

// Shared options for every auth cookie: httpOnly (invisible to JS, so XSS can't
// steal the tokens), secure in production, and lax same-site.
export function authCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(
    path.startsWith("http") ? path : `${API_BASE_URL}${path}`,
  );
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function resolveServerToken(): Promise<string | null> {
  if (typeof window !== "undefined") return null;
  try {
    const store = await cookies();
    return store.get(AUTH_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, token, query, headers, ...rest } = options;

  const resolvedToken =
    token !== undefined ? token : await resolveServerToken();

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
    ...((headers as Record<string, string>) ?? {}),
  };

  const response = await fetch(buildUrl(path, query), {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: rest.cache ?? "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : null) ?? `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, payload);
  }

  return (payload as T) ?? (undefined as T);
}

export const http = {
  get: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  del: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
