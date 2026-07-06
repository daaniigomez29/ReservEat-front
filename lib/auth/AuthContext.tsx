"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthUser, GlobalRolePermission, RestaurantRolePermission } from "@/lib/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasGlobalRole: (...roles: GlobalRolePermission[]) => boolean;
  hasRestaurantRole: (...roles: RestaurantRolePermission[]) => boolean;
  isOwnerOrAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  initialUser: AuthUser | null;
  children: ReactNode;
}

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(
        (data && typeof data === "object" && "message" in data
          ? String((data as { message: unknown }).message)
          : null) ?? "Credenciales inválidas",
      );
    }
    const data = (await response.json()) as { user: AuthUser };
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const hasGlobalRole = useCallback(
    (...roles: GlobalRolePermission[]) =>
      Boolean(user && roles.some((role) => user.globalRole === role)),
    [user],
  );

  const hasRestaurantRole = useCallback(
    (...roles: RestaurantRolePermission[]) =>
      Boolean(user && roles.some((role) => user.restaurantRole === role)),
    [user],
  );

  const isOwnerOrAdmin = hasGlobalRole("ADMIN") || hasRestaurantRole("OWNER");

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      hasGlobalRole,
      hasRestaurantRole,
      isOwnerOrAdmin,
      login,
      logout,
    }),
    [user, hasGlobalRole, hasRestaurantRole, isOwnerOrAdmin, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
