"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

export function MainNavbar() {
  const { user, isAuthenticated, isOwnerOrAdmin, logout } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-brand-600">
          ReservEat
        </Link>
        <ul className="flex items-center gap-4 text-sm">
          <li>
            <Link href="/restaurants" className="hover:text-brand-600">
              Restaurantes
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link href="/reservations/my" className="hover:text-brand-600">
                Mis reservas
              </Link>
            </li>
          )}
          {isOwnerOrAdmin && (
            <li>
              <Link href="/dashboard" className="hover:text-brand-600">
                Dashboard
              </Link>
            </li>
          )}
          {isAuthenticated ? (
            <li className="flex items-center gap-3">
              <span className="text-gray-600">
                {user?.name ?? user?.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
              >
                Salir
              </button>
            </li>
          ) : (
            <li className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded border border-brand-600 px-3 py-1 text-sm text-brand-600 hover:bg-brand-50"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth/register"
                className="rounded bg-brand-600 px-3 py-1 text-sm text-white hover:bg-brand-700"
              >
                Crear cuenta
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
