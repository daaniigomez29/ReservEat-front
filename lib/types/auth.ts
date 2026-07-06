export type GlobalRolePermission = "USER" | "ADMIN";

export type RestaurantRolePermission = "OWNER" | "WORKER";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  globalRole: GlobalRolePermission;
  restaurantRole?: RestaurantRolePermission;
  ownedRestaurantIds?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  username: string;
  tlf: string;
  role?: GlobalRolePermission;
}

// El backend NO devuelve token al registrar: exige verificar el email antes.
export interface RegisterResponse {
  userId: number;
  email: string;
  emailVerified: boolean;
  message: string;
}

export interface BackendLoginResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  username: string;
  globalRole: string;
  restaurantRole: string;
}
