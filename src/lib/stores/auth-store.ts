import { create } from "zustand";
import apiClient from "@/lib/api/client";

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  store_id: number;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const response = await apiClient.post("/admin/auth/sign_in", { user: { email, password } });
    const authHeader = response.headers["authorization"] || "";
    const token = authHeader.replace("Bearer ", "");
    const user = response.data.user;

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));

    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await apiClient.delete("/admin/auth/sign_out");
    } catch {
      // Ignore errors — token may already be expired
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("auth_user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
  },
}));
