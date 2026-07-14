import Link from "next/link";
import { notFound } from "next/navigation";
import { restaurantApi } from "@/lib/api/restaurantApi";
import { floorPlanApi } from "@/lib/api/floorPlanApi";
import { ApiError } from "@/lib/api/http";
import type { FloorPlan } from "@/lib/types/floorPlan";
import { FloorPlanView } from "./FloorPlanView";

export const metadata = { title: "Plano de mesas" };

interface FloorPlanPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function FloorPlanPage({
  params,
  searchParams,
}: FloorPlanPageProps) {
  const { id } = await params;
  const rawParams = await searchParams;
  const at = getParam(rawParams, "at");

  let restaurant;
  try {
    restaurant = await restaurantApi.getRestaurantById(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  let plan: FloorPlan | null = null;
  let error: string | null = null;
  try {
    plan = await floorPlanApi.getFloorPlan(id, at);
  } catch (err) {
    error = err instanceof Error ? err.message : "Error inesperado";
  }

  // datetime-local espera "YYYY-MM-DDTHH:mm"; recortamos los segundos si vienen.
  const initialAt = at ? at.slice(0, 16) : "";

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/restaurants"
        className="text-sm text-brand-600 hover:underline"
      >
        ← Volver a mis restaurantes
      </Link>
      <h1 className="text-2xl font-semibold text-gray-900">
        Plano de mesas — {restaurant.name}
      </h1>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {plan && (
        <FloorPlanView restaurantId={id} plan={plan} initialAt={initialAt} />
      )}
    </div>
  );
}
