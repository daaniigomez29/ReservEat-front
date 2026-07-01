"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type {
  ReservationFilters,
  ReservationStatus,
} from "@/lib/types/reservations";

const statuses: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
];

interface RestaurantReservationsFiltersProps {
  initial: ReservationFilters;
  restaurantId: string;
}

export function RestaurantReservationsFilters({
  initial,
  restaurantId,
}: RestaurantReservationsFiltersProps) {
  const router = useRouter();
  const [values, setValues] = useState<ReservationFilters>({
    status: initial.status,
    from: initial.from ?? "",
    to: initial.to ?? "",
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (values.status) params.set("status", values.status);
    if (values.from) params.set("from", values.from);
    if (values.to) params.set("to", values.to);
    const qs = params.toString();
    router.push(
      `/dashboard/restaurants/${restaurantId}/reservations${qs ? `?${qs}` : ""}`,
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-4"
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Estado</span>
        <select
          value={values.status ?? ""}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              status:
                (e.target.value || undefined) as ReservationStatus | undefined,
            }))
          }
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="">Todos</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Desde</span>
        <input
          type="date"
          value={values.from ?? ""}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, from: e.target.value }))
          }
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Hasta</span>
        <input
          type="date"
          value={values.to ?? ""}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, to: e.target.value }))
          }
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Filtrar
        </button>
      </div>
    </form>
  );
}
