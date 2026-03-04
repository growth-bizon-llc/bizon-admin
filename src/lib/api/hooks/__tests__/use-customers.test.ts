import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";

vi.mock("@/lib/api/client", () => ({
  default: {
    get: vi.fn(),
  },
}));

import apiClient from "@/lib/api/client";
import { useCustomers, useCustomer } from "../use-customers";

const mockedGet = vi.mocked(apiClient.get);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  }
  return Wrapper;
}

describe("useCustomers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches customers list", async () => {
    mockedGet.mockResolvedValue({
      data: {
        customers: [{ id: 1, email: "test@test.com" }],
        meta: { current_page: 1, per_page: 20, total_pages: 1, total_count: 1 },
      },
    });

    const { result } = renderHook(() => useCustomers(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.customers).toHaveLength(1);
  });

  it("searches by query", async () => {
    mockedGet.mockResolvedValue({
      data: { customers: [], meta: { current_page: 1, per_page: 20, total_pages: 0, total_count: 0 } },
    });

    renderHook(() => useCustomers({ search: "test@test.com" }), { wrapper: createWrapper() });
    await waitFor(() => expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("q=test")));
  });
});

describe("useCustomer", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches a single customer", async () => {
    mockedGet.mockResolvedValue({ data: { id: 1, email: "john@test.com", first_name: "John" } });

    const { result } = renderHook(() => useCustomer(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.email).toBe("john@test.com");
  });
});
