import Link from "next/link";
import { RestaurantFilters } from "@/components/restaurants/RestaurantFilters";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { restaurantApi } from "@/lib/api/restaurantApi";
import type { Restaurant } from "@/lib/types/restaurants";

async function loadHighlighted(): Promise<Restaurant[]> {
  try {
    const result = await restaurantApi.searchRestaurants({ size: 3 });
    if (Array.isArray(result)) return result;
    return result.content ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const highlighted = await loadHighlighted();
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
      <section className="rounded-2xl bg-gradient-to-r from-brand-50 to-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">
          Encuentra y reserva tu próxima mesa
        </h1>
        <p className="mt-2 max-w-xl text-gray-600">
          Filtra por ciudad, tipo de cocina, opciones dietéticas y precio.
          Descubre restaurantes cerca de ti.
        </p>
        <div className="mt-6">
          <RestaurantFilters />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Destacados</h2>
          <Link
            href="/restaurants"
            className="text-sm text-brand-600 hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        {highlighted.length === 0 ? (
          <p className="rounded border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
            Aún no hay restaurantes para mostrar.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {highlighted.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
