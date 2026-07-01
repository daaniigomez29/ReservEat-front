import Link from "next/link";
import { restaurantApi } from "@/lib/api/restaurantApi";
import { DashboardRestaurantsList } from "./DashboardRestaurantsList";
import { Restaurant } from "@/lib/types/restaurants";

export const metadata = { title: "Mis restaurantes" };

export default async function DashboardRestaurantsPage() {
  let restaurants: Restaurant[];
  let error: string | null = null;
  try {
    restaurants = await restaurantApi.getMyRestaurants();
  } catch (err) {
    error = err instanceof Error ? err.message : "Error inesperado";
    restaurants = [];
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Mis restaurantes
        </h1>
        <Link
          href="/dashboard/restaurants/new"
          className="rounded bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Nuevo restaurante
        </Link>
      </div>
      {error && (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <DashboardRestaurantsList restaurants={restaurants} />
    </div>
  );
}
