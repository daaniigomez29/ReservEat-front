export type CuisineType =
  | "ITALIAN"
  | "SPANISH"
  | "JAPANESE"
  | "MEXICAN"
  | "CHINESE"
  | "INDIAN"
  | "AMERICAN"
  | "MEDITERRANEAN"
  | "FRENCH"
  | "OTHER";

export type DietaryOption =
  | "VEGETARIAN"
  | "VEGAN"
  | "GLUTEN_FREE"
  | "LACTOSE_FREE"
  | "HALAL"
  | "KOSHER";

export interface Location {
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  email: string;
  tlf: string;
  size: number;
  averagePrice: number;
  cuisineType: CuisineType;
  dietaryOptions: DietaryOption[];
  location: Location;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRestaurantPayload {
  name: string;
  email: string;
  tlf: string;
  size: number;
  averagePrice: number;
  cuisineType: CuisineType;
  dietaryOptions: DietaryOption[];
  location: Location;
}

export type UpdateRestaurantPayload = Partial<CreateRestaurantPayload>;

export interface RestaurantSearchFilters {
  name?: string;
  city?: string;
  province?: string;
  cuisineType?: CuisineType;
  dietaryOption?: DietaryOption;
  maxPrice?: number;
  page?: number;
  size?: number;
}

export interface PagedRestaurants {
  content: Restaurant[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
