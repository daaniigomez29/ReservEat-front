import { http } from "./http";
import type {
  CreateReservationPayload,
  PagedReservations,
  Reservation,
  ReservationFilters,
} from "@/lib/types/reservations";

export const reservationApi = {
  async createReservation(
    payload: CreateReservationPayload,
  ): Promise<Reservation> {
    return http.post<Reservation>("/reservations", payload);
  },

  async getMyReservations(
    pagination: { page?: number; size?: number } = {},
  ): Promise<PagedReservations> {
    return http.get<PagedReservations>("/reservations/my", {
      query: { page: pagination.page, size: pagination.size },
    });
  },

  async getReservationById(id: string): Promise<Reservation> {
    return http.get<Reservation>(`/reservations/${id}`);
  },

  async getReservationsForRestaurant(
    restaurantId: string,
    filters: ReservationFilters = {},
  ): Promise<PagedReservations> {
    return http.get<PagedReservations>(
      `/reservations/restaurant/${restaurantId}`,
      {
        query: {
          status: filters.status,
          from: filters.from,
          to: filters.to,
          page: filters.page,
          size: filters.size,
        },
      },
    );
  },

  async confirmReservation(id: string): Promise<Reservation> {
    return http.post<Reservation>(`/reservations/${id}/confirm`);
  },

  async cancelReservation(id: string): Promise<Reservation> {
    return http.post<Reservation>(`/reservations/${id}/cancel`);
  },
};
