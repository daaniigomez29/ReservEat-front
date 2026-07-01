export type Role = "USER" | "OWNER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: Role[];
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
  role?: Role;
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
}
