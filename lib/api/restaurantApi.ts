import { http } from "./http";
import type {
  CreateRestaurantPayload,
  PagedRestaurants,
  Restaurant,
  RestaurantSearchFilters,
  UpdateRestaurantPayload,
} from "@/lib/types/restaurants";

export const restaurantApi = {
  async searchRestaurants(
    filters: RestaurantSearchFilters = {},
  ): Promise<PagedRestaurants> {
    return http.get<PagedRestaurants>("/restaurants/search", {
      query: {
        name: filters.name,
        city: filters.city,
        province: filters.province,
        cuisineType: filters.cuisineType,
        dietaryOption: filters.dietaryOption,
        maxPrice: filters.maxPrice,
        page: filters.page,
        size: filters.size,
      },
    });
  },

  async getRestaurantById(id: string): Promise<Restaurant> {
    return http.get<Restaurant>(`/restaurants/${id}`);
  },

  async getMyRestaurants(): Promise<Restaurant[]> {
    const result = await http.get<PagedRestaurants | Restaurant[]>(
      "/restaurants/my",
    );
    if (Array.isArray(result)) return result;
    return result.content;
  },

  async createRestaurant(
    payload: CreateRestaurantPayload,
  ): Promise<Restaurant> {
    return http.post<Restaurant>("/restaurants", payload);
  },

  async updateRestaurant(
    id: string,
    payload: UpdateRestaurantPayload,
  ): Promise<Restaurant> {
    return http.put<Restaurant>(`/restaurants/${id}`, payload);
  },

  async deleteRestaurant(id: string): Promise<void> {
    await http.del<void>(`/restaurants/${id}`);
  },
};
