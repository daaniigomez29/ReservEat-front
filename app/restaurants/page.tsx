import { RestaurantFilters } from "@/components/restaurants/RestaurantFilters";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { restaurantApi } from "@/lib/api/restaurantApi";
import type {
  CuisineType,
  DietaryOption,
  RestaurantSearchFilters,
  Restaurant,
  PagedRestaurants
} from "@/lib/types/restaurants";
import PaginationComponent from "@/components/restaurants/Pagination";

export const metadata = { title: "Restaurantes" };

interface RestaurantsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseFilters(
  params: Record<string, string | string[] | undefined>,
): RestaurantSearchFilters {
  const get = (key: string): string | undefined => {
    const value = params[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };
  return {
    name: get("name"),
    city: get("city"),
    province: get("province"),
    cuisineType: (get("cuisineType") as CuisineType | undefined) || undefined,
    dietaryOption:
      (get("dietaryOption") as DietaryOption | undefined) || undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    page: get("page") ? Number(get("page")) : 0,
    size: get("size") ? Number(get("page")) : 5,
  };
}

export default async function RestaurantsPage({
  searchParams,
}: RestaurantsPageProps) {
  const params = await searchParams;
  const filters = parseFilters(params);

  let itemsPaged: PagedRestaurants | null = null;
  //let items: Restaurant[] | null = null;
  let error: string | null = null;
  try {
    const result = await restaurantApi.searchRestaurants(filters);
    itemsPaged = result ?? null;
    //items = Array.isArray(result) ? result : (result.content ?? []);
  } catch (err) {
    error = err instanceof Error ? err.message : "No se pudieron cargar los restaurantes";
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Restaurantes</h1>
      <RestaurantFilters initial={filters} />

      {error && (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {itemsPaged?.content && itemsPaged?.content.length === 0 && (
        <p className="rounded border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
          No se encontraron restaurantes con esos criterios.
        </p>
      )}

      {itemsPaged?.content && itemsPaged.content.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {itemsPaged.content.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
      {itemsPaged && (
        <PaginationComponent currentPage={itemsPaged.number} size={itemsPaged.size} totalElements={itemsPaged.totalElements} totalPages={itemsPaged.totalPages} first={itemsPaged.first} last={itemsPaged.last} filters={filters}></PaginationComponent>
      )}
    </div>
  );
}
