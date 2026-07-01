"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { CreateReservationPayload } from "@/lib/types/reservations";

interface ReservationFormProps {
  restaurantId: string;
  restaurantSize?: number;
}

export function ReservationForm({
  restaurantId,
  restaurantSize,
}: ReservationFormProps) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    
    if (!date || !time) {
      setError("Selecciona fecha y hora");
      return;
    }

    const payload: CreateReservationPayload = {
      restaurantId,
      startDate: `${date}T${time}`,
      partySize,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          (data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : null) ??
            "No se pudo crear la reserva. Inténtalo de nuevo.",
        );
      }
      const created: { id: string } = await response.json();
      router.push(`/reservations/${created.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4"
    >
      <h3 className="text-base font-semibold text-gray-900">Reservar mesa</h3>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Fecha</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Hora</span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            required
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Personas</span>
        <input
          type="number"
          min={1}
          max={restaurantSize ?? 30}
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value))}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Notas (opcional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
          placeholder="Alergias, ocasión especial…"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {submitting ? "Reservando…" : "Confirmar reserva"}
      </button>
    </form>
  );
}
