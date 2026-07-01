"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import type {
  CuisineType,
  DietaryOption,
  RestaurantSearchFilters,
} from "@/lib/types/restaurants";

const cuisines: CuisineType[] = [
  "ITALIAN",
  "SPANISH",
  "JAPANESE",
  "MEXICAN",
  "CHINESE",
  "INDIAN",
  "AMERICAN",
  "MEDITERRANEAN",
  "FRENCH",
  "OTHER",
];

const diets: DietaryOption[] = [
  "VEGETARIAN",
  "VEGAN",
  "GLUTEN_FREE",
  "LACTOSE_FREE",
  "HALAL",
  "KOSHER",
];

interface RestaurantFiltersProps {
  initial?: RestaurantSearchFilters;
  basePath?: string;
}

export function RestaurantFilters({
  initial,
  basePath = "/restaurants",
}: RestaurantFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<RestaurantSearchFilters>({
    name: initial?.name ?? searchParams.get("name") ?? "",
    city: initial?.city ?? searchParams.get("city") ?? "",
    province: initial?.province ?? searchParams.get("province") ?? "",
    cuisineType:
      (initial?.cuisineType ??
        (searchParams.get("cuisineType") as CuisineType | null) ??
        undefined) || undefined,
    dietaryOption:
      (initial?.dietaryOption ??
        (searchParams.get("dietaryOption") as DietaryOption | null) ??
        undefined) || undefined,
    maxPrice:
      initial?.maxPrice ??
      (searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined),
  });

  function update<K extends keyof RestaurantSearchFilters>(
    key: K,
    value: RestaurantSearchFilters[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      params.set(key, String(value));
    });
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-3"
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Nombre</span>
        <input
          type="text"
          value={values.name ?? ""}
          onChange={(e) => update("name", e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
          placeholder="p. ej. Casa Pepe"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Ciudad</span>
        <input
          type="text"
          value={values.city ?? ""}
          onChange={(e) => update("city", e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Provincia</span>
        <input
          type="text"
          value={values.province ?? ""}
          onChange={(e) => update("province", e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Tipo de cocina</span>
        <select
          value={values.cuisineType ?? ""}
          onChange={(e) =>
            update(
              "cuisineType",
              (e.target.value || undefined) as CuisineType | undefined,
            )
          }
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="">Todas</option>
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Opción dietética</span>
        <select
          value={values.dietaryOption ?? ""}
          onChange={(e) =>
            update(
              "dietaryOption",
              (e.target.value || undefined) as DietaryOption | undefined,
            )
          }
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="">Cualquiera</option>
          {diets.map((diet) => (
            <option key={diet} value={diet}>
              {diet}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Precio máximo (€)</span>
        <input
          type="number"
          min={0}
          value={values.maxPrice ?? ""}
          onChange={(e) =>
            update(
              "maxPrice",
              e.target.value === "" ? undefined : Number(e.target.value),
            )
          }
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>
      <div className="md:col-span-3">
        <button
          type="submit"
          className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
