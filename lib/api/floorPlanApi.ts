import { http } from "./http";
import type { FloorPlan } from "@/lib/types/floorPlan";

export const floorPlanApi = {
  /**
   * Plano de mesas del restaurante con el estado de ocupación en un instante.
   * `at` es un ISO LocalDateTime (p. ej. "2026-07-14T20:00:00"); si se omite,
   * el backend usa la hora actual. Restringido a OWNER/ADMIN.
   */
  async getFloorPlan(restaurantId: string, at?: string): Promise<FloorPlan> {
    return http.get<FloorPlan>(`/restaurants/${restaurantId}/floor-plan`, {
      query: { at },
    });
  },
};
