"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type {
  CreateRestaurantPayload,
  CuisineType,
  DietaryOption,
  Restaurant,
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

interface RestaurantFormProps {
  mode: "create" | "edit";
  initial?: Restaurant;
}

export function RestaurantForm({ mode, initial }: RestaurantFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CreateRestaurantPayload>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    tlf: initial?.tlf ?? "",
    size: initial?.size ?? 20,
    averagePrice: initial?.averagePrice ?? 25,
    cuisineType: initial?.cuisineType ?? "OTHER",
    openingTime: initial?.openingTime ?? "",
    closingTime: initial?.closingTime ?? "",
    dietaryOptions: initial?.dietaryOptions ?? [],
    street: initial?.location.street ?? "",
    city: initial?.location.city ?? "",
    province: initial?.location.province ?? "",
    postalCode: initial?.location.postalCode ?? "",
    lat: initial?.location.lat,
    lon: initial?.location.lon,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof CreateRestaurantPayload>(
    key: K,
    value: CreateRestaurantPayload[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDiet(diet: DietaryOption) {
    setValues((prev) => ({
      ...prev,
      dietaryOptions: prev.dietaryOptions.includes(diet)
        ? prev.dietaryOptions.filter((d) => d !== diet)
        : [...prev.dietaryOptions, diet],
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const url =
        mode === "create" ? "/api/restaurants" : `/api/restaurants/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      // Omit empty time fields so the backend receives null, not "" (which
      // would fail LocalTime parsing).
      const payload: CreateRestaurantPayload = {
        ...values,
        openingTime: values.openingTime || undefined,
        closingTime: values.closingTime || undefined,
      };
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          (data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : null) ?? "No se pudo guardar el restaurante",
        );
      }
      router.push("/dashboard/restaurants");
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
      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Nombre</span>
          <input
            type="text"
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Email</span>
          <input
            type="email"
            required
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Teléfono</span>
          <input
            type="tel"
            required
            value={values.tlf}
            onChange={(e) => update("tlf", e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Aforo</span>
          <input
            type="number"
            min={1}
            required
            value={values.size}
            onChange={(e) => update("size", Number(e.target.value))}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Precio medio (€)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            required
            value={values.averagePrice}
            onChange={(e) => update("averagePrice", Number(e.target.value))}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Tipo de cocina</span>
          <select
            value={values.cuisineType}
            onChange={(e) =>
              update("cuisineType", e.target.value as CuisineType)
            }
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          >
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Hora de apertura</span>
          <input
            type="time"
            value={values.openingTime ?? ""}
            onChange={(e) => update("openingTime", e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Hora de cierre</span>
          <input
            type="time"
            value={values.closingTime ?? ""}
            onChange={(e) => update("closingTime", e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
          <span className="text-xs text-gray-400">
            Si el cierre es anterior a la apertura, se entiende que cruza
            medianoche (p. ej. 19:00–02:00).
          </span>
        </label>
      </div>

      <fieldset className="rounded border border-gray-200 p-3">
        <legend className="px-1 text-sm font-medium text-gray-700">
          Opciones dietéticas
        </legend>
        <div className="flex flex-wrap gap-3 pt-2 text-sm">
          {diets.map((diet) => (
            <label key={diet} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.dietaryOptions.includes(diet)}
                onChange={() => toggleDiet(diet)}
              />
              {diet}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded border border-gray-200 p-3">
        <legend className="px-1 text-sm font-medium text-gray-700">
          Ubicación
        </legend>
        <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm md:col-span-2">
            <span className="font-medium text-gray-700">Calle</span>
            <input
              type="text"
              required
              value={values.street}
              onChange={(e) => update("street", e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">Ciudad</span>
            <input
              type="text"
              required
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">Provincia</span>
            <input
              type="text"
              required
              value={values.province}
              onChange={(e) => update("province", e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">Código postal</span>
            <input
              type="text"
              value={values.postalCode ?? ""}
              onChange={(e) => update("postalCode", e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">Latitud</span>
            <input
              type="number"
              step="any"
              required
              value={values.lat ?? ""}
              onChange={(e) =>
                update(
                  "lat",
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">Longitud</span>
            <input
              type="number"
              step="any"
              required
              value={values.lon ?? ""}
              onChange={(e) =>
                update(
                  "lon",
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </label>
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting
            ? "Guardando…"
            : mode === "create"
              ? "Crear restaurante"
              : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
