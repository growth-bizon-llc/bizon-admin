import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
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
import { useLogin, useLogout } from "../use-auth";

const mockedPost = vi.mocked(apiClient.post);
const mockedDelete = vi.mocked(apiClient.delete);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  }
  return Wrapper;
}

describe("useLogin", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    vi.clearAllMocks();
  });

  it("calls login and redirects on success", async () => {
    mockedPost.mockResolvedValue({
      data: { user: { id: 1, email: "admin@test.com", role: "admin", store_id: 1 }, message: "Logged in successfully." },
      headers: { authorization: "Bearer test-token" },
    });

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    result.current.mutate({ email: "admin@test.com", password: "password" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});

describe("useLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clears auth state on logout and calls sign_out API", async () => {
    mockedDelete.mockResolvedValue({ data: { message: "Logged out successfully." } });
    useAuthStore.setState({
      user: { id: 1, email: "a@b.com", role: "admin", store_id: 1 },
      token: "tok",
      isAuthenticated: true,
    });

    Object.defineProperty(window, "location", {
      value: { href: "/dashboard", pathname: "/dashboard" },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });
    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
