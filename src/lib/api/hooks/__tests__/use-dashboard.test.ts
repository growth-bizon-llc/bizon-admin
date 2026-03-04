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
import { useDashboard } from "../use-dashboard";

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

describe("useDashboard", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches dashboard data", async () => {
    const dashboardData = {
      total_products: 10,
      total_orders: 25,
      total_customers: 50,
      total_revenue_cents: 100000,
      orders_by_status: { pending: 5, confirmed: 3 },
      recent_orders: [],
    };
    mockedGet.mockResolvedValue({ data: dashboardData });

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.total_products).toBe(10);
    expect(result.current.data?.total_revenue_cents).toBe(100000);
    expect(mockedGet).toHaveBeenCalledWith("/admin/dashboard");
  });
});
