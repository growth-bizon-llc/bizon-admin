import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "../auth-store";

vi.mock("@/lib/api/client", () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from "@/lib/api/client";

const mockedPost = vi.mocked(apiClient.post);
const mockedDelete = vi.mocked(apiClient.delete);

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("has no user or token", () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("login", () => {
    it("stores user and token from API response", async () => {
      const user = { id: 1, email: "admin@test.com", role: "admin", store_id: 1 };
      mockedPost.mockResolvedValue({
        data: { user, message: "Logged in successfully." },
        headers: { authorization: "Bearer test-jwt-token" },
      });

      await useAuthStore.getState().login("admin@test.com", "password");

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.token).toBe("test-jwt-token");
      expect(state.isAuthenticated).toBe(true);
      expect(localStorage.getItem("auth_token")).toBe("test-jwt-token");
      expect(localStorage.getItem("auth_user")).toBe(JSON.stringify(user));
    });

    it("calls the login endpoint with correct payload", async () => {
      mockedPost.mockResolvedValue({
        data: { user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 }, message: "Logged in successfully." },
        headers: { authorization: "Bearer tok" },
      });

      await useAuthStore.getState().login("a@b.com", "pass123");

      expect(mockedPost).toHaveBeenCalledWith("/admin/auth/sign_in", {
        user: { email: "a@b.com", password: "pass123" },
      });
    });
  });

  describe("logout", () => {
    it("calls sign_out endpoint and clears user, token and localStorage", async () => {
      mockedDelete.mockResolvedValue({ data: { message: "Logged out successfully." } });
      localStorage.setItem("auth_token", "tok");
      localStorage.setItem("auth_user", '{"id":1}');
      useAuthStore.setState({
        user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
        token: "tok",
        isAuthenticated: true,
      });

      await useAuthStore.getState().logout();

      expect(mockedDelete).toHaveBeenCalledWith("/admin/auth/sign_out");
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(localStorage.getItem("auth_user")).toBeNull();
    });

    it("still clears state when sign_out API fails", async () => {
      mockedDelete.mockRejectedValue(new Error("Network error"));
      useAuthStore.setState({
        user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
        token: "tok",
        isAuthenticated: true,
      });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("loadFromStorage", () => {
    it("restores user and token from localStorage", () => {
      const user = { id: 1, email: "a@b.com", role: "admin", store_id: 1 };
      localStorage.setItem("auth_token", "stored-token");
      localStorage.setItem("auth_user", JSON.stringify(user));

      useAuthStore.getState().loadFromStorage();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.token).toBe("stored-token");
      expect(state.isAuthenticated).toBe(true);
    });

    it("does nothing when no token in storage", () => {
      useAuthStore.getState().loadFromStorage();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("clears invalid JSON from storage", () => {
      localStorage.setItem("auth_token", "tok");
      localStorage.setItem("auth_user", "not-json");

      useAuthStore.getState().loadFromStorage();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(localStorage.getItem("auth_token")).toBeNull();
    });
  });
});
