import { ReservationsTable } from "@/components/reservations/ReservationsTable";
import { reservationApi } from "@/lib/api/reservationApi";

export const metadata = { title: "Mis reservas" };

interface MyReservationsPageProps {
  searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function MyReservationsPage({
  searchParams,
}: MyReservationsPageProps) {
  const { page, size } = await searchParams;

  let result;
  let error: string | null = null;
  try {
    result = await reservationApi.getMyReservations({
      page: page ? Number(page) : 0,
      size: size ? Number(size) : 20,
    });
  } catch (err) {
    error = err instanceof Error ? err.message : "Error inesperado";
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Mis reservas</h1>
      {error && (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {result && (
        <ReservationsTable
          reservations={result.content}
          showRestaurant
          allowCancel
        />
      )}
    </div>
  );
}
