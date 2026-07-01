import { RestaurantForm } from "@/components/restaurants/RestaurantForm";

export const metadata = { title: "Nuevo restaurante" };

export default function NewRestaurantPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">
        Nuevo restaurante
      </h1>
      <RestaurantForm mode="create" />
    </div>
  );
}
