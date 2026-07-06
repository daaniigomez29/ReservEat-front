import { cookies } from "next/headers";
import { AUTH_COOKIE, AUTH_USER_COOKIE } from "@/lib/api/http";
import type { AuthUser, GlobalRolePermission, RestaurantRolePermission } from "@/lib/types/auth";

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

export function hasGlobalRole(user: AuthUser | null, ...roles: GlobalRolePermission[]): boolean {
  if (!user) return false;
  return roles.some((role) => user.globalRole === role);
}

export function hasRestaurantRole(user: AuthUser | null, ...roles: RestaurantRolePermission[]): boolean {
  if (!user) return false;
  return roles.some((role) => user.restaurantRole === role);
}

export function isOwnerOrAdmin(user: AuthUser | null): boolean {
  return hasGlobalRole(user, "ADMIN") || (hasGlobalRole(user, "USER") && hasRestaurantRole(user, "OWNER", "WORKER"));
}
