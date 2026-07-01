import { notFound } from "next/navigation";
import { RestaurantForm } from "@/components/restaurants/RestaurantForm";
import { restaurantApi } from "@/lib/api/restaurantApi";
import { ApiError } from "@/lib/api/http";

interface EditRestaurantPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRestaurantPage({
  params,
}: EditRestaurantPageProps) {
  const { id } = await params;
  let restaurant;
  try {
    restaurant = await restaurantApi.getRestaurantById(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">
        Editar {restaurant.name}
      </h1>
      <RestaurantForm mode="edit" initial={restaurant} />
    </div>
  );
}
