import { cookies } from "next/headers";
import { AUTH_COOKIE, AUTH_USER_COOKIE } from "@/lib/api/http";
import type { AuthUser, Role } from "@/lib/types/auth";

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const raw = store.get(AUTH_USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function hasRole(user: AuthUser | null, ...roles: Role[]): boolean {
  if (!user) return false;
  console.log(user.roles)
  return roles.some((role) => user.roles.includes(role));
}

export function isOwnerOrAdmin(user: AuthUser | null): boolean {
  return hasRole(user, "OWNER", "ADMIN");
}
