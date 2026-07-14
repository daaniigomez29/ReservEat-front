"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Restaurant } from "@/lib/types/restaurants";

interface DashboardRestaurantsListProps {
  restaurants: Restaurant[];
}

export function DashboardRestaurantsList({
  restaurants,
}: DashboardRestaurantsListProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function deleteRestaurant(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          (data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : null) ?? "No se pudo eliminar el restaurante",
        );
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setBusyId(null);
    }
  }

  if (restaurants.length === 0) {
    return (
      <p className="rounded border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
        Aún no tienes restaurantes. Crea el primero para empezar.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      {error && (
        <p className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Ciudad</th>
            <th className="px-4 py-2">Cocina</th>
            <th className="px-4 py-2">Aforo</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id}>
              <td className="px-4 py-2 font-medium text-gray-900">
                {restaurant.name}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {restaurant.location.city}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {restaurant.cuisineType}
              </td>
              <td className="px-4 py-2 text-gray-700">{restaurant.size}</td>
              <td className="px-4 py-2 text-right">
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/dashboard/restaurants/${restaurant.id}/edit`}
                    className="text-brand-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/dashboard/restaurants/${restaurant.id}/reservations`}
                    className="text-brand-600 hover:underline"
                  >
                    Reservas
                  </Link>
                  <Link
                    href={`/dashboard/restaurants/${restaurant.id}/floor-plan`}
                    className="text-brand-600 hover:underline"
                  >
                    Plano
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      deleteRestaurant(restaurant.id, restaurant.name)
                    }
                    disabled={busyId === restaurant.id}
                    className="text-red-600 hover:underline disabled:opacity-60"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
