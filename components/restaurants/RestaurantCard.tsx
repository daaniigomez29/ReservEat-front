import Link from "next/link";
import type { Restaurant } from "@/lib/types/restaurants";

const cuisineLabels: Record<string, string> = {
  ITALIAN: "Italiana",
  SPANISH: "Española",
  JAPANESE: "Japonesa",
  MEXICAN: "Mexicana",
  CHINESE: "China",
  INDIAN: "India",
  AMERICAN: "Americana",
  MEDITERRANEAN: "Mediterránea",
  FRENCH: "Francesa",
  OTHER: "Otra",
};

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { id, name, location, averagePrice, cuisineType, dietaryOptions } =
    restaurant;
  return (
    <Link
      href={`/restaurants/${id}`}
      className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-brand-500 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900">{name}</h3>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
          {cuisineLabels[cuisineType] ?? cuisineType}
        </span>
      </div>
      <p className="text-sm text-gray-600">
        {location.city}, {location.province}
      </p>
      <p className="text-sm text-gray-500">{location.street}</p>
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm font-medium text-gray-800">
          {averagePrice.toFixed(2)} € / persona
        </span>
        {dietaryOptions.length > 0 && (
          <span className="text-xs text-gray-500">
            {dietaryOptions.slice(0, 2).join(", ")}
            {dietaryOptions.length > 2 ? "…" : ""}
          </span>
        )}
      </div>
    </Link>
  );
}
