"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Reservation, ReservationStatus } from "@/lib/types/reservations";

const statusLabel: Record<ReservationStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

const statusStyle: Record<ReservationStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-200 text-gray-700",
  COMPLETED: "bg-blue-100 text-blue-800",
  NO_SHOW: "bg-red-100 text-red-800",
};

interface ReservationsTableProps {
  reservations: Reservation[];
  showRestaurant?: boolean;
  showCustomer?: boolean;
  allowConfirm?: boolean;
  allowCancel?: boolean;
}

export function ReservationsTable({
  reservations,
  showRestaurant = true,
  showCustomer = false,
  allowCancel = true,
}: ReservationsTableProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function act(id: string, action: "cancel") {
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch(`/api/reservations/${id}/${action}`, {
        method: "POST",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          (data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : null) ?? "No se pudo completar la acción.",
        );
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setBusyId(null);
    }
  }

  if (reservations.length === 0) {
    return (
      <p className="rounded border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
        No hay reservas para mostrar.
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
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            {showRestaurant && <th className="px-4 py-2">Restaurante</th>}
            {showCustomer && <th className="px-4 py-2">Cliente</th>}
            <th className="px-4 py-2">Fecha y hora</th>
            <th className="px-4 py-2">Personas</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              {showRestaurant && (
                <td className="px-4 py-2 font-medium text-gray-900">
                  {reservation.restaurantName}
                </td>
              )}
              {showCustomer && (
                <td className="px-4 py-2 text-gray-700">
                  {reservation.bookerEmail ?? "—"}
                </td>
              )}
              <td className="px-4 py-2 text-gray-700 flex">
                {new Date(reservation.startDate).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {reservation.partySize}
              </td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[reservation.status]
                    }`}
                >
                  {statusLabel[reservation.status]}
                </span>
              </td>
              <td className="px-4 py-2 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/reservations/${reservation.id}`}
                    className="text-brand-600 hover:underline"
                  >
                    Ver
                  </Link>
                  {allowCancel &&
                    (reservation.status === "CONFIRMED") && (
                      <button
                        type="button"
                        onClick={() => act(reservation.id, "cancel")}
                        disabled={busyId === reservation.id}
                        className="text-red-600 hover:underline disabled:opacity-60"
                      >
                        Cancelar
                      </button>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
