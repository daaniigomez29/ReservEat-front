import Link from "next/link";
import { notFound } from "next/navigation";
import { reservationApi } from "@/lib/api/reservationApi";
import { ApiError } from "@/lib/api/http";
import { ReservationActions } from "./ReservationActions";

interface ReservationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReservationDetailPage({
  params,
}: ReservationDetailPageProps) {
  const { id } = await params;
  let reservation;
  try {
    reservation = await reservationApi.getReservationById(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
      <Link
        href="/reservations/my"
        className="text-sm text-brand-600 hover:underline"
      >
        ← Volver a mis reservas
      </Link>
      <h1 className="text-2xl font-semibold text-gray-900">
        Reserva en {reservation.restaurantName}
      </h1>

      <section className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Fecha y hora
          </p>
          <p className="font-medium text-gray-800">
            {new Date(reservation.startDate).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Personas
          </p>
          <p className="font-medium text-gray-800">{reservation.partySize}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Estado
          </p>
          <p className="font-medium text-gray-800">{reservation.status}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Restaurante
          </p>
          <Link
            href={`/restaurants/${reservation.restaurantId}`}
            className="font-medium text-brand-600 hover:underline"
          >
            {reservation.restaurantName}
          </Link>
        </div>
        {reservation.notes && (
          <div className="col-span-2">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Notas
            </p>
            <p className="font-medium text-gray-800">{reservation.notes}</p>
          </div>
        )}
      </section>

      <ReservationActions reservation={reservation} />
    </div>
  );
}
