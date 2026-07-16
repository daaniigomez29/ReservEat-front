import { http } from "./http";
import type {
  AuthUser,
  BackendLoginResponse,
  LoginCredentials,
  LogoutRequest,
  RegisterPayload,
  RegisterResponse,
} from "@/lib/types/auth";

export const authApi = {
  async login(credentials: LoginCredentials): Promise<BackendLoginResponse> {
    return http.post<BackendLoginResponse>("/auth/login", credentials);
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return http.post<RegisterResponse>("/auth/register", payload);
  },

  async me(token?: string): Promise<AuthUser> {
    return http.get<AuthUser>("/auth/me", { token });
  },

  async logout(request: LogoutRequest): Promise<void> {
    return http.post<void>("/auth/logout", request);
  },

  async refresh(refreshToken: string): Promise<BackendLoginResponse> {
    // The backend rotates: it returns a brand-new access + refresh pair and
    // invalidates the one we send here.
    return http.post<BackendLoginResponse>("/auth/refresh", { refreshToken });
  },
};
