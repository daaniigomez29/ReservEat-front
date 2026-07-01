import { http } from "./http";
import type {
  AuthUser,
  BackendLoginResponse,
  LoginCredentials,
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

  async logout(): Promise<void> {
    try {
      await http.post<void>("/auth/logout");
    } catch {
      // Backend logout is best-effort; client clears its own session.
    }
  },
};
