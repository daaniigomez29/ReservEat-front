export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  userId: string;
  bookerEmail?: string;
  startDate: string;
  partySize: number;
  status: ReservationStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReservationPayload {
  restaurantId: string;
  startDate: string;
  partySize: number;
  userId?: string;
  bookerEmail?: string;
  notes?: string;
}

export interface ReservationFilters {
  status?: ReservationStatus;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface PagedReservations {
  content: Reservation[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
