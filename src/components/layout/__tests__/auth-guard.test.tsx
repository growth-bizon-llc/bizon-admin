import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test-utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import AuthGuard from "../auth-guard";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: mockReplace,
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/dashboard",
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    mockReplace.mockClear();
  });

  it("shows loading spinner initially", () => {
    renderWithProviders(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", async () => {
    renderWithProviders(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
  });

  it("renders children when authenticated", async () => {
    localStorage.setItem("auth_token", "valid-token");
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: 1, email: "admin@test.com", role: "admin", store_id: 1 })
    );

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
  });
});
