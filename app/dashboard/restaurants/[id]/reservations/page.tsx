import Link from "next/link";
import { notFound } from "next/navigation";
import { ReservationsTable } from "@/components/reservations/ReservationsTable";
import { reservationApi } from "@/lib/api/reservationApi";
import { restaurantApi } from "@/lib/api/restaurantApi";
import { ApiError } from "@/lib/api/http";
import type {
  ReservationFilters,
  ReservationStatus,
} from "@/lib/types/reservations";
import { RestaurantReservationsFilters } from "./RestaurantReservationsFilters";

interface RestaurantReservationsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseFilters(
  params: Record<string, string | string[] | undefined>,
): ReservationFilters {
  const get = (key: string): string | undefined => {
    const value = params[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };
  return {
    status: (get("status") as ReservationStatus | undefined) || undefined,
    from: get("from"),
    to: get("to"),
    page: get("page") ? Number(get("page")) : 0,
    size: 25,
  };
}

export default async function RestaurantReservationsPage({
  params,
  searchParams,
}: RestaurantReservationsPageProps) {
  const { id } = await params;
  const rawParams = await searchParams;
  const filters = parseFilters(rawParams);

  let restaurant;
  try {
    restaurant = await restaurantApi.getRestaurantById(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  let result;
  let error: string | null = null;
  try {
    result = await reservationApi.getReservationsForRestaurant(id, filters);
  } catch (err) {
    error = err instanceof Error ? err.message : "Error inesperado";
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/restaurants"
        className="text-sm text-brand-600 hover:underline"
      >
        ← Volver a mis restaurantes
      </Link>
      <h1 className="text-2xl font-semibold text-gray-900">
        Reservas — {restaurant.name}
      </h1>
      <RestaurantReservationsFilters initial={filters} restaurantId={id} />
      {error && (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {result && (
        <ReservationsTable
          reservations={result.content}
          showRestaurant={false}
          showCustomer
          allowConfirm
          allowCancel
        />
      )}
    </div>
  );
}
