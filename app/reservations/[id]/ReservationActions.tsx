"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Reservation } from "@/lib/types/reservations";

interface ReservationActionsProps {
  reservation: Reservation;
}

export function ReservationActions({ reservation }: ReservationActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCancel =
    reservation.status === "PENDING" || reservation.status === "CONFIRMED";

  async function cancel() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/reservations/${reservation.id}/cancel`,
        { method: "POST" },
      );
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          (data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : null) ?? "No se pudo cancelar la reserva",
        );
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setBusy(false);
    }
  }

  if (!canCancel) return null;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="text-base font-semibold text-gray-900">Acciones</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={cancel}
        disabled={busy}
        className="self-start rounded border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        {busy ? "Cancelando…" : "Cancelar reserva"}
      </button>
    </div>
  );
}
