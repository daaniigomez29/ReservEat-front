import Link from "next/link";
import { restaurantApi } from "@/lib/api/restaurantApi";

export const metadata = { title: "Dashboard" };

export default async function DashboardHomePage() {
  let count = 0;
  try {
    const restaurants = await restaurantApi.getMyRestaurants();
    count = restaurants.length;
  } catch {
    count = 0;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">Resumen</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Restaurantes
          </p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{count}</p>
          <Link
            href="/dashboard/restaurants"
            className="mt-2 inline-block text-sm text-brand-600 hover:underline"
          >
            Gestionar →
          </Link>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Acciones rápidas
          </p>
          <Link
            href="/dashboard/restaurants/new"
            className="mt-2 inline-block rounded bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700"
          >
            Nuevo restaurante
          </Link>
        </div>
      </div>
    </div>
  );
}
