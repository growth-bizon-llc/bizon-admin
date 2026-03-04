import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent, waitFor } from "@/test-utils";
import { useAuthStore } from "@/lib/stores/auth-store";
import LoginPage from "@/app/login/page";

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/login",
}));

vi.mock("@/lib/api/client", () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from "@/lib/api/client";
const mockedPost = vi.mocked(apiClient.post);

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText("Bizon Admin")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    });
  });

  it("shows validation error for short password", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("Password"), "12345");
    await user.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    mockedPost.mockResolvedValue({
      data: { user: { id: 1, email: "admin@test.com", role: "admin", store_id: 1 }, message: "Logged in successfully." },
      headers: { authorization: "Bearer test-token" },
    });

    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText("Email"), "admin@test.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith("/admin/auth/sign_in", {
        user: { email: "admin@test.com", password: "password123" },
      });
    });
  });

  it("redirects to dashboard when already authenticated", async () => {
    localStorage.setItem("auth_token", "valid-token");
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: 1, email: "admin@test.com", role: "admin", store_id: 1 })
    );

    renderWithProviders(<LoginPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });
});
