import { notFound } from "next/navigation";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { restaurantApi } from "@/lib/api/restaurantApi";
import { getCurrentUser } from "@/lib/auth/session";
import { ApiError } from "@/lib/api/http";
import Link from "next/link";

interface RestaurantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantDetailPage({
  params,
}: RestaurantDetailPageProps) {
  const { id } = await params;
  let restaurant;
  try {
    restaurant = await restaurantApi.getRestaurantById(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const user = await getCurrentUser();

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[2fr_1fr]">
      <article className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-gray-900">
            {restaurant.name}
          </h1>
          <p className="text-sm text-gray-600">
            {restaurant.location.street} {restaurant.location.city}, (
            {restaurant.location.province})
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Cocina
            </p>
            <p className="font-medium text-gray-800">{restaurant.cuisineType}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Precio medio
            </p>
            <p className="font-medium text-gray-800">
              {restaurant.averagePrice.toFixed(2)} €
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Aforo
            </p>
            <p className="font-medium text-gray-800">{restaurant.size}</p>
          </div>
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Opciones dietéticas
            </p>
            <p className="font-medium text-gray-800">
              {restaurant.dietaryOptions.length
                ? restaurant.dietaryOptions.join(", ")
                : "—"}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <h2 className="mb-2 text-base font-semibold text-gray-900">
            Contacto
          </h2>
          <p className="text-gray-700">Email: {restaurant.email}</p>
          <p className="text-gray-700">Teléfono: {restaurant.tlf}</p>
        </section>
      </article>

      <aside className="flex flex-col gap-4">
        {user ? (
          <ReservationForm
            restaurantId={restaurant.id}
            restaurantSize={restaurant.size}
          />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
            <p className="mb-3">
              Inicia sesión para reservar mesa en {restaurant.name}.
            </p>
            <Link
              href={`/auth/login?redirect=/restaurants/${restaurant.id}`}
              className="inline-block rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
