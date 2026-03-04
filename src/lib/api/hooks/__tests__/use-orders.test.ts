import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";

vi.mock("@/lib/api/client", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

import apiClient from "@/lib/api/client";
import { useOrders, useOrder, useUpdateOrderStatus } from "../use-orders";

const mockedGet = vi.mocked(apiClient.get);
const mockedPatch = vi.mocked(apiClient.patch);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  }
  return Wrapper;
}

describe("useOrders", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches orders list", async () => {
    const response = {
      orders: [{ id: 1, order_number: "#1001" }],
      meta: { current_page: 1, per_page: 20, total_pages: 1, total_count: 1 },
    };
    mockedGet.mockResolvedValue({ data: response });

    const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.orders).toHaveLength(1);
  });

  it("filters by status", async () => {
    mockedGet.mockResolvedValue({ data: { orders: [], meta: { current_page: 1, per_page: 20, total_pages: 0, total_count: 0 } } });

    renderHook(() => useOrders({ status: "pending" }), { wrapper: createWrapper() });

    await waitFor(() => expect(mockedGet).toHaveBeenCalledWith(expect.stringContaining("status=pending")));
  });
});

describe("useOrder", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches single order", async () => {
    mockedGet.mockResolvedValue({ data: { id: 1, order_number: "#1001", status: "pending" } });

    const { result } = renderHook(() => useOrder(1), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.order_number).toBe("#1001");
  });
});

describe("useUpdateOrderStatus", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends event to update order status", async () => {
    mockedPatch.mockResolvedValue({ data: { id: 1, status: "confirmed" } });

    const { result } = renderHook(() => useUpdateOrderStatus(), { wrapper: createWrapper() });
    result.current.mutate({ id: 1, event: "confirm" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedPatch).toHaveBeenCalledWith("/admin/orders/1", { event: "confirm" });
  });
});
